function hslToHex(h, s, l) {
  s /= 100; l /= 100
  var c = (1 - Math.abs(2 * l - 1)) * s
  var x = c * (1 - Math.abs((h / 60) % 2 - 1))
  var m = l - c / 2
  var r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  r = Math.round((r + m) * 255).toString(16)
  g = Math.round((g + m) * 255).toString(16)
  b = Math.round((b + m) * 255).toString(16)
  if (r.length < 2) r = '0' + r
  if (g.length < 2) g = '0' + g
  if (b.length < 2) b = '0' + b
  return '#' + r + g + b
}

Page({
  data: {
    phase: 'intro',
    level: 1,
    score: 0,
    lives: 3,
    gridSize: 3,
    cells: [],
    oddIndex: -1,
    baseColor: '',
    oddColor: '',
    fadeIn: false,
    bestLevel: 0,
    flash: '',
    comboCount: 0
  },

  onLoad: function () {
    var best = wx.getStorageSync('coloriq_best') || 0
    this.setData({ bestLevel: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this.setData({
      phase: 'playing',
      level: 1,
      score: 0,
      lives: 3,
      comboCount: 0
    })
    this._generateLevel(1)
    wx.vibrateShort({ type: 'light' })
  },

  _generateLevel: function (lv) {
    // Grid grows: 3x3 -> 4x4 -> 5x5 -> 6x6
    var gridSize = lv <= 5 ? 3 : (lv <= 12 ? 4 : (lv <= 22 ? 5 : 6))
    var total = gridSize * gridSize

    // Color difference shrinks with level
    var diffBase = 50
    var diff = Math.max(3, diffBase - lv * 2)

    // Random base color
    var hue = Math.floor(Math.random() * 360)
    var sat = 50 + Math.floor(Math.random() * 30)
    var light = 40 + Math.floor(Math.random() * 20)

    var baseHex = hslToHex(hue, sat, light)
    // Shift lightness for odd one
    var oddLight = light + (Math.random() > 0.5 ? diff : -diff)
    if (oddLight > 85) oddLight = light - diff
    if (oddLight < 15) oddLight = light + diff
    var oddHex = hslToHex(hue, sat, oddLight)

    var oddIndex = Math.floor(Math.random() * total)
    var cells = []
    for (var i = 0; i < total; i++) {
      cells.push({
        color: i === oddIndex ? oddHex : baseHex,
        isOdd: i === oddIndex
      })
    }

    this.setData({
      level: lv,
      gridSize: gridSize,
      cells: cells,
      oddIndex: oddIndex,
      baseColor: baseHex,
      oddColor: oddHex,
      flash: ''
    })
  },

  tapCell: function (e) {
    if (this.data.phase !== 'playing') return
    var idx = e.currentTarget.dataset.idx
    var cell = this.data.cells[idx]

    if (cell.isOdd) {
      // Correct
      var combo = this.data.comboCount + 1
      var bonus = Math.min(combo, 5)
      var score = this.data.score + 10 + bonus
      var nextLv = this.data.level + 1
      this.setData({ score: score, flash: 'correct', comboCount: combo })
      wx.vibrateShort({ type: 'light' })

      if (nextLv > this.data.bestLevel) {
        wx.setStorageSync('coloriq_best', nextLv)
        this.setData({ bestLevel: nextLv })
      }

      var self = this
      setTimeout(function () {
        self._generateLevel(nextLv)
      }, 400)
    } else {
      // Wrong
      var lives = this.data.lives - 1
      this.setData({ lives: lives, flash: 'wrong', comboCount: 0 })
      wx.vibrateShort({ type: 'heavy' })

      if (lives <= 0) {
        var self = this
        setTimeout(function () {
          self.setData({ phase: 'result' })
        }, 500)
      } else {
        var self = this
        setTimeout(function () { self.setData({ flash: '' }) }, 400)
      }
    }
  },

  restart: function () {
    this.startGame()
  },

  onShareAppMessage: function () {
    return {
      title: '色觉辨别挑战：我到了第' + this.data.level + '关！你的眼睛够敏锐吗？',
      path: '/pages/color-iq/color-iq'
    }
  },
  onShareTimeline: function () {
    return { title: '色觉辨别挑战 - 智变纪趣味实验室' }
  }
})