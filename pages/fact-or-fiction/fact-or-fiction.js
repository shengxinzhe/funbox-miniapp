var ALL_FACTS = require('./fact-data')

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

Page({
  data: {
    phase: 'intro',
    current: 0,
    total: 15,
    fact: null,
    answered: false,
    wasCorrect: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    fadeIn: false,
    cardAnim: '',
    bestScore: 0
  },

  onLoad: function () {
    var best = wx.getStorageSync('factfiction_best') || 0
    this.setData({ bestScore: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this._facts = shuffle(ALL_FACTS).slice(0, 15)
    this.setData({
      phase: 'playing',
      current: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      fact: this._facts[0],
      answered: false,
      cardAnim: 'card-enter'
    })
    wx.vibrateShort({ type: 'light' })
  },

  answer: function (e) {
    if (this.data.answered) return
    var choice = e.currentTarget.dataset.choice === 'true'
    var correct = choice === this.data.fact.real
    var combo = correct ? this.data.combo + 1 : 0
    var score = this.data.score + (correct ? 10 + Math.min(combo, 5) * 2 : 0)

    this.setData({
      answered: true,
      wasCorrect: correct,
      score: score,
      combo: combo,
      maxCombo: Math.max(this.data.maxCombo, combo),
      correctCount: this.data.correctCount + (correct ? 1 : 0)
    })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
  },

  nextFact: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      if (this.data.score > this.data.bestScore) {
        wx.setStorageSync('factfiction_best', this.data.score)
      }
      this.setData({
        phase: 'result',
        bestScore: Math.max(this.data.bestScore, this.data.score)
      })
      wx.vibrateShort({ type: 'heavy' })
      return
    }
    this.setData({
      current: next,
      fact: this._facts[next],
      answered: false,
      cardAnim: ''
    })
    var self = this
    setTimeout(function () { self.setData({ cardAnim: 'card-enter' }) }, 30)
  },

  restart: function () { this.startGame() },

  onShareAppMessage: function () {
    return {
      title: '真假冷知识：我答对了' + this.data.correctCount + '/15！你能辨别真假吗？',
      path: '/pages/fact-or-fiction/fact-or-fiction'
    }
  },
  onShareTimeline: function () {
    return { title: '真假冷知识 - 智变纪趣味实验室' }
  }
})