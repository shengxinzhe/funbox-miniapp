var TARGETS = [5, 10, 15, 30]
var TARGET_LABELS = ['5秒', '10秒', '15秒', '30秒']

function scoreFromError(pct) {
  // 0% error = 100, 50% error = 0
  return Math.max(0, Math.min(100, Math.round(100 - pct * 2)))
}

function fmtDate(d) {
  return (d.getMonth() + 1) + '/' + d.getDate()
}

Page({
  data: {
    phase: 'home',
    fadeIn: false,
    targets: TARGETS,
    targetLabels: TARGET_LABELS,
    selectedTarget: 10,
    // counting
    counting: false,
    readyCount: 3,
    // result
    targetTime: 0,
    actualTime: 0,
    errorPct: 0,
    score: 0,
    direction: '',
    // history
    history: [],
    bestScores: {}
  },

  onLoad: function () {
    var history = wx.getStorageSync('timelab_history') || []
    var bestScores = wx.getStorageSync('timelab_best') || {}
    this.setData({ history: history, bestScores: bestScores })
    setTimeout(function () { this.setData({ fadeIn: true }) }.bind(this), 50)
  },

  selectTarget: function (e) {
    var t = parseInt(e.currentTarget.dataset.t)
    this.setData({ selectedTarget: t })
  },

  startTest: function () {
    this.setData({ phase: 'ready', readyCount: 3 })
    this.doCountdown()
  },

  doCountdown: function () {
    var self = this
    var count = 3
    self.setData({ readyCount: count })
    self._readyTimer = setInterval(function () {
      count--
      if (count <= 0) {
        clearInterval(self._readyTimer)
        self.beginCounting()
      } else {
        self.setData({ readyCount: count })
      }
    }, 1000)
  },

  beginCounting: function () {
    this._startTime = Date.now()
    this.setData({ phase: 'counting', counting: true })
    // safety timeout: auto-stop at 3x target
    var self = this
    var maxMs = this.data.selectedTarget * 3000
    this._safetyTimer = setTimeout(function () {
      if (self.data.counting) self.stopCounting()
    }, maxMs)
  },

  stopCounting: function () {
    if (!this.data.counting) return
    if (this._safetyTimer) clearTimeout(this._safetyTimer)

    var elapsed = (Date.now() - this._startTime) / 1000
    var target = this.data.selectedTarget
    var error = Math.abs(elapsed - target)
    var errorPct = Math.round((error / target) * 100)
    var score = scoreFromError(errorPct)
    var direction = elapsed > target ? '偏慢' : (elapsed < target ? '偏快' : '完美')
    var actualStr = elapsed.toFixed(2)

    wx.vibrateShort({ type: 'medium' })

    // save to history
    var record = {
      date: fmtDate(new Date()),
      target: target,
      actual: parseFloat(actualStr),
      error: errorPct,
      score: score
    }
    var history = this.data.history.slice()
    history.push(record)
    if (history.length > 100) history = history.slice(-100)
    wx.setStorageSync('timelab_history', history)

    // best score per target
    var bestScores = this.data.bestScores
    var key = 't' + target
    if (!bestScores[key] || score > bestScores[key]) {
      bestScores[key] = score
      wx.setStorageSync('timelab_best', bestScores)
    }

    this.setData({
      phase: 'result',
      counting: false,
      targetTime: target,
      actualTime: actualStr,
      errorPct: errorPct,
      score: score,
      direction: direction,
      history: history,
      bestScores: bestScores
    })
  },

  tryAgain: function () {
    this.startTest()
  },

  changeTarget: function () {
    this.setData({ phase: 'home' })
  },

  goHome: function () {
    this.setData({ phase: 'home' })
  },

  backToIndex: function () {
    wx.navigateBack()
  },

  onUnload: function () {
    if (this._readyTimer) clearInterval(this._readyTimer)
    if (this._safetyTimer) clearTimeout(this._safetyTimer)
  },

  onShareAppMessage: function () {
    var s = this.data.score
    var t = this.data.targetTime
    return {
      title: '估' + t + '秒我得了' + s + '分！你的时间感准吗？',
      path: '/pages/time-lab/time-lab'
    }
  }
})
