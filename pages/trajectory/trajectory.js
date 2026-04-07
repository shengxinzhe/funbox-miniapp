// ============================================================
// 弹道预言 - Trajectory Prophet
// Physics prediction game
// ============================================================

var TOTAL_ROUNDS = 10
var GRAVITY = 0.3
var BALL_RADIUS = 8
var BOUNCE_DAMPING = 0.75  // energy retained on platform bounce
var WALL_DAMPING = 0.85    // energy retained on wall bounce

// Scoring thresholds (distance in display pixels)
function calcPoints(dist) {
  if (dist < 10)  return 100
  if (dist < 25)  return 80
  if (dist < 50)  return 60
  if (dist < 80)  return 40
  if (dist < 120) return 20
  return 5
}

// Generate a deterministic-ish config for each round
function generateRoundConfig(roundNum, canvasW, canvasH) {
  var angle = 30 + Math.random() * 40         // degrees
  var speed = 6 + Math.random() * 4

  // Number of platforms
  var minP, maxP
  if (roundNum <= 3)      { minP = 0; maxP = 2 }
  else if (roundNum <= 7) { minP = 1; maxP = 3 }
  else                    { minP = 2; maxP = 3 }
  var numPlatforms = minP + Math.floor(Math.random() * (maxP - minP + 1))

  var platforms = []
  for (var i = 0; i < numPlatforms; i++) {
    var pw = 60 + Math.random() * 60          // 60-120 px
    var px = canvasW * 0.15 + Math.random() * (canvasW * 0.65 - pw)
    var py = canvasH * 0.30 + Math.random() * (canvasH * 0.40)
    platforms.push({ x: px, y: py, w: pw, h: 10 })
  }

  return { angle: angle, speed: speed, platforms: platforms }
}

// Physics simulation: returns array of {x, y} positions + landing x
function simulate(config, canvasW, canvasH) {
  var rad = config.angle * Math.PI / 180
  var vx = config.speed * Math.cos(rad)
  var vy = -config.speed * Math.sin(rad)    // negative = up

  // Cannon mouth: left side, middle-ish height
  var bx = 30
  var by = canvasH - 40

  var positions = [{ x: bx, y: by }]
  var maxSteps = 2000
  var landingX = bx

  for (var step = 0; step < maxSteps; step++) {
    vy += GRAVITY
    bx += vx
    by += vy

    // Wall bounces
    if (bx - BALL_RADIUS < 0) {
      bx = BALL_RADIUS
      vx = Math.abs(vx) * WALL_DAMPING
    }
    if (bx + BALL_RADIUS > canvasW) {
      bx = canvasW - BALL_RADIUS
      vx = -Math.abs(vx) * WALL_DAMPING
    }

    // Platform collisions (top surface only, ball falling onto platform)
    for (var pi = 0; pi < config.platforms.length; pi++) {
      var plat = config.platforms[pi]
      if (vy > 0 &&
          by + BALL_RADIUS >= plat.y &&
          by + BALL_RADIUS <= plat.y + plat.h + Math.abs(vy) + 1 &&
          bx >= plat.x - BALL_RADIUS &&
          bx <= plat.x + plat.w + BALL_RADIUS) {
        by = plat.y - BALL_RADIUS
        vy = -Math.abs(vy) * BOUNCE_DAMPING
        vx *= 0.95  // slight friction on bounce
      }
    }

    // Record every few frames for trail
    if (step % 3 === 0) {
      positions.push({ x: bx, y: by })
    }

    // Landing: ball reaches or passes bottom
    if (by + BALL_RADIUS >= canvasH) {
      landingX = bx
      by = canvasH - BALL_RADIUS
      positions.push({ x: bx, y: by })
      break
    }

    // If ball goes way off top or sides with tiny velocity, end it
    if (by < -canvasH) {
      landingX = bx
      break
    }
  }

  return { positions: positions, landingX: landingX }
}

Page({
  data: {
    phase: 'home',      // home | playing | result
    fadeIn: false,

    // Canvas display dimensions
    canvasDisplayW: 300,
    canvasDisplayH: 360,

    // Game state
    round: 1,
    totalScore: 0,
    gameState: 'predict',   // predict | flying | result
    hasPrediction: false,

    // Score popup
    showScorePopup: false,
    lastPoints: 0,
    lastDistance: 0,

    // Result screen
    bestScore: 0,
    accuracy: 0,
    perfectCount: 0,
    isNewBest: false
  },

  // Internal (non-reactive) state
  _canvas: null,
  _ctx: null,
  _pixelRatio: 1,
  _canvasW: 300,         // actual canvas pixel width (display px)
  _canvasH: 360,
  _roundConfig: null,
  _predictionX: 0,
  _predictionY: 0,
  _simResult: null,
  _animTimer: null,
  _animFrame: 0,
  _roundScores: [],
  _perfectCount: 0,

  onLoad: function () {
    var best = wx.getStorageSync('trajectory_best') || 0
    this.setData({ bestScore: best })

    var sys = wx.getSystemInfoSync()
    var ratio = sys.pixelRatio || 1
    this._pixelRatio = ratio

    // Canvas display size: full width minus 80px margin, square-ish
    var dispW = sys.windowWidth - 80
    var dispH = Math.round(dispW * 1.1)  // slightly taller than wide
    this._canvasW = dispW
    this._canvasH = dispH

    this.setData({ canvasDisplayW: dispW, canvasDisplayH: dispH })

    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  onUnload: function () {
    this._stopAnim()
  },

  // ==============================
  // Navigation
  // ==============================

  startGame: function () {
    this._roundScores = []
    this._perfectCount = 0

    this.setData({
      phase: 'playing',
      round: 1,
      totalScore: 0,
      gameState: 'predict',
      hasPrediction: false,
      showScorePopup: false
    })

    var self = this
    // Wait for canvas to render, then init
    setTimeout(function () {
      self._initCanvas(function () {
        self._startRound(1)
      })
    }, 150)
  },

  restartGame: function () {
    this.startGame()
  },

  goHome: function () {
    this._stopAnim()
    this.setData({ phase: 'home' })
  },

  // ==============================
  // Canvas Init
  // ==============================

  _initCanvas: function (cb) {
    var self = this
    wx.createSelectorQuery()
      .select('#trajCanvas')
      .fields({ node: true, size: true })
      .exec(function (res) {
        if (!res || !res[0] || !res[0].node) {
          // Retry once
          setTimeout(function () { self._initCanvas(cb) }, 100)
          return
        }
        var canvas = res[0].node
        self._canvas = canvas

        var ratio = self._pixelRatio
        canvas.width  = self._canvasW * ratio
        canvas.height = self._canvasH * ratio

        var ctx = canvas.getContext('2d')
        ctx.scale(ratio, ratio)
        self._ctx = ctx

        if (cb) cb()
      })
  },

  // ==============================
  // Round Logic
  // ==============================

  _startRound: function (roundNum) {
    this._stopAnim()
    var config = generateRoundConfig(roundNum, this._canvasW, this._canvasH)
    this._roundConfig = config
    this._predictionX = -1
    this._predictionY = -1
    this._simResult = null

    this.setData({
      round: roundNum,
      gameState: 'predict',
      hasPrediction: false,
      showScorePopup: false
    })

    this._drawScene(config, null, null)
  },

  // ==============================
  // Touch on canvas = set prediction
  // ==============================

  onCanvasTouch: function (e) {
    if (this.data.gameState !== 'predict') return
    var touch = e.touches[0]

    // Touch coordinates are relative to the canvas element
    var tx = touch.x !== undefined ? touch.x : touch.clientX
    var ty = touch.y !== undefined ? touch.y : touch.clientY

    // Clamp to canvas bounds
    tx = Math.max(0, Math.min(this._canvasW, tx))
    ty = Math.max(0, Math.min(this._canvasH, ty))

    this._predictionX = tx
    this._predictionY = ty

    this.setData({ hasPrediction: true })

    // Redraw scene with prediction marker
    this._drawScene(this._roundConfig, tx, ty)
  },

  // ==============================
  // Fire button
  // ==============================

  onFireTap: function () {
    if (this.data.gameState !== 'predict') return
    if (!this.data.hasPrediction) return

    this.setData({ gameState: 'flying' })
    wx.vibrateShort({ type: 'light' })

    // Run simulation
    var sim = simulate(this._roundConfig, this._canvasW, this._canvasH)
    this._simResult = sim

    // Animate the trajectory
    this._animFrame = 0
    this._animateFlight(sim)
  },

  // ==============================
  // Animation
  // ==============================

  _animateFlight: function (sim) {
    var self = this
    var positions = sim.positions
    var totalFrames = positions.length

    // Draw at ~30fps (33ms)
    this._animTimer = setInterval(function () {
      self._animFrame += 2  // step 2 positions per frame for speed
      if (self._animFrame >= totalFrames) {
        self._animFrame = totalFrames - 1
        self._stopAnim()
        self._onFlightComplete(sim)
        return
      }

      // Draw current state
      self._drawFlightFrame(
        self._roundConfig,
        positions,
        self._animFrame,
        self._predictionX,
        self._predictionY
      )
    }, 33)
  },

  _stopAnim: function () {
    if (this._animTimer) {
      clearInterval(this._animTimer)
      this._animTimer = null
    }
  },

  _onFlightComplete: function (sim) {
    var landingX = sim.landingX
    var predX = this._predictionX
    // Score based on x-distance to landing (prediction is an x-axis comparison at bottom)
    var dist = Math.abs(predX - landingX)
    var pts = calcPoints(dist)

    this._roundScores.push(pts)
    if (pts === 100) this._perfectCount++

    var newTotal = this.data.totalScore + pts

    // Draw final frame with landing explosion and prediction error
    this._drawFinalFrame(
      this._roundConfig,
      sim.positions,
      landingX,
      this._predictionX,
      this._predictionY,
      Math.round(dist),
      pts
    )

    this.setData({
      totalScore: newTotal,
      gameState: 'result',
      showScorePopup: true,
      lastPoints: pts,
      lastDistance: Math.round(dist)
    })

    wx.vibrateShort({ type: pts >= 80 ? 'medium' : 'light' })

    var self = this
    // Auto-advance after 1.8s
    setTimeout(function () {
      self.setData({ showScorePopup: false })
      var nextRound = self.data.round + 1
      if (nextRound > TOTAL_ROUNDS) {
        // Game over
        setTimeout(function () { self._showResult(newTotal) }, 400)
      } else {
        setTimeout(function () { self._startRound(nextRound) }, 300)
      }
    }, 1800)
  },

  _showResult: function (total) {
    var best = this.data.bestScore
    var isNew = total > best
    if (isNew) {
      best = total
      wx.setStorageSync('trajectory_best', best)
    }
    var accuracy = Math.round((total / (TOTAL_ROUNDS * 100)) * 100)

    this.setData({
      phase: 'result',
      bestScore: best,
      accuracy: accuracy,
      perfectCount: this._perfectCount,
      isNewBest: isNew
    })
  },

  // ==============================
  // Drawing
  // ==============================

  _drawScene: function (config, predX, predY) {
    var ctx = this._ctx
    if (!ctx) return
    var W = this._canvasW
    var H = this._canvasH

    this._clearCanvas(ctx, W, H)
    this._drawGrid(ctx, W, H)
    this._drawPlatforms(ctx, config.platforms)
    this._drawCannon(ctx, config.angle, H)
    this._drawLandingZone(ctx, W, H)

    if (predX >= 0 && predY >= 0) {
      this._drawPredictionMarker(ctx, predX, predY)
    }
  },

  _drawFlightFrame: function (config, positions, frameIdx, predX, predY) {
    var ctx = this._ctx
    if (!ctx) return
    var W = this._canvasW
    var H = this._canvasH

    this._clearCanvas(ctx, W, H)
    this._drawGrid(ctx, W, H)
    this._drawPlatforms(ctx, config.platforms)
    this._drawCannon(ctx, config.angle, H)
    this._drawLandingZone(ctx, W, H)

    // Draw trail
    if (frameIdx > 1) {
      ctx.beginPath()
      ctx.setLineDash([4, 6])
      ctx.strokeStyle = 'rgba(88, 86, 214, 0.30)'
      ctx.lineWidth = 2
      ctx.moveTo(positions[0].x, positions[0].y)
      for (var i = 1; i <= frameIdx; i++) {
        ctx.lineTo(positions[i].x, positions[i].y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw ball at current position
    var pos = positions[frameIdx]
    this._drawBall(ctx, pos.x, pos.y)

    // Prediction marker stays visible
    if (predX >= 0) {
      this._drawPredictionMarker(ctx, predX, predY)
    }
  },

  _drawFinalFrame: function (config, positions, landingX, predX, predY, dist, pts) {
    var ctx = this._ctx
    if (!ctx) return
    var W = this._canvasW
    var H = this._canvasH

    this._clearCanvas(ctx, W, H)
    this._drawGrid(ctx, W, H)
    this._drawPlatforms(ctx, config.platforms)
    this._drawCannon(ctx, config.angle, H)
    this._drawLandingZone(ctx, W, H)

    // Full trajectory trail
    ctx.beginPath()
    ctx.setLineDash([4, 6])
    ctx.strokeStyle = 'rgba(88, 86, 214, 0.25)'
    ctx.lineWidth = 2
    ctx.moveTo(positions[0].x, positions[0].y)
    for (var i = 1; i < positions.length; i++) {
      ctx.lineTo(positions[i].x, positions[i].y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Landing explosion
    this._drawExplosion(ctx, landingX, H - BALL_RADIUS, pts)

    // Landing marker (where ball actually landed)
    ctx.beginPath()
    ctx.strokeStyle = '#5856D6'
    ctx.lineWidth = 3
    ctx.moveTo(landingX, H - 30)
    ctx.lineTo(landingX, H)
    ctx.stroke()
    // Arrow head
    ctx.beginPath()
    ctx.fillStyle = '#5856D6'
    ctx.moveTo(landingX, H - 32)
    ctx.lineTo(landingX - 7, H - 20)
    ctx.lineTo(landingX + 7, H - 20)
    ctx.closePath()
    ctx.fill()

    // Prediction marker
    if (predX >= 0) {
      this._drawPredictionMarker(ctx, predX, predY)
      // Draw a line from prediction x at bottom to show comparison
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 59, 48, 0.4)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 4])
      ctx.moveTo(predX, H)
      ctx.lineTo(landingX, H - 4)
      ctx.stroke()
      ctx.setLineDash([])
    }
  },

  // ==============================
  // Draw Helpers
  // ==============================

  _clearCanvas: function (ctx, W, H) {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, W, H)
  },

  _drawGrid: function (ctx, W, H) {
    ctx.strokeStyle = '#F0F0F0'
    ctx.lineWidth = 1
    var step = 40
    for (var gx = step; gx < W; gx += step) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, H)
      ctx.stroke()
    }
    for (var gy = step; gy < H; gy += step) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(W, gy)
      ctx.stroke()
    }
    // Ground line
    ctx.strokeStyle = '#E5E5EA'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, H - 2)
    ctx.lineTo(W, H - 2)
    ctx.stroke()
  },

  _drawPlatforms: function (ctx, platforms) {
    for (var i = 0; i < platforms.length; i++) {
      var p = platforms[i]
      // Shadow
      ctx.shadowColor = 'rgba(0,0,0,0.08)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetY = 3
      ctx.fillStyle = '#E5E5EA'
      this._roundRect(ctx, p.x, p.y, p.w, p.h, 5)
      ctx.fill()
      // Top highlight
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      this._roundRect(ctx, p.x, p.y, p.w, 3, 2)
      ctx.fill()
    }
  },

  _drawCannon: function (ctx, angleDeg, H) {
    var cx = 24
    var cy = H - 36

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-angleDeg * Math.PI / 180)

    // Barrel
    ctx.fillStyle = '#3A3A3C'
    this._roundRect(ctx, 0, -7, 36, 14, 5)
    ctx.fill()
    // Barrel highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    this._roundRect(ctx, 2, -5, 32, 5, 3)
    ctx.fill()

    ctx.restore()

    // Cannon base (circle)
    ctx.beginPath()
    ctx.arc(cx, cy, 14, 0, Math.PI * 2)
    ctx.fillStyle = '#3A3A3C'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#636366'
    ctx.fill()
  },

  _drawBall: function (ctx, x, y) {
    // Glow
    var grd = ctx.createRadialGradient(x, y, 0, x, y, BALL_RADIUS * 2.5)
    grd.addColorStop(0, 'rgba(88, 86, 214, 0.3)')
    grd.addColorStop(1, 'rgba(88, 86, 214, 0)')
    ctx.beginPath()
    ctx.arc(x, y, BALL_RADIUS * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()

    // Ball body
    ctx.beginPath()
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = '#5856D6'
    ctx.fill()

    // Highlight
    ctx.beginPath()
    ctx.arc(x - 2, y - 2, BALL_RADIUS * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fill()
  },

  _drawPredictionMarker: function (ctx, x, y) {
    var r = 16
    var r2 = 8

    // Outer ring
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#FF3B30'
    ctx.lineWidth = 2
    ctx.stroke()

    // Inner dot
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#FF3B30'
    ctx.fill()

    // Crosshair lines
    ctx.strokeStyle = '#FF3B30'
    ctx.lineWidth = 1.5
    // Horizontal
    ctx.beginPath()
    ctx.moveTo(x - r - 4, y)
    ctx.lineTo(x - r2, y)
    ctx.moveTo(x + r2, y)
    ctx.lineTo(x + r + 4, y)
    ctx.stroke()
    // Vertical
    ctx.beginPath()
    ctx.moveTo(x, y - r - 4)
    ctx.lineTo(x, y - r2)
    ctx.moveTo(x, y + r2)
    ctx.lineTo(x, y + r + 4)
    ctx.stroke()

    // "预测" label
    ctx.fillStyle = '#FF3B30'
    ctx.font = '11px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('预测', x, y - r - 8)
  },

  _drawLandingZone: function (ctx, W, H) {
    // Subtle landing zone indicator at bottom
    var grad = ctx.createLinearGradient(0, H - 20, 0, H)
    grad.addColorStop(0, 'rgba(88, 86, 214, 0.05)')
    grad.addColorStop(1, 'rgba(88, 86, 214, 0.12)')
    ctx.fillStyle = grad
    ctx.fillRect(0, H - 20, W, 20)
    ctx.fillStyle = '#86868B'
    ctx.font = '10px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('落地区域', W / 2, H - 5)
  },

  _drawExplosion: function (ctx, x, y, pts) {
    var color = pts >= 80 ? '#34C759' : pts >= 40 ? '#FF9500' : '#FF3B30'
    var numParticles = 12
    for (var i = 0; i < numParticles; i++) {
      var angle = (Math.PI * 2 / numParticles) * i
      var dist = 10 + Math.random() * 14
      var px = x + Math.cos(angle) * dist
      var py = y + Math.sin(angle) * dist
      var r = 2 + Math.random() * 3
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }
    // Flash ring
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.5
    ctx.stroke()
    ctx.globalAlpha = 1
  },

  _roundRect: function (ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  },

  // ==============================
  // Share
  // ==============================

  onShareAppMessage: function () {
    return {
      title: '我在弹道预言中得了' + this.data.totalScore + '分！你能预测炮弹落点吗？',
      path: '/pages/trajectory/trajectory'
    }
  },

  onShareTimeline: function () {
    return { title: '弹道预言 - 物理直觉实验' }
  }
})
