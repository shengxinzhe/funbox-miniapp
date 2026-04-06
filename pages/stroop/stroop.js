// pages/stroop/stroop.js
// 斯特鲁普效应实验 - 测试大脑认知冲突处理能力

var COLORS = [
  { name: '红', hex: '#ef4444' },
  { name: '蓝', hex: '#3b82f6' },
  { name: '绿', hex: '#22c55e' },
  { name: '黄', hex: '#eab308' },
  { name: '紫', hex: '#a855f7' },
  { name: '橙', hex: '#f97316' }
]

var TOTAL_ROUNDS = 20
var COUNTDOWN_SEC = 3

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateQuestion(congruent) {
  var textColor = pick(COLORS)
  var displayColor
  if (congruent) {
    displayColor = textColor
  } else {
    do {
      displayColor = pick(COLORS)
    } while (displayColor.name === textColor.name)
  }
  return {
    text: textColor.name,
    displayHex: displayColor.hex,
    correctColor: displayColor.name,
    congruent: congruent
  }
}

function generateOptions(correctName) {
  var opts = [correctName]
  var others = COLORS.filter(function (c) { return c.name !== correctName })
  // shuffle others
  for (var i = others.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = others[i]; others[i] = others[j]; others[j] = t
  }
  opts.push(others[0].name)
  opts.push(others[1].name)
  // shuffle final
  for (var i = opts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = opts[i]; opts[i] = opts[j]; opts[j] = t
  }
  return opts.map(function (name) {
    var c = COLORS.filter(function (x) { return x.name === name })[0]
    return { name: c.name, hex: c.hex }
  })
}

Page({
  data: {
    phase: 'intro',       // intro | countdown | playing | feedback | result
    countdownNum: 3,
    round: 0,
    total: TOTAL_ROUNDS,
    score: 0,
    currentQ: null,
    options: [],
    chosen: '',
    isCorrect: false,
    combo: 0,
    maxCombo: 0,
    totalTime: 0,
    congruentCorrect: 0,
    congruentTotal: 0,
    incongruentCorrect: 0,
    incongruentTotal: 0,
    congruentAvgTime: 0,
    incongruentAvgTime: 0,
    fadeIn: false,
    flashCorrect: false,
    flashWrong: false,
    showWord: false
  },

  roundStartTime: 0,
  congruentTimes: [],
  incongruentTimes: [],

  onLoad: function () {
    this.setData({ fadeIn: true })
  },

  startGame: function () {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
    this.congruentTimes = []
    this.incongruentTimes = []
    this.setData({
      phase: 'countdown',
      countdownNum: COUNTDOWN_SEC,
      round: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      totalTime: 0,
      congruentCorrect: 0,
      congruentTotal: 0,
      incongruentCorrect: 0,
      incongruentTotal: 0,
      fadeIn: true
    })
    this.runCountdown()
  },

  runCountdown: function () {
    var self = this
    var num = COUNTDOWN_SEC
    self.setData({ countdownNum: num })
    self.countdownTimer = setInterval(function () {
      num--
      if (num <= 0) {
        clearInterval(self.countdownTimer)
        self.nextRound()
      } else {
        self.setData({ countdownNum: num })
      }
    }, 1000)
  },

  nextRound: function () {
    if (this.data.round >= TOTAL_ROUNDS) {
      this.showResult()
      return
    }
    // 60% incongruent, 40% congruent
    var congruent = Math.random() < 0.4
    var q = generateQuestion(congruent)
    var opts = generateOptions(q.correctColor)

    this.setData({
      phase: 'playing',
      currentQ: q,
      options: opts,
      chosen: '',
      isCorrect: false,
      showWord: false
    })

    // 短暂延迟后显示文字，制造出现动画
    var self = this
    setTimeout(function () {
      self.setData({ showWord: true })
      self.roundStartTime = Date.now()
    }, 200)
  },

  tapOption: function (e) {
    if (this.data.chosen) return
    var name = e.currentTarget.dataset.name
    var elapsed = Date.now() - this.roundStartTime
    var q = this.data.currentQ
    var correct = name === q.correctColor
    var newScore = this.data.score + (correct ? 1 : 0)
    var newCombo = correct ? this.data.combo + 1 : 0
    var maxCombo = Math.max(this.data.maxCombo, newCombo)

    // Track stats
    var cCorrect = this.data.congruentCorrect
    var cTotal = this.data.congruentTotal
    var iCorrect = this.data.incongruentCorrect
    var iTotal = this.data.incongruentTotal
    if (q.congruent) {
      cTotal++
      if (correct) { cCorrect++; this.congruentTimes.push(elapsed) }
    } else {
      iTotal++
      if (correct) { iCorrect++; this.incongruentTimes.push(elapsed) }
    }

    this.setData({
      chosen: name,
      isCorrect: correct,
      score: newScore,
      combo: newCombo,
      maxCombo: maxCombo,
      totalTime: this.data.totalTime + elapsed,
      congruentCorrect: cCorrect,
      congruentTotal: cTotal,
      incongruentCorrect: iCorrect,
      incongruentTotal: iTotal,
      flashCorrect: correct,
      flashWrong: !correct
    })

    if (correct) {
      wx.vibrateShort({ type: 'light' })
    } else {
      wx.vibrateShort({ type: 'heavy' })
    }

    var self = this
    setTimeout(function () {
      self.setData({
        round: self.data.round + 1,
        flashCorrect: false,
        flashWrong: false
      })
      self.nextRound()
    }, 600)
  },

  showResult: function () {
    var cAvg = 0
    var iAvg = 0
    if (this.congruentTimes.length > 0) {
      var sum = 0
      for (var i = 0; i < this.congruentTimes.length; i++) sum += this.congruentTimes[i]
      cAvg = Math.round(sum / this.congruentTimes.length)
    }
    if (this.incongruentTimes.length > 0) {
      var sum = 0
      for (var i = 0; i < this.incongruentTimes.length; i++) sum += this.incongruentTimes[i]
      iAvg = Math.round(sum / this.incongruentTimes.length)
    }
    this.setData({
      phase: 'result',
      congruentAvgTime: cAvg,
      incongruentAvgTime: iAvg,
      fadeIn: false
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  restart: function () {
    this.startGame()
  },

  backToHome: function () {
    wx.navigateBack()
  },

  onUnload: function () {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
  },

  onShareAppMessage: function () {
    var s = this.data.score
    var t = this.data.total
    return {
      title: '智变纪 | 斯特鲁普测试 ' + s + '/' + t + '，你的大脑能战胜认知冲突吗？',
      path: '/pages/stroop/stroop'
    }
  },

  onShareTimeline: function () {
    return {
      title: '智变纪 | 斯特鲁普效应实验：测测你的认知灵活度'
    }
  }
})
