var PLAYER_R = 14
var BALL_R_MIN = 6
var BALL_R_MAX = 16
var SPAWN_INTERVAL_START = 900
var SPAWN_INTERVAL_MIN = 300
var SPEED_START = 2
var SPEED_MAX = 7

Page({
  data: {
    phase: 'intro',   // intro, playing, dead
    canvasW: 300,
    canvasH: 500,
    score: 0,
    bestScore: 0,
    fadeIn: false,
    level: 1,
    levelName: ''
  },

  onLoad: function () {
    var best = wx.getStorageSync('dodge_best') || 0
    this.setData({ bestScore: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)

    // Get canvas size from system
    var sys = wx.getSystemInfoSync()
    var w = sys.windowWidth
    var h = sys.windowHeight - 44 // nav bar
    this.setData({ canvasW: w, canvasH: h })
  },

  onUnload: function () {
    this._stop()
  },

  startGame: function () {
    this.player = { x: this.data.canvasW / 2, y: this.data.canvasH * 0.75 }
    this.balls = []
    this._score = 0
    this._alive = true
    this._startTime = Date.now()
    this._lastSpawn = 0
    this._touching = false
    this._level = 1

    this.setData({ phase: 'playing', score: 0, level: 1, levelName: '初级' })

    var self = this
    this.ctx = wx.createCanvasContext('dodgeCanvas', this)
    this._raf = setInterval(function () { self._tick() }, 16)
    wx.vibrateShort({ type: 'light' })
  },

  _stop: function () {
    if (this._raf) { clearInterval(this._raf); this._raf = null }
  },

  // Touch controls - player follows finger
  onTouchStart: function (e) {
    if (!this._alive) return
    this._touching = true
    var t = e.touches[0]
    this.player.x = t.clientX
    this.player.y = t.clientY - 44
  },

  onTouchMove: function (e) {
    if (!this._alive || !this._touching) return
    var t = e.touches[0]
    this.player.x = Math.max(PLAYER_R, Math.min(this.data.canvasW - PLAYER_R, t.clientX))
    this.player.y = Math.max(PLAYER_R, Math.min(this.data.canvasH - PLAYER_R, t.clientY - 44))
  },

  onTouchEnd: function () {
    this._touching = false
  },

  _tick: function () {
    if (!this._alive) return
    var now = Date.now()
    var elapsed = (now - this._startTime) / 1000
    var W = this.data.canvasW
    var H = this.data.canvasH

    // Difficulty scaling
    var level = Math.min(10, Math.floor(elapsed / 8) + 1)
    var spawnInterval = Math.max(SPAWN_INTERVAL_MIN, SPAWN_INTERVAL_START - level * 60)
    var speedMul = Math.min(SPEED_MAX, SPEED_START + level * 0.5)

    if (level !== this._level) {
      this._level = level
      var names = ['初级','入门','进阶','困难','噩梦','地狱','炼狱','深渊','传说','神话']
      this.setData({ level: level, levelName: names[level - 1] || '神话' })
    }

    // Score = survived seconds
    var score = Math.floor(elapsed)
    if (score !== this._score) {
      this._score = score
      this.setData({ score: score })
    }

    // Spawn balls
    if (now - this._lastSpawn > spawnInterval) {
      this._lastSpawn = now
      var r = BALL_R_MIN + Math.random() * (BALL_R_MAX - BALL_R_MIN)
      var side = Math.floor(Math.random() * 4)
      var bx, by, vx, vy
      if (side === 0) { // top
        bx = Math.random() * W; by = -r
        vx = (Math.random() - 0.5) * speedMul
        vy = (0.5 + Math.random() * 0.5) * speedMul
      } else if (side === 1) { // bottom
        bx = Math.random() * W; by = H + r
        vx = (Math.random() - 0.5) * speedMul
        vy = -(0.5 + Math.random() * 0.5) * speedMul
      } else if (side === 2) { // left
        bx = -r; by = Math.random() * H
        vx = (0.5 + Math.random() * 0.5) * speedMul
        vy = (Math.random() - 0.5) * speedMul
      } else { // right
        bx = W + r; by = Math.random() * H
        vx = -(0.5 + Math.random() * 0.5) * speedMul
        vy = (Math.random() - 0.5) * speedMul
      }

      // Higher levels: some balls aim at player
      if (level >= 3 && Math.random() < 0.3) {
        var dx = this.player.x - bx
        var dy = this.player.y - by
        var dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0) {
          vx = dx / dist * speedMul * 0.8
          vy = dy / dist * speedMul * 0.8
        }
      }

      this.balls.push({ x: bx, y: by, vx: vx, vy: vy, r: r, hue: Math.floor(Math.random() * 360) })
    }

    // Update balls
    var alive = []
    for (var i = 0; i < this.balls.length; i++) {
      var b = this.balls[i]
      b.x += b.vx
      b.y += b.vy
      // Remove if way off screen
      if (b.x < -60 || b.x > W + 60 || b.y < -60 || b.y > H + 60) continue
      alive.push(b)

      // Collision check
      var dx = b.x - this.player.x
      var dy = b.y - this.player.y
      var dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < b.r + PLAYER_R) {
        this._die()
        return
      }
    }
    this.balls = alive

    // Draw
    this._draw()
  },

  _draw: function () {
    var ctx = this.ctx
    var W = this.data.canvasW
    var H = this.data.canvasH
    ctx.clearRect(0, 0, W, H)

    // Dark background fill
    ctx.setFillStyle('#0a0a1a')
    ctx.fillRect(0, 0, W, H)

    // Draw grid bg (subtle)
    ctx.setStrokeStyle('rgba(255,255,255,0.05)')
    ctx.setLineWidth(1)
    for (var gx = 0; gx < W; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke()
    }
    for (var gy = 0; gy < H; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
    }

    // Draw balls with glow - bright neon colors
    for (var i = 0; i < this.balls.length; i++) {
      var b = this.balls[i]
      // Outer glow
      var gradient = ctx.createCircularGradient(b.x, b.y, b.r * 2.5)
      gradient.addColorStop(0, 'hsla(' + b.hue + ',100%,70%,0.4)')
      gradient.addColorStop(1, 'hsla(' + b.hue + ',100%,70%,0)')
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.r * 2.5, 0, Math.PI * 2)
      ctx.setFillStyle(gradient)
      ctx.fill()
      // Ball core - bright neon
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx.setFillStyle('hsl(' + b.hue + ',100%,70%)')
      ctx.fill()
      // White highlight
      ctx.beginPath()
      ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.35, 0, Math.PI * 2)
      ctx.setFillStyle('rgba(255,255,255,0.5)')
      ctx.fill()
    }

    // Draw player with glow
    var px = this.player.x
    var py = this.player.y
    var pglow = ctx.createCircularGradient(px, py, PLAYER_R * 3)
    pglow.addColorStop(0, 'rgba(34,197,94,0.25)')
    pglow.addColorStop(1, 'rgba(34,197,94,0)')
    ctx.beginPath()
    ctx.arc(px, py, PLAYER_R * 3, 0, Math.PI * 2)
    ctx.setFillStyle(pglow)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(px, py, PLAYER_R, 0, Math.PI * 2)
    ctx.setFillStyle('#22c55e')
    ctx.fill()

    // Inner highlight
    ctx.beginPath()
    ctx.arc(px - 3, py - 3, PLAYER_R * 0.4, 0, Math.PI * 2)
    ctx.setFillStyle('rgba(255,255,255,0.4)')
    ctx.fill()

    ctx.draw()
  },

  _die: function () {
    this._alive = false
    this._stop()
    wx.vibrateShort({ type: 'heavy' })

    var score = this._score
    var best = this.data.bestScore
    if (score > best) {
      wx.setStorageSync('dodge_best', score)
      best = score
    }
    this.setData({ phase: 'dead', score: score, bestScore: best })
  },

  restart: function () {
    this.startGame()
  },

  onShareAppMessage: function () {
    return {
      title: '我在躲避小球中存活了' + this.data.score + '秒！你能超过我吗？',
      path: '/pages/dodge/dodge'
    }
  },

  onShareTimeline: function () {
    return { title: '躲避小球 - 智变纪趣味实验室' }
  }
})