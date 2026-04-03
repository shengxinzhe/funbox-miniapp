var sound = require('../../utils/sound')

Page({
  data: {
    level: 1,
    bestLevel: 0,
    gridSize: 4,
    cells: [],
    phase: 'idle',  // idle, memorize, input, success, fail
    statusText: '点击开始游戏',
    statusClass: '',
    shakeGrid: false,
    celebrateGrid: false
  },

  targets: [],
  found: [],
  timer: null,

  onLoad: function () {
    var best = wx.getStorageSync('memory_best') || 0
    this.setData({ bestLevel: best })
    this.initGrid()
  },

  getGridSize: function (level) {
    if (level <= 3) return 4
    if (level <= 6) return 5
    return 6
  },

  getTargetCount: function (level) {
    if (level <= 1) return 4
    if (level <= 2) return 5
    if (level <= 4) return 6
    if (level <= 6) return 7
    if (level <= 8) return 8
    if (level <= 10) return 9
    return 10
  },

  initGrid: function () {
    var size = this.getGridSize(this.data.level)
    var cells = []
    for (var i = 0; i < size * size; i++) {
      cells.push({ state: '', flip: false })
    }
    this.setData({ gridSize: size, cells: cells })
  },

  startGame: function () {
    var level = this.data.phase === 'fail' ? 1 : this.data.level
    this.setData({
      level: level,
      phase: 'memorize',
      statusText: '记住高亮的格子',
      statusClass: 'memorize',
      shakeGrid: false,
      celebrateGrid: false
    })
    this.initGrid()

    var size = this.getGridSize(level)
    var total = size * size
    var count = this.getTargetCount(level)

    var targets = []
    while (targets.length < count) {
      var r = Math.floor(Math.random() * total)
      if (targets.indexOf(r) === -1) targets.push(r)
    }
    this.targets = targets
    this.found = []

    // Flash targets one by one for dramatic effect
    var cells = this.data.cells.slice()
    var self = this

    // Show all targets with staggered flash
    var showDelay = 0
    for (var i = 0; i < targets.length; i++) {
      (function (idx, delay) {
        setTimeout(function () {
          var c = self.data.cells.slice()
          c[idx] = { state: 'highlight', flip: true }
          self.setData({ cells: c })
          sound.play('tap')
        }, delay)
      })(targets[i], showDelay)
      showDelay += 80
    }

    // Hide after memorize period
    var memorizeTime = Math.max(1000, 2500 - (level - 1) * 120)
    this.timer = setTimeout(function () {
      var cells = []
      for (var i = 0; i < size * size; i++) {
        cells.push({ state: 'hidden', flip: false })
      }
      self.setData({
        cells: cells,
        phase: 'input',
        statusText: '点击你记住的格子',
        statusClass: 'input'
      })
    }, showDelay + memorizeTime)
  },

  tapCell: function (e) {
    if (this.data.phase !== 'input') return

    var idx = e.currentTarget.dataset.index
    if (this.found.indexOf(idx) !== -1) return

    var cells = this.data.cells.slice()

    if (this.targets.indexOf(idx) !== -1) {
      cells[idx] = { state: 'correct', flip: true }
      this.found.push(idx)
      sound.play('click')
      this.setData({ cells: cells })

      if (this.found.length === this.targets.length) {
        var nextLevel = this.data.level + 1
        var best = this.data.bestLevel
        if (nextLevel - 1 > best) {
          best = nextLevel - 1
          wx.setStorageSync('memory_best', best)
        }
        sound.play('levelup')
        this.setData({
          phase: 'success',
          statusText: '通过! 进入第' + nextLevel + '关',
          statusClass: 'success',
          bestLevel: best,
          celebrateGrid: true
        })
        var self = this
        setTimeout(function () {
          self.setData({ level: nextLevel, celebrateGrid: false })
          self.startGame()
        }, 1200)
      }
    } else {
      cells[idx] = { state: 'wrong', flip: true }
      // Reveal all remaining targets
      for (var i = 0; i < this.targets.length; i++) {
        if (this.found.indexOf(this.targets[i]) === -1) {
          cells[this.targets[i]] = { state: 'reveal', flip: true }
        }
      }
      sound.play('fail')
      this.setData({
        cells: cells,
        phase: 'fail',
        statusText: '游戏结束! 到达第' + this.data.level + '关',
        statusClass: 'fail',
        shakeGrid: true
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: '记忆矩阵我到了第' + this.data.level + '关，你能超过我吗？',
      path: '/pages/memory/memory'
    }
  },

  onShareTimeline: function () {
    return {
      title: '记忆矩阵第' + this.data.level + '关，来挑战！'
    }
  },

  onUnload: function () {
    clearTimeout(this.timer)
  }
})
