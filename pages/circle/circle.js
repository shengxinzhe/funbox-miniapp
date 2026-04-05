var GUIDE_RATIO = 0.35

function fitCircle(pts) {
  var n = pts.length
  if (n < 10) return null
  var sx = 0, sy = 0
  for (var i = 0; i < n; i++) { sx += pts[i].x; sy += pts[i].y }
  var mx = sx / n, my = sy / n
  var suu = 0, suv = 0, svv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0
  for (var i = 0; i < n; i++) {
    var u = pts[i].x - mx, v = pts[i].y - my
    suu += u * u; suv += u * v; svv += v * v
    suuu += u * u * u; svvv += v * v * v
    suvv += u * v * v; svuu += v * u * u
  }
  var det = 2 * (suu * svv - suv * suv)
  if (Math.abs(det) < 0.001) return null
  var uc = ((suuu + suvv) * svv - (svvv + svuu) * suv) / det
  var vc = ((svvv + svuu) * suu - (suuu + suvv) * suv) / det
  return { cx: uc + mx, cy: vc + my, r: 0 }
}

function calcScore(pts, c) {
  if (!c || pts.length < 10) return 0
  var n = pts.length
  // compute radius
  var rSum = 0
  for (var i = 0; i < n; i++) {
    var dx = pts[i].x - c.cx, dy = pts[i].y - c.cy
    rSum += Math.sqrt(dx * dx + dy * dy)
  }
  c.r = rSum / n

  // deviation score
  var totalDev = 0
  for (var i = 0; i < n; i++) {
    var dx = pts[i].x - c.cx, dy = pts[i].y - c.cy
    var dist = Math.sqrt(dx * dx + dy * dy)
    totalDev += Math.abs(dist - c.r)
  }
  var avgDev = totalDev / n
  var devScore = Math.max(0, 1 - (avgDev / c.r) * 3)

  // closure check
  var s = pts[0], e = pts[n - 1]
  var closeDist = Math.sqrt((s.x - e.x) * (s.x - e.x) + (s.y - e.y) * (s.y - e.y))
  var closeScore = Math.max(0, 1 - closeDist / (c.r * 2))

  // angular coverage
  var angles = []
  for (var i = 0; i < n; i++) {
    angles.push(Math.atan2(pts[i].y - c.cy, pts[i].x - c.cx))
  }
  angles.sort(function (a, b) { return a - b })
  var maxGap = 0
  for (var i = 1; i < angles.length; i++) {
    maxGap = Math.max(maxGap, angles[i] - angles[i - 1])
  }
  maxGap = Math.max(maxGap, angles[0] + Math.PI * 2 - angles[angles.length - 1])
  var coverage = 1 - maxGap / (Math.PI * 2)
  var covScore = Math.min(1, coverage / 0.85)

  var raw = devScore * 0.6 + closeScore * 0.2 + covScore * 0.2
  return Math.max(0, Math.min(100, Math.round(raw * 100)))
}

Page({
  data: {
    phase: 'intro',
    score: 0,
    bestScore: 0,
    canvasSize: 300,
    fadeIn: false,
    scoreAnim: false,
    showFit: false,
    rank: '',
    drawing: false,
    attempts: 0
  },

  onLoad: function () {
    var best = wx.getStorageSync('circle_best') || 0
    var info = wx.getSystemInfoSync()
    var size = Math.floor(info.windowWidth * 0.82)
    this.setData({ bestScore: best, canvasSize: size })
    this.points = []
    this._drawing = false
    setTimeout(function () { this.setData({ fadeIn: true }) }.bind(this), 50)
  },

  onReady: function () {
    this.ctx = wx.createCanvasContext('circleCanvas', this)
  },

  startDraw: function () {
    this.points = []
    this._drawing = false
    this.setData({
      phase: 'drawing', score: 0,
      scoreAnim: false, showFit: false, drawing: false
    })
    // draw guide
    var ctx = this.ctx
    var s = this.data.canvasSize
    ctx.clearRect(0, 0, s, s)
    ctx.setStrokeStyle('rgba(255,255,255,0.06)')
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.arc(s / 2, s / 2, s * GUIDE_RATIO, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setFillStyle('rgba(255,255,255,0.12)')
    ctx.beginPath()
    ctx.arc(s / 2, s / 2, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.draw()
  },

  onTouchStart: function (e) {
    if (this.data.phase !== 'drawing') return
    var t = e.touches[0]
    this._drawing = true
    this.points = [{ x: t.x, y: t.y }]
    this.setData({ drawing: true })
  },

  onTouchMove: function (e) {
    if (!this._drawing) return
    var t = e.touches[0]
    var prev = this.points[this.points.length - 1]
    this.points.push({ x: t.x, y: t.y })
    var ctx = this.ctx
    ctx.setStrokeStyle('#22c55e')
    ctx.setLineWidth(3)
    ctx.setLineCap('round')
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(t.x, t.y)
    ctx.stroke()
    ctx.draw(true)
  },

  onTouchEnd: function () {
    if (!this._drawing) return
    this._drawing = false
    this.setData({ drawing: false })
    if (this.points.length < 20) {
      wx.showToast({ title: '请画一个更完整的圆', icon: 'none' })
      return
    }
    this.evaluate()
  },

  evaluate: function () {
    var circle = fitCircle(this.points)
    var score = calcScore(this.points, circle)
    this.fitResult = circle

    var best = this.data.bestScore
    if (score > best) {
      best = score
      wx.setStorageSync('circle_best', best)
    }

    var rank = ''
    if (score >= 95) rank = '完美圆神'
    else if (score >= 85) rank = '圆形大师'
    else if (score >= 70) rank = '有模有样'
    else if (score >= 50) rank = '初具雏形'
    else rank = '这是...圆?'

    var attempts = this.data.attempts + 1
    this.setData({
      phase: 'result', score: score,
      bestScore: best, rank: rank, attempts: attempts
    })

    wx.vibrateShort({ type: 'medium' })

    var self = this
    setTimeout(function () { self.setData({ scoreAnim: true }) }, 100)
    setTimeout(function () { self.drawResult() }, 400)
  },

  drawResult: function () {
    var c = this.fitResult
    if (!c) return
    var ctx = this.ctx
    var s = this.data.canvasSize
    ctx.clearRect(0, 0, s, s)

    // user path
    ctx.setStrokeStyle('#22c55e')
    ctx.setLineWidth(3)
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for (var i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y)
    }
    ctx.stroke()

    // fitted circle (dashed)
    ctx.setStrokeStyle('rgba(255,255,255,0.45)')
    ctx.setLineWidth(2)
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.arc(c.cx, c.cy, c.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.draw()
    this.setData({ showFit: true })
  },

  retry: function () { this.startDraw() },
  goHome: function () { this.setData({ phase: 'intro' }) },
  backToIndex: function () { wx.navigateBack() },

  onShareAppMessage: function () {
    return {
      title: '我画圆得了' + this.data.score + '分！你能画出完美的圆吗？',
      path: '/pages/circle/circle'
    }
  }
})
