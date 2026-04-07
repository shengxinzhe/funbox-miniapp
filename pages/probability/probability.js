var ALL_SCENARIOS = [
  { id: 1,  q: "抛一枚硬币6次，全部正面朝上的概率？", a: 1.56,  cat: "coin",     icon: "🪙" },
  { id: 2,  q: "掷两个骰子，点数之和为7的概率？",       a: 16.67, cat: "dice",     icon: "🎲" },
  { id: 3,  q: "23人中，至少两人生日相同的概率？",       a: 50.73, cat: "birthday", icon: "🎂" },
  { id: 4,  q: "从一副52张扑克中抽2张，都是红心的概率？", a: 5.88,  cat: "card",     icon: "♥️" },
  { id: 5,  q: "掷一个骰子3次，至少出现一次6的概率？",   a: 42.13, cat: "dice",     icon: "🎲" },
  { id: 6,  q: "抛硬币10次，恰好5次正面的概率？",        a: 24.61, cat: "coin",     icon: "🪙" },
  { id: 7,  q: "从1到100中随机选一个数，是质数的概率？", a: 25,    cat: "number",   icon: "🔢" },
  { id: 8,  q: "三个人猜拳，一次就决出胜负的概率？",     a: 33.33, cat: "game",     icon: "✊" },
  { id: 9,  q: "随机排列ABCD四个字母，A在B前面的概率？", a: 50,    cat: "order",    icon: "🔤" },
  { id: 10, q: "掷两个骰子，至少一个是6的概率？",        a: 30.56, cat: "dice",     icon: "🎲" },
  { id: 11, q: "生日在周末（周六或周日）的概率？",        a: 28.57, cat: "calendar", icon: "📅" },
  { id: 12, q: "从10个人中选3人组队，你被选中的概率？",  a: 30,    cat: "group",    icon: "👥" },
  { id: 13, q: "掷一个骰子两次，第二次比第一次大的概率？", a: 41.67, cat: "dice",   icon: "🎲" },
  { id: 14, q: "4张牌随机排列，恰好按升序排列的概率？",  a: 4.17,  cat: "order",    icon: "🃏" },
  { id: 15, q: "连续抛3枚硬币，至少2枚正面的概率？",     a: 50,    cat: "coin",     icon: "🪙" },
  { id: 16, q: "1到20随机选一个数，它能被3整除的概率？", a: 30,    cat: "number",   icon: "🔢" },
  { id: 17, q: "随机选一个月份，天数为31天的概率？",      a: 58.33, cat: "calendar", icon: "📅" },
  { id: 18, q: "5个人随机排一排，特定两人相邻的概率？",  a: 40,    cat: "order",    icon: "👫" },
  { id: 19, q: "掷两个骰子，点数之和大于9的概率？",      a: 16.67, cat: "dice",     icon: "🎲" },
  { id: 20, q: "从红蓝各5个球中随机取2个，都是红球的概率？", a: 22.22, cat: "ball", icon: "🔴" }
]

var TOTAL_ROUNDS = 8
var SIMULATION_TOTAL = 500
var SIMULATION_DURATION = 2000 // ms

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp
  }
  return a
}

function calcScore(diff) {
  if (diff <= 2)  return 100
  if (diff <= 5)  return 85
  if (diff <= 10) return 70
  if (diff <= 15) return 55
  if (diff <= 20) return 40
  if (diff <= 30) return 25
  return 10
}

function getRating(total) {
  if (total >= 700) return { label: 'S', title: '概率大师', color: '#30D158' }
  if (total >= 560) return { label: 'A', title: '统计达人', color: '#0A84FF' }
  if (total >= 400) return { label: 'B', title: '直觉不错', color: '#FF9F0A' }
  if (total >= 280) return { label: 'C', title: '需要校准', color: '#FF6B6B' }
  return { label: 'D', title: '概率盲区', color: '#86868B' }
}

function getScoreColor(diff) {
  if (diff <= 5)  return '#30D158'
  if (diff <= 15) return '#FF9F0A'
  return '#FF3B30'
}

Page({
  data: {
    phase: 'home',         // home | question | simulation | result
    bestScore: 0,

    // Question phase
    roundIndex: 0,         // 0-based current round index
    currentScenario: null,
    sliderValue: 50,
    displayValue: 50,

    // Simulation phase
    simTotal: SIMULATION_TOTAL,
    simCount: 0,
    simSuccess: 0,
    simPercent: 0,
    simSuccessPercent: 0,
    simDone: false,
    actualAnswer: 0,
    playerEstimate: 0,
    roundScore: 0,
    roundScoreColor: '#30D158',
    diffValue: 0,

    // Per-round results
    roundResults: [],

    // Result phase
    totalScore: 0,
    ratingLabel: '',
    ratingTitle: '',
    ratingColor: '#30D158',

    // Internal
    scenarios: [],         // selected 8
    simTimer: null
  },

  _simTimer: null,

  onLoad: function () {
    var best = wx.getStorageSync('probability_best') || 0
    this.setData({ bestScore: best })
  },

  onUnload: function () {
    if (this._simTimer) {
      clearInterval(this._simTimer)
      this._simTimer = null
    }
  },

  startGame: function () {
    var selected = shuffle(ALL_SCENARIOS).slice(0, TOTAL_ROUNDS)
    this.setData({
      phase: 'question',
      roundIndex: 0,
      scenarios: selected,
      totalScore: 0,
      roundResults: [],
      sliderValue: 50,
      displayValue: 50,
      simDone: false
    })
    this._loadRound(0, selected)
    wx.vibrateShort({ type: 'light' })
  },

  _loadRound: function (idx, scenarios) {
    var sc = scenarios || this.data.scenarios
    this.setData({
      currentScenario: sc[idx],
      sliderValue: 50,
      displayValue: 50,
      phase: 'question',
      simDone: false,
      simCount: 0,
      simSuccess: 0,
      simPercent: 0,
      simSuccessPercent: 0
    })
  },

  onSliderChange: function (e) {
    this.setData({
      sliderValue: e.detail.value,
      displayValue: e.detail.value
    })
  },

  onSliderChanging: function (e) {
    this.setData({
      displayValue: e.detail.value
    })
  },

  confirmEstimate: function () {
    var estimate = this.data.sliderValue
    var scenario = this.data.currentScenario
    var actual = scenario.a

    this.setData({
      phase: 'simulation',
      playerEstimate: estimate,
      actualAnswer: actual,
      simCount: 0,
      simSuccess: 0,
      simPercent: 0,
      simSuccessPercent: 0,
      simDone: false
    })

    wx.vibrateShort({ type: 'light' })
    this._runSimulation(actual)
  },

  _runSimulation: function (actual) {
    var self = this
    var total = SIMULATION_TOTAL
    var successRate = actual / 100
    var step = 10 // update every 10 trials
    var current = 0
    var successes = 0
    var intervalMs = Math.floor(SIMULATION_DURATION / (total / step))

    if (this._simTimer) {
      clearInterval(this._simTimer)
      this._simTimer = null
    }

    this._simTimer = setInterval(function () {
      // Simulate 'step' trials
      for (var i = 0; i < step; i++) {
        if (Math.random() < successRate) successes++
      }
      current += step
      if (current >= total) current = total

      var pct = Math.round((current / total) * 100)
      var successPct = current > 0 ? parseFloat((successes / current * 100).toFixed(1)) : 0

      self.setData({
        simCount: current,
        simSuccess: successes,
        simPercent: pct,
        simSuccessPercent: successPct
      })

      if (current >= total) {
        clearInterval(self._simTimer)
        self._simTimer = null
        self._showSimResult()
      }
    }, intervalMs)
  },

  _showSimResult: function () {
    var estimate = this.data.playerEstimate
    var actual = this.data.actualAnswer
    var diff = Math.abs(estimate - actual)
    var score = calcScore(diff)
    var color = getScoreColor(diff)

    var results = this.data.roundResults.slice()
    results.push({
      round: this.data.roundIndex + 1,
      question: this.data.currentScenario.q,
      estimate: estimate,
      actual: actual,
      diff: parseFloat(diff.toFixed(2)),
      score: score,
      scoreColor: color,
      icon: this.data.currentScenario.icon
    })

    this.setData({
      simDone: true,
      roundScore: score,
      roundScoreColor: color,
      diffValue: parseFloat(diff.toFixed(2)),
      roundResults: results
    })
  },

  nextRound: function () {
    var nextIdx = this.data.roundIndex + 1
    if (nextIdx >= TOTAL_ROUNDS) {
      this._showFinalResult()
      return
    }
    this.setData({ roundIndex: nextIdx })
    this._loadRound(nextIdx)
  },

  _showFinalResult: function () {
    var results = this.data.roundResults
    var total = 0
    for (var i = 0; i < results.length; i++) {
      total += results[i].score
    }

    var rating = getRating(total)
    var best = this.data.bestScore
    if (total > best) {
      best = total
      wx.setStorageSync('probability_best', best)
    }

    this.setData({
      phase: 'result',
      totalScore: total,
      ratingLabel: rating.label,
      ratingTitle: rating.title,
      ratingColor: rating.color,
      bestScore: best
    })

    wx.vibrateShort({ type: 'medium' })
  },

  goHome: function () {
    if (this._simTimer) {
      clearInterval(this._simTimer)
      this._simTimer = null
    }
    var best = wx.getStorageSync('probability_best') || 0
    this.setData({
      phase: 'home',
      bestScore: best
    })
  },

  playAgain: function () {
    this.startGame()
  },

  shareResult: function () {
    var total = this.data.totalScore
    var rating = this.data.ratingTitle
    wx.showShareMenu({ withShareTicket: false })
  },

  onShareAppMessage: function () {
    var total = this.data.totalScore
    var rating = this.data.ratingTitle
    return {
      title: '我在概率直觉中得了 ' + total + ' 分，等级：' + rating + '！来挑战我吧！',
      path: '/pages/probability/probability'
    }
  }
})
