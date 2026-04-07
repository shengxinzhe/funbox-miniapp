var engine = require('./rd-engine')

// Color palette: B concentration -> RGBA
// Deep black -> Deep blue -> Neural purple -> Active cyan -> High white -> Overactive red
var PALETTE = []
;(function buildPalette() {
  var stops = [
    { pos: 0.0, r: 10, g: 10, b: 26 },
    { pos: 0.15, r: 13, g: 27, b: 75 },
    { pos: 0.3, r: 59, g: 31, b: 107 },
    { pos: 0.5, r: 14, g: 200, b: 170 },
    { pos: 0.7, r: 14, g: 240, b: 192 },
    { pos: 0.85, r: 232, g: 244, b: 255 },
    { pos: 1.0, r: 255, g: 58, b: 110 }
  ]
  for (var i = 0; i <= 255; i++) {
    var t = i / 255
    // Find segment
    var s0 = stops[0], s1 = stops[1]
    for (var j = 1; j < stops.length; j++) {
      if (t <= stops[j].pos) { s0 = stops[j - 1]; s1 = stops[j]; break }
    }
    var f = (t - s0.pos) / (s1.pos - s0.pos)
    if (f < 0) f = 0; if (f > 1) f = 1
    PALETTE.push({
      r: Math.round(s0.r + (s1.r - s0.r) * f),
      g: Math.round(s0.g + (s1.g - s0.g) * f),
      b: Math.round(s0.b + (s1.b - s0.b) * f)
    })
  }
})()

// Level definitions: target patterns with f/k parameters
var LEVELS = [
  { name: '初始涌现', desc: '观察混沌中秩序的诞生', f: 0.037, k: 0.06, goal: 'any', goalCrystal: 0.05, time: 0, difficulty: 1 },
  { name: '珊瑚迷宫', desc: '培育稳定的珊瑚结构', f: 0.037, k: 0.06, goal: 'coral', goalCrystal: 0.15, time: 0, difficulty: 1 },
  { name: '斑点分裂', desc: '让斑点自我复制', f: 0.025, k: 0.05, goal: 'spots', goalCrystal: 0.20, time: 0, difficulty: 2 },
  { name: '神经树突', desc: '引导树枝状延伸生长', f: 0.029, k: 0.057, goal: 'dendrite', goalCrystal: 0.12, time: 0, difficulty: 2 },
  { name: '蠕虫行进', desc: '虫形波的诞生', f: 0.039, k: 0.058, goal: 'worm', goalCrystal: 0.10, time: 0, difficulty: 3 },
  { name: '混沌边缘', desc: '在秩序与混沌之间找到平衡', f: 0.014, k: 0.054, goal: 'chaos', goalCrystal: 0.25, time: 0, difficulty: 3 },
  { name: '脉冲之花', desc: '催化出放射状花形', f: 0.055, k: 0.062, goal: 'flower', goalCrystal: 0.18, time: 0, difficulty: 4 },
  { name: '迷宫编织', desc: '编织复杂的迷宫纹路', f: 0.029, k: 0.057, goal: 'maze', goalCrystal: 0.30, time: 0, difficulty: 4 },
  { name: '晶格排列', desc: '稳定的六角晶格', f: 0.039, k: 0.058, goal: 'crystal', goalCrystal: 0.35, time: 0, difficulty: 5 },
  { name: '意识风暴', desc: '所有形态的终极融合', f: 0.030, k: 0.055, goal: 'storm', goalCrystal: 0.40, time: 0, difficulty: 5 }
]

// Specimen naming
var MORPHO_NAMES = ['Turing', 'Voronoi', 'Spiral', 'Dendrite', 'Labyrinth', 'Coral', 'Pulse', 'Wave', 'Crystal', 'Nebula']
var SUFFIX_NAMES = ['-\u03b1', '-\u03b2', '-\u03c7', '-\u03b4', '-\u03b5', '-\u03c6']

function genSpecimenName(stats, levelIdx) {
  var mi = Math.floor(stats.entropy * 10) % MORPHO_NAMES.length
  var si = Math.floor(stats.crystalRatio * 10) % SUFFIX_NAMES.length
  return MORPHO_NAMES[mi] + SUFFIX_NAMES[si] + '_' + String(levelIdx + 1).padStart(3, '0')
}

// Particles for touch trails
var MAX_PARTICLES = 150

Page({
  data: {
    phase: 'home',        // home | playing | result | gallery | free
    level: 0,
    levelName: '',
    levelDesc: '',
    levelDifficulty: 1,
    totalLevels: LEVELS.length,
    unlockedLevel: 0,
    // Playing state
    score: 0,
    crystalPct: 0,
    entropyVal: 0,
    touchCount: 0,
    elapsedTime: 0,
    showTutorial: true,
    tutorialStep: 0,
    // Result
    resultName: '',
    resultScore: 0,
    resultCrystal: 0,
    resultEntropy: 0,
    resultTouches: 0,
    resultTime: 0,
    resultGrade: '',
    // Gallery
    specimens: [],
    specimenCount: 0,
    // Free mode
    freeMode: false,
    // Time display
    timeDisplay: '00:00',
    // Level list for WXML rendering
    levelList: [],
    // Stats display
    statsA: '0.00',
    statsB: '0.00',
    statsCrystal: '0%',
    statsEntropy: '0.00',
    // Canvas
    canvasWidth: 300,
    canvasHeight: 300,
    pixelRatio: 1
  },

  // Engine instance
  _engine: null,
  _raf: null,
  _frameTimer: null,
  _startTime: 0,
  _timeTimer: null,
  _particles: [],
  _canvasCtx: null,
  _imgData: null,
  _simW: 96,
  _simH: 96,
  _canvasW: 300,
  _canvasH: 300,
  _touchActive: false,
  _lastTouchX: 0,
  _lastTouchY: 0,
  _stepsPerFrame: 4,

  onLoad: function () {
    var info = wx.getSystemInfoSync()
    var pr = info.pixelRatio || 2
    var screenW = info.windowWidth
    var canvasSize = Math.min(screenW - 40, 350)

    // Use 96x96 for better mobile performance, scale up via canvas
    var simSize = 96
    if (info.benchmarkLevel && info.benchmarkLevel >= 30) {
      simSize = 128
    }

    this._simW = simSize
    this._simH = simSize
    this._canvasW = canvasSize
    this._canvasH = canvasSize

    // Build level list for WXML
    var levelList = LEVELS.map(function (lv) {
      var dots = []
      for (var d = 0; d < lv.difficulty; d++) dots.push(d)
      return { name: lv.name, desc: lv.desc, difficulty: lv.difficulty, dots: dots }
    })

    this.setData({
      canvasWidth: canvasSize,
      canvasHeight: canvasSize,
      pixelRatio: pr,
      levelList: levelList
    })

    // Load progress
    var saved = wx.getStorageSync('neural_ink_progress')
    if (saved) {
      this.setData({
        unlockedLevel: saved.unlockedLevel || 0,
        specimens: saved.specimens || [],
        specimenCount: (saved.specimens || []).length
      })
    }

    // Check tutorial
    var tutorialDone = wx.getStorageSync('neural_ink_tutorial')
    if (tutorialDone) {
      this.setData({ showTutorial: false })
    }
  },

  onReady: function () {
    // Canvas will be initialized when entering playing/free phase
  },

  onUnload: function () {
    this._stopLoop()
    this._stopTimeCounter()
  },

  onHide: function () {
    this._stopLoop()
  },

  onShow: function () {
    if (this.data.phase === 'playing' || this.data.phase === 'free') {
      this._startLoop()
    }
  },

  // ========== Canvas Setup ==========
  _initCanvas: function () {
    var self = this
    // Reset offscreen canvas references so they get recreated
    this._tmpCanvas = null
    this._tmpCtx = null
    this._noOffscreen = false

    var query = wx.createSelectorQuery()
    query.select('#rdCanvas')
      .fields({ node: true, size: true })
      .exec(function (res) {
        if (!res || !res[0] || !res[0].node) {
          self._useOldCanvas = true
          return
        }
        var canvas = res[0].node
        var ctx = canvas.getContext('2d')
        var pr = self.data.pixelRatio

        canvas.width = self._canvasW * pr
        canvas.height = self._canvasH * pr
        ctx.scale(pr, pr)

        self._canvas = canvas
        self._canvasCtx = ctx
        self._imgData = ctx.createImageData(self._simW, self._simH)
      })
  },

  // ========== Game Flow ==========
  onStartLevel: function (e) {
    var lvl = e.currentTarget.dataset.level
    if (lvl === undefined) lvl = this.data.level
    lvl = parseInt(lvl)
    if (lvl > this.data.unlockedLevel) return

    var levelDef = LEVELS[lvl]
    this._engine = engine.createEngine(this._simW, this._simH)
    this._engine.init(levelDef.f, levelDef.k)
    this._particles = []
    this._startTime = Date.now()

    this.setData({
      phase: 'playing',
      level: lvl,
      levelName: levelDef.name,
      levelDesc: levelDef.desc,
      levelDifficulty: levelDef.difficulty,
      score: 0,
      crystalPct: 0,
      entropyVal: 0,
      touchCount: 0,
      elapsedTime: 0,
      freeMode: false
    })

    // Re-init canvas after phase change renders the canvas element
    var self = this
    setTimeout(function () {
      self._initCanvas()
      // Wait for canvas to be ready, then start
      self._waitCanvasAndStart()
    }, 100)
  },

  onStartFree: function () {
    this._engine = engine.createEngine(this._simW, this._simH)
    this._engine.init(0.037, 0.06)
    this._particles = []
    this._startTime = Date.now()

    this.setData({
      phase: 'free',
      freeMode: true,
      touchCount: 0,
      elapsedTime: 0
    })

    var self = this
    setTimeout(function () {
      self._initCanvas()
      self._waitCanvasAndStart()
    }, 100)
  },

  _waitCanvasAndStart: function () {
    var self = this
    var retries = 0
    function check() {
      if (self._canvasCtx) {
        self._startTimeCounter()
        self._startLoop()
      } else if (retries < 20) {
        retries++
        setTimeout(check, 100)
      }
    }
    setTimeout(check, 150)
  },

  onFinishExperiment: function () {
    this._stopLoop()
    this._stopTimeCounter()

    if (this.data.freeMode) {
      this._saveSpecimen()
      this.setData({ phase: 'home' })
      return
    }

    var stats = this._engine.getStats()
    var lvl = LEVELS[this.data.level]

    // Score calculation
    var crystalScore = Math.min(40, Math.round((stats.crystalRatio / Math.max(0.01, lvl.goalCrystal)) * 40))
    var stabilityScore = Math.round((1 - Math.abs(stats.entropy - 0.5) * 2) * 30)
    if (stabilityScore < 0) stabilityScore = 0
    var touchPenalty = Math.min(20, Math.max(0, 20 - Math.floor(this.data.touchCount / 5)))
    var emergenceBonus = stats.entropy > 0.3 && stats.entropy < 0.7 ? 10 : Math.round(stats.entropy * 5)
    var total = crystalScore + stabilityScore + touchPenalty + emergenceBonus
    if (total > 100) total = 100

    var grade = total >= 90 ? 'S' : total >= 75 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : 'D'

    this.setData({
      phase: 'result',
      resultScore: total,
      resultCrystal: Math.round(stats.crystalRatio * 100),
      resultEntropy: stats.entropy.toFixed(2),
      resultTouches: this.data.touchCount,
      resultTime: this.data.elapsedTime,
      resultGrade: grade,
      resultName: genSpecimenName(stats, this.data.level)
    })

    // Unlock next level
    if (total >= 40 && this.data.level >= this.data.unlockedLevel && this.data.level < LEVELS.length - 1) {
      this.setData({ unlockedLevel: this.data.level + 1 })
    }

    this._saveSpecimen()
    this._saveProgress()
  },

  _saveSpecimen: function () {
    var stats = this._engine.getStats()
    var specimen = {
      name: genSpecimenName(stats, this.data.level),
      level: this.data.level,
      score: this.data.resultScore || 0,
      crystalRatio: Math.round(stats.crystalRatio * 100),
      entropy: stats.entropy.toFixed(2),
      date: new Date().toLocaleDateString(),
      params: this._engine.getParams()
    }
    var specimens = this.data.specimens.slice()
    specimens.unshift(specimen)
    if (specimens.length > 60) specimens = specimens.slice(0, 60)
    this.setData({
      specimens: specimens,
      specimenCount: specimens.length
    })
    this._saveProgress()
  },

  _saveProgress: function () {
    wx.setStorageSync('neural_ink_progress', {
      unlockedLevel: this.data.unlockedLevel,
      specimens: this.data.specimens
    })
  },

  // ========== Time Counter ==========
  _startTimeCounter: function () {
    var self = this
    this._timeTimer = setInterval(function () {
      var s = Math.floor((Date.now() - self._startTime) / 1000)
      var m = Math.floor(s / 60)
      var sec = s % 60
      var display = (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec
      self.setData({ elapsedTime: s, timeDisplay: display })
    }, 1000)
  },

  _stopTimeCounter: function () {
    if (this._timeTimer) {
      clearInterval(this._timeTimer)
      this._timeTimer = null
    }
  },

  // ========== Render Loop ==========
  _startLoop: function () {
    this._stopLoop()
    var self = this
    function frame() {
      if (!self._engine) return
      self._engine.stepN(self._stepsPerFrame)
      self._updateParticles()
      self._render()
      self._updateStats()
      self._frameTimer = setTimeout(frame, 33) // ~30fps for stability
    }
    frame()
  },

  _stopLoop: function () {
    if (this._frameTimer) {
      clearTimeout(this._frameTimer)
      this._frameTimer = null
    }
  },

  // ========== Rendering ==========
  _render: function () {
    if (!this._canvasCtx || !this._engine) return
    var ctx = this._canvasCtx
    var B = this._engine.getB()
    var w = this._simW
    var h = this._simH
    var cw = this._canvasW
    var ch = this._canvasH

    // Method: draw pixel data to offscreen, then scale up
    var imgData = this._imgData
    if (!imgData) return
    var data = imgData.data

    for (var i = 0; i < w * h; i++) {
      var bVal = B[i]
      var ci = Math.min(255, Math.max(0, Math.round(bVal * 255)))
      var c = PALETTE[ci]
      var pi = i * 4
      data[pi] = c.r
      data[pi + 1] = c.g
      data[pi + 2] = c.b
      data[pi + 3] = 255
    }

    // Clear and draw scaled
    ctx.clearRect(0, 0, cw, ch)

    // Draw simulation pixels
    ctx.save()
    ctx.imageSmoothingEnabled = true

    // Create offscreen canvas for pixel manipulation (WeChat API)
    if (!this._tmpCanvas && this._canvas) {
      try {
        this._tmpCanvas = wx.createOffscreenCanvas({ type: '2d', width: w, height: h })
        this._tmpCtx = this._tmpCanvas.getContext('2d')
      } catch (e) {
        // Fallback: draw directly with fillRect (slower but compatible)
        this._noOffscreen = true
      }
    }

    if (this._noOffscreen) {
      // Fallback: draw each pixel as a rect (for older devices)
      var sx = cw / w
      var sy = ch / h
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var pi2 = (y * w + x) * 4
          ctx.fillStyle = 'rgb(' + data[pi2] + ',' + data[pi2 + 1] + ',' + data[pi2 + 2] + ')'
          ctx.fillRect(x * sx, y * sy, sx + 0.5, sy + 0.5)
        }
      }
    } else if (this._tmpCtx) {
      this._tmpCtx.putImageData(imgData, 0, 0)
      ctx.drawImage(this._tmpCanvas, 0, 0, w, h, 0, 0, cw, ch)

      // Draw glow overlay (soft bloom effect)
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.12
      ctx.drawImage(this._tmpCanvas, 0, 0, w, h, -2, -2, cw + 4, ch + 4)
      ctx.globalAlpha = 1.0
      ctx.globalCompositeOperation = 'source-over'
    }

    // Draw particles
    this._drawParticles(ctx, cw, ch)

    ctx.restore()
  },

  _drawParticles: function (ctx, cw, ch) {
    var particles = this._particles
    var scaleX = cw / this._simW
    var scaleY = ch / this._simH

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]
      var alpha = p.life / p.maxLife
      ctx.beginPath()
      ctx.arc(p.x * scaleX, p.y * scaleY, 2 + alpha * 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(14,240,192,' + (alpha * 0.8).toFixed(2) + ')'
      ctx.fill()
    }
  },

  _updateParticles: function () {
    var particles = this._particles
    var B = this._engine.getB()
    var w = this._simW
    var h = this._simH

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i]
      p.life -= 1

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      // Drift along B gradient
      var px = Math.floor(p.x)
      var py = Math.floor(p.y)
      if (px >= 1 && px < w - 1 && py >= 1 && py < h - 1) {
        var idx = py * w + px
        var gx = B[idx + 1] - B[idx - 1]
        var gy = B[idx + w] - B[idx - w]
        p.x += gx * 3 + (Math.random() - 0.5) * 0.5
        p.y += gy * 3 + (Math.random() - 0.5) * 0.5
      }

      // Wrap
      p.x = ((p.x % w) + w) % w
      p.y = ((p.y % h) + h) % h
    }
  },

  _spawnParticles: function (simX, simY, count) {
    count = count || 5
    for (var i = 0; i < count; i++) {
      if (this._particles.length >= MAX_PARTICLES) break
      this._particles.push({
        x: simX + (Math.random() - 0.5) * 4,
        y: simY + (Math.random() - 0.5) * 4,
        life: 20 + Math.floor(Math.random() * 15),
        maxLife: 35
      })
    }
  },

  _updateStats: function () {
    if (!this._engine) return
    var stats = this._engine.getStats()
    // Throttle setData to every ~10 frames
    if (!this._statsCounter) this._statsCounter = 0
    this._statsCounter++
    if (this._statsCounter % 10 !== 0) return

    this.setData({
      statsA: stats.avgA.toFixed(2),
      statsB: stats.avgB.toFixed(2),
      statsCrystal: Math.round(stats.crystalRatio * 100) + '%',
      statsEntropy: stats.entropy.toFixed(2),
      crystalPct: Math.round(stats.crystalRatio * 100)
    })
  },

  // ========== Touch Handling ==========
  onCanvasTouchStart: function (e) {
    if (!this._engine) return
    var touch = e.touches[0]
    var pos = this._touchToSim(touch)
    this._touchActive = true
    this._lastTouchX = pos.x
    this._lastTouchY = pos.y

    // Inject activator
    this._engine.injectA(pos.x, pos.y, 4, 0.15)
    this._spawnParticles(pos.x, pos.y, 8)
    wx.vibrateShort({ type: 'light' })

    this.setData({ touchCount: this.data.touchCount + 1 })

    // Tutorial progression
    if (this.data.showTutorial && this.data.tutorialStep === 0) {
      this.setData({ tutorialStep: 1 })
    }
  },

  onCanvasTouchMove: function (e) {
    if (!this._engine || !this._touchActive) return
    var touch = e.touches[0]
    var pos = this._touchToSim(touch)

    // Draw barrier along movement path
    var dx = pos.x - this._lastTouchX
    var dy = pos.y - this._lastTouchY
    var dist = Math.sqrt(dx * dx + dy * dy)
    var steps = Math.max(1, Math.floor(dist / 2))

    for (var i = 0; i <= steps; i++) {
      var t = steps > 0 ? i / steps : 0
      var x = this._lastTouchX + dx * t
      var y = this._lastTouchY + dy * t
      this._engine.injectBarrier(x, y, 2)
      if (i % 2 === 0) this._spawnParticles(x, y, 2)
    }

    this._lastTouchX = pos.x
    this._lastTouchY = pos.y

    // Tutorial progression
    if (this.data.showTutorial && this.data.tutorialStep === 1) {
      this.setData({ tutorialStep: 2 })
    }
  },

  onCanvasTouchEnd: function () {
    this._touchActive = false
  },

  _touchToSim: function (touch) {
    // Convert touch coordinates to simulation grid coordinates
    // The canvas element position needs to be accounted for
    var x = touch.x || touch.clientX || 0
    var y = touch.y || touch.clientY || 0

    // Scale from canvas display size to simulation size
    var simX = (x / this._canvasW) * this._simW
    var simY = (y / this._canvasH) * this._simH

    simX = Math.max(0, Math.min(this._simW - 1, simX))
    simY = Math.max(0, Math.min(this._simH - 1, simY))

    return { x: simX, y: simY }
  },

  // ========== Navigation ==========
  onGoHome: function () {
    this._stopLoop()
    this._stopTimeCounter()
    this.setData({ phase: 'home' })
  },

  onOpenGallery: function () {
    this.setData({ phase: 'gallery' })
  },

  onRetry: function () {
    this.onStartLevel({ currentTarget: { dataset: { level: this.data.level } } })
  },

  onNextLevel: function () {
    var next = this.data.level + 1
    if (next < LEVELS.length) {
      this.onStartLevel({ currentTarget: { dataset: { level: next } } })
    } else {
      this.setData({ phase: 'home' })
    }
  },

  onDismissTutorial: function () {
    this.setData({ showTutorial: false })
    wx.setStorageSync('neural_ink_tutorial', true)
  },

  // Change parameters in free mode
  onParamChange: function (e) {
    if (!this._engine || !this.data.freeMode) return
    var param = e.currentTarget.dataset.param
    var val = parseFloat(e.detail.value)
    var params = this._engine.getParams()
    if (param === 'f') params.feed = val / 1000
    if (param === 'k') params.kill = val / 1000
    this._engine.setParams(params.feed, params.kill)
  },

  onResetField: function () {
    if (!this._engine) return
    var params = this._engine.getParams()
    this._engine.init(params.feed, params.kill)
  },

  // ========== Share ==========
  onShareAppMessage: function () {
    return {
      title: '神经墨迹 - 我在培育意识结晶',
      path: '/pages/neural-ink/neural-ink',
      imageUrl: ''
    }
  },

  formatTime: function (s) {
    var m = Math.floor(s / 60)
    var sec = s % 60
    return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec
  }
})
