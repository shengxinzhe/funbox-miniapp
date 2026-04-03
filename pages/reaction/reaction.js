var sound = require('../../utils/sound')

Page({
  data: {
    state: 'idle',
    reactionTime: 0,
    bestTime: 0,
    rating: '',
    ripples: [],
    showResult: false,
    resultAnim: ''
  },

  timer: null,
  startTime: 0,
  rippleId: 0,

  onLoad: function () {
    var best = wx.getStorageSync('reaction_best') || 0
    this.setData({ bestTime: best })
  },

  handleTap: function (e) {
    var state = this.data.state
    // Create ripple at tap position
    this.createRipple(e)

    if (state === 'idle' || state === 'early' || state === 'result') {
      this.startWaiting()
    } else if (state === 'waiting') {
      clearTimeout(this.timer)
      sound.play('fail')
      this.setData({ state: 'early', showResult: false })
    } else if (state === 'ready') {
      var time = Date.now() - this.startTime
      var best = this.data.bestTime
      if (best === 0 || time < best) {
        best = time
        wx.setStorageSync('reaction_best', best)
      }
      var rating = this.getRating(time)
      sound.play('success')
      this.setData({
        state: 'result',
        reactionTime: time,
        bestTime: best,
        rating: rating,
        showResult: true,
        resultAnim: 'pop-in'
      })
    }
  },

  createRipple: function (e) {
    if (!e.touches || !e.touches[0]) return
    var x = e.touches[0].clientX
    var y = e.touches[0].clientY
    var id = ++this.rippleId
    var ripples = this.data.ripples.concat([{ id: id, x: x, y: y }])
    this.setData({ ripples: ripples })
    var self = this
    setTimeout(function () {
      var r = self.data.ripples.filter(function (r) { return r.id !== id })
      self.setData({ ripples: r })
    }, 600)
  },

  startWaiting: function () {
    sound.play('tap')
    this.setData({ state: 'waiting', showResult: false, resultAnim: '' })
    var delay = 1000 + Math.random() * 4000
    var self = this
    this.timer = setTimeout(function () {
      self.startTime = Date.now()
      sound.play('go')
      self.setData({ state: 'ready' })
    }, delay)
  },

  getRating: function (ms) {
    if (ms < 200) return '闪电反应! 超人类水平'
    if (ms < 250) return '非常快! 专业级反应'
    if (ms < 300) return '很快! 超过多数人'
    if (ms < 400) return '不错! 正常水平'
    return '再加油! 多练习可以更快'
  },

  onShareAppMessage: function () {
    var time = this.data.reactionTime
    return {
      title: '\u667a\u53d8\u7eaa | \u6211\u7684\u53cd\u5e94\u901f\u5ea6 ' + time + 'ms\uff0c\u4f60\u80fd\u8d85\u8fc7\u6211\u5417\uff1f',
      path: '/pages/reaction/reaction'
    }
  },

  onShareTimeline: function () {
    return {
      title: '\u667a\u53d8\u7eaa | \u6211\u7684\u53cd\u5e94\u901f\u5ea6 ' + this.data.reactionTime + 'ms\uff0c\u6765\u6311\u6218\uff01'
    }
  },

  onUnload: function () {
    clearTimeout(this.timer)
  }
})
