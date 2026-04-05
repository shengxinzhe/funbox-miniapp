var ALL_FLAGS = [
  { flag: '\ud83c\udde8\ud83c\uddf3', name: '\u4e2d\u56fd', opts: ['\u4e2d\u56fd', '\u8d8a\u5357', '\u65e5\u672c', '\u97e9\u56fd'] },
  { flag: '\ud83c\uddfa\ud83c\uddf8', name: '\u7f8e\u56fd', opts: ['\u82f1\u56fd', '\u7f8e\u56fd', '\u6cd5\u56fd', '\u6fb3\u5927\u5229\u4e9a'] },
  { flag: '\ud83c\uddef\ud83c\uddf5', name: '\u65e5\u672c', opts: ['\u65e5\u672c', '\u5b5f\u52a0\u62c9\u56fd', '\u5e15\u52b3', '\u97e9\u56fd'] },
  { flag: '\ud83c\uddec\ud83c\udde7', name: '\u82f1\u56fd', opts: ['\u6fb3\u5927\u5229\u4e9a', '\u65b0\u897f\u5170', '\u82f1\u56fd', '\u51b0\u5c9b'] },
  { flag: '\ud83c\uddeb\ud83c\uddf7', name: '\u6cd5\u56fd', opts: ['\u6cd5\u56fd', '\u8377\u5170', '\u4fc4\u7f57\u65af', '\u5362\u68ee\u5821'] },
  { flag: '\ud83c\udde9\ud83c\uddea', name: '\u5fb7\u56fd', opts: ['\u6bd4\u5229\u65f6', '\u5fb7\u56fd', '\u5362\u68ee\u5821', '\u5965\u5730\u5229'] },
  { flag: '\ud83c\uddee\ud83c\uddf9', name: '\u610f\u5927\u5229', opts: ['\u7231\u5c14\u5170', '\u610f\u5927\u5229', '\u58a8\u897f\u54e5', '\u5308\u7259\u5229'] },
  { flag: '\ud83c\udde7\ud83c\uddf7', name: '\u5df4\u897f', opts: ['\u8461\u8404\u7259', '\u5df4\u897f', '\u7ef4\u4f5b\u89d2', '\u54e5\u4f26\u6bd4\u4e9a'] },
  { flag: '\ud83c\uddf7\ud83c\uddfa', name: '\u4fc4\u7f57\u65af', opts: ['\u4fc4\u7f57\u65af', '\u6cd5\u56fd', '\u8377\u5170', '\u585e\u5c14\u7ef4\u4e9a'] },
  { flag: '\ud83c\udde8\ud83c\udde6', name: '\u52a0\u62ff\u5927', opts: ['\u52a0\u62ff\u5927', '\u65e5\u672c', '\u79d8\u9c81', '\u745e\u58eb'] },
  { flag: '\ud83c\udde6\ud83c\uddfa', name: '\u6fb3\u5927\u5229\u4e9a', opts: ['\u82f1\u56fd', '\u65b0\u897f\u5170', '\u6fb3\u5927\u5229\u4e9a', '\u6590\u6d4e'] },
  { flag: '\ud83c\uddf0\ud83c\uddf7', name: '\u97e9\u56fd', opts: ['\u65e5\u672c', '\u97e9\u56fd', '\u8001\u631d', '\u5df4\u62c9\u572d'] },
  { flag: '\ud83c\uddee\ud83c\uddf3', name: '\u5370\u5ea6', opts: ['\u5370\u5ea6', '\u5c3c\u6cca\u5c14', '\u7231\u5c14\u5170', '\u585e\u5185\u52a0\u5c14'] },
  { flag: '\ud83c\uddf2\ud83c\uddfd', name: '\u58a8\u897f\u54e5', opts: ['\u610f\u5927\u5229', '\u58a8\u897f\u54e5', '\u5370\u5ea6', '\u79d8\u9c81'] },
  { flag: '\ud83c\uddea\ud83c\uddf8', name: '\u897f\u73ed\u7259', opts: ['\u897f\u73ed\u7259', '\u8461\u8404\u7259', '\u58a8\u897f\u54e5', '\u54e5\u4f26\u6bd4\u4e9a'] },
  { flag: '\ud83c\uddf9\ud83c\udded', name: '\u6cf0\u56fd', opts: ['\u6cf0\u56fd', '\u8001\u631d', '\u67ec\u57d4\u5be8', '\u7f05\u7538'] },
  { flag: '\ud83c\uddf9\ud83c\uddf7', name: '\u571f\u8033\u5176', opts: ['\u571f\u8033\u5176', '\u7a81\u5c3c\u65af', '\u963f\u5c14\u53ca\u5229\u4e9a', '\u4e2d\u56fd'] },
  { flag: '\ud83c\uddea\ud83c\uddec', name: '\u57c3\u53ca', opts: ['\u4f0a\u62c9\u514b', '\u57c3\u53ca', '\u5df4\u57fa\u65af\u5766', '\u53d9\u5229\u4e9a'] },
  { flag: '\ud83c\uddf3\ud83c\uddec', name: '\u5c3c\u65e5\u5229\u4e9a', opts: ['\u52a0\u7eb3', '\u5c3c\u65e5\u5229\u4e9a', '\u80af\u5c3c\u4e9a', '\u5580\u9ea6\u9686'] },
  { flag: '\ud83c\uddf8\ud83c\udde6', name: '\u6c99\u7279\u963f\u62c9\u4f2f', opts: ['\u6c99\u7279\u963f\u62c9\u4f2f', '\u4e5f\u95e8', '\u5df4\u6797', '\u5361\u5854\u5c14'] },
  { flag: '\ud83c\udde6\ud83c\uddf7', name: '\u963f\u6839\u5ef7', opts: ['\u667a\u5229', '\u963f\u6839\u5ef7', '\u4e4c\u62c9\u572d', '\u54e5\u4f26\u6bd4\u4e9a'] },
  { flag: '\ud83c\uddff\ud83c\udde6', name: '\u5357\u975e', opts: ['\u80af\u5c3c\u4e9a', '\u5357\u975e', '\u57c3\u585e\u4fc4\u6bd4\u4e9a', '\u52a0\u7eb3'] },
  { flag: '\ud83c\uddf8\ud83c\uddea', name: '\u745e\u5178', opts: ['\u82ac\u5170', '\u745e\u5178', '\u4e39\u9ea6', '\u6321\u5a01'] },
  { flag: '\ud83c\uddf3\ud83c\uddf4', name: '\u632a\u5a01', opts: ['\u632a\u5a01', '\u82ac\u5170', '\u51b0\u5c9b', '\u745e\u5178'] },
  { flag: '\ud83c\uddf5\ud83c\uddf9', name: '\u8461\u8404\u7259', opts: ['\u897f\u73ed\u7259', '\u610f\u5927\u5229', '\u8461\u8404\u7259', '\u5df4\u897f'] },
  { flag: '\ud83c\uddec\ud83c\uddf7', name: '\u5e0c\u814a', opts: ['\u5e0c\u814a', '\u4ee5\u8272\u5217', '\u585e\u6d66\u8def\u65af', '\u963f\u6839\u5ef7'] },
  { flag: '\ud83c\uddf5\ud83c\uddf1', name: '\u6ce2\u5170', opts: ['\u6377\u514b', '\u6ce2\u5170', '\u5362\u68ee\u5821', '\u5965\u5730\u5229'] },
  { flag: '\ud83c\uddfb\ud83c\uddf3', name: '\u8d8a\u5357', opts: ['\u4e2d\u56fd', '\u8d8a\u5357', '\u7f05\u7538', '\u67ec\u57d4\u5be8'] },
  { flag: '\ud83c\uddf5\ud83c\udded', name: '\u83f2\u5f8b\u5bbe', opts: ['\u6cf0\u56fd', '\u83f2\u5f8b\u5bbe', '\u5370\u5ea6\u5c3c\u897f\u4e9a', '\u9a6c\u6765\u897f\u4e9a'] },
  { flag: '\ud83c\udde8\ud83c\udded', name: '\u745e\u58eb', opts: ['\u745e\u58eb', '\u5965\u5730\u5229', '\u5fb7\u56fd', '\u4e39\u9ea6'] },
  { flag: '\ud83c\uddf3\ud83c\uddf1', name: '\u8377\u5170', opts: ['\u6cd5\u56fd', '\u4fc4\u7f57\u65af', '\u8377\u5170', '\u5362\u68ee\u5821'] },
  { flag: '\ud83c\uddf5\ud83c\uddea', name: '\u79d8\u9c81', opts: ['\u54e5\u4f26\u6bd4\u4e9a', '\u79d8\u9c81', '\u667a\u5229', '\u5384\u74dc\u591a\u5c14'] },
  { flag: '\ud83c\udde8\ud83c\uddf1', name: '\u667a\u5229', opts: ['\u667a\u5229', '\u5384\u74dc\u591a\u5c14', '\u963f\u6839\u5ef7', '\u79d8\u9c81'] },
  { flag: '\ud83c\uddee\ud83c\udde9', name: '\u5370\u5ea6\u5c3c\u897f\u4e9a', opts: ['\u9a6c\u6765\u897f\u4e9a', '\u5370\u5ea6\u5c3c\u897f\u4e9a', '\u83f2\u5f8b\u5bbe', '\u6cf0\u56fd'] },
  { flag: '\ud83c\uddee\ud83c\uddf1', name: '\u4ee5\u8272\u5217', opts: ['\u4ee5\u8272\u5217', '\u5e0c\u814a', '\u963f\u6839\u5ef7', '\u745e\u58eb'] },
  { flag: '\ud83c\uddee\ud83c\uddea', name: '\u7231\u5c14\u5170', opts: ['\u610f\u5927\u5229', '\u7231\u5c14\u5170', '\u5370\u5ea6', '\u79d1\u7279\u8fea\u74e6'] },
  { flag: '\ud83c\uddf2\ud83c\uddfe', name: '\u9a6c\u6765\u897f\u4e9a', opts: ['\u5370\u5ea6\u5c3c\u897f\u4e9a', '\u9a6c\u6765\u897f\u4e9a', '\u65b0\u52a0\u5761', '\u83f2\u5f8b\u5bbe'] },
  { flag: '\ud83c\uddf8\ud83c\uddec', name: '\u65b0\u52a0\u5761', opts: ['\u65b0\u52a0\u5761', '\u9a6c\u6765\u897f\u4e9a', '\u4e2d\u56fd', '\u5370\u5ea6\u5c3c\u897f\u4e9a'] },
  { flag: '\ud83c\udde8\ud83c\uddf4', name: '\u54e5\u4f26\u6bd4\u4e9a', opts: ['\u5384\u74dc\u591a\u5c14', '\u54e5\u4f26\u6bd4\u4e9a', '\u59d4\u5185\u745e\u62c9', '\u5df4\u62ff\u9a6c'] },
  { flag: '\ud83c\uddfa\ud83c\udde6', name: '\u4e4c\u514b\u5170', opts: ['\u4e4c\u514b\u5170', '\u4fc4\u7f57\u65af', '\u767d\u4fc4\u7f57\u65af', '\u6ce2\u5170'] }
]

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

function shuffleOpts(opts, correctName) {
  var shuffled = shuffle(opts)
  return shuffled
}

Page({
  data: {
    phase: 'intro',
    current: 0,
    total: 15,
    flag: null,
    options: [],
    answered: false,
    selectedIdx: -1,
    correctIdx: -1,
    wasCorrect: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    fadeIn: false,
    cardAnim: '',
    bestScore: 0,
    timeLeft: 0,
    timerWidth: 100
  },

  onLoad: function () {
    var best = wx.getStorageSync('flagquiz_best') || 0
    this.setData({ bestScore: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this._flags = shuffle(ALL_FLAGS).slice(0, 15)
    var first = this._flags[0]
    var opts = shuffleOpts(first.opts, first.name)
    this.setData({
      phase: 'playing',
      current: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      flag: first,
      options: opts,
      answered: false,
      selectedIdx: -1,
      correctIdx: opts.indexOf(first.name),
      cardAnim: 'card-enter',
      timeLeft: 100,
      timerWidth: 100
    })
    this._startTimer()
    wx.vibrateShort({ type: 'light' })
  },

  _startTimer: function () {
    if (this._timer) clearInterval(this._timer)
    var self = this
    this._timerVal = 100
    this.setData({ timeLeft: 100, timerWidth: 100 })
    this._timer = setInterval(function () {
      if (self.data.answered) return
      self._timerVal -= 2
      if (self._timerVal <= 0) {
        self._timerVal = 0
        self.setData({ timerWidth: 0 })
        clearInterval(self._timer)
        self._timeUp()
      } else {
        self.setData({ timerWidth: self._timerVal })
      }
    }, 100)
  },

  _timeUp: function () {
    var correctIdx = this.data.options.indexOf(this.data.flag.name)
    this.setData({
      answered: true,
      wasCorrect: false,
      selectedIdx: -1,
      correctIdx: correctIdx,
      combo: 0
    })
    wx.vibrateShort({ type: 'heavy' })
  },

  answer: function (e) {
    if (this.data.answered) return
    if (this._timer) clearInterval(this._timer)
    var idx = e.currentTarget.dataset.idx
    var selected = this.data.options[idx]
    var correct = selected === this.data.flag.name
    var combo = correct ? this.data.combo + 1 : 0
    var timeBonus = Math.floor(this._timerVal / 20)
    var score = this.data.score + (correct ? 10 + Math.min(combo, 5) * 2 + timeBonus : 0)
    var correctIdx = this.data.options.indexOf(this.data.flag.name)

    this.setData({
      answered: true,
      selectedIdx: idx,
      correctIdx: correctIdx,
      wasCorrect: correct,
      score: score,
      combo: combo,
      maxCombo: Math.max(this.data.maxCombo, combo),
      correctCount: this.data.correctCount + (correct ? 1 : 0)
    })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
  },

  nextFlag: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      if (this._timer) clearInterval(this._timer)
      if (this.data.score > this.data.bestScore) {
        wx.setStorageSync('flagquiz_best', this.data.score)
      }
      this.setData({
        phase: 'result',
        bestScore: Math.max(this.data.bestScore, this.data.score)
      })
      wx.vibrateShort({ type: 'heavy' })
      return
    }
    var f = this._flags[next]
    var opts = shuffleOpts(f.opts, f.name)
    this.setData({
      current: next,
      flag: f,
      options: opts,
      answered: false,
      selectedIdx: -1,
      correctIdx: opts.indexOf(f.name),
      cardAnim: ''
    })
    var self = this
    setTimeout(function () { self.setData({ cardAnim: 'card-enter' }) }, 30)
    this._startTimer()
  },

  restart: function () { this.startGame() },

  onUnload: function () {
    if (this._timer) clearInterval(this._timer)
  },

  onShareAppMessage: function () {
    return {
      title: '\u56fd\u65d7\u731c\u56fd\u5bb6\uff1a\u6211\u7b54\u5bf9\u4e86' + this.data.correctCount + '/15\uff01\u4f60\u80fd\u8ba4\u51fa\u51e0\u4e2a\uff1f',
      path: '/pages/flag-quiz/flag-quiz'
    }
  },
  onShareTimeline: function () {
    return { title: '\u56fd\u65d7\u731c\u56fd\u5bb6 - \u667a\u53d8\u7eaa\u8da3\u5473\u5b9e\u9a8c\u5ba4' }
  }
})
