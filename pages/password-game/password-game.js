var RULES = [
  {
    id: 1,
    text: '密码至少 5 个字符（1个汉字=1个字符，1个emoji=2个字符）',
    check: function (pw) { return pw.length >= 5 }
  },
  {
    id: 2,
    text: '必须包含一个数字',
    check: function (pw) { return /\d/.test(pw) }
  },
  {
    id: 3,
    text: '必须包含一个大写字母',
    check: function (pw) { return /[A-Z]/.test(pw) }
  },
  {
    id: 4,
    text: '必须包含一个特殊符号（!@#$%&*）',
    check: function (pw) { return /[!@#$%&*]/.test(pw) }
  },
  {
    id: 5,
    text: '密码中数字之和必须等于 25',
    check: function (pw) {
      var sum = 0
      for (var i = 0; i < pw.length; i++) {
        var c = pw.charCodeAt(i)
        if (c >= 48 && c <= 57) sum += c - 48
      }
      return sum === 25
    }
  },
  {
    id: 6,
    text: '必须包含一个月份的英文缩写（Jan/Feb/Mar...）',
    check: function (pw) {
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      var lower = pw.toLowerCase()
      for (var i = 0; i < months.length; i++) {
        if (lower.indexOf(months[i].toLowerCase()) >= 0) return true
      }
      return false
    }
  },
  {
    id: 7,
    text: '必须包含一个罗马数字（I/V/X/L/C/D/M）',
    check: function (pw) { return /[IVXLCDM]/.test(pw) }
  },
  {
    id: 8,
    text: '必须包含一个emoji',
    check: function (pw) {
      return /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(pw)
    }
  },
  {
    id: 9,
    text: '密码的字符数必须是质数（如2,3,5,7,11,13...）',
    check: function (pw) {
      var n = pw.length
      if (n < 2) return false
      for (var i = 2; i * i <= n; i++) {
        if (n % i === 0) return false
      }
      return true
    }
  },
  {
    id: 10,
    text: '必须包含"密码"这两个字',
    check: function (pw) { return pw.indexOf('密码') >= 0 }
  },
  {
    id: 11,
    text: '不能包含连续的相同字符',
    check: function (pw) {
      for (var i = 1; i < pw.length; i++) {
        if (pw[i] === pw[i-1]) return false
      }
      return true
    }
  },
  {
    id: 12,
    text: '必须包含今天是星期几（如：星期一）',
    check: function (pw) {
      var days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
      var today = days[new Date().getDay()]
      return pw.indexOf(today) >= 0
    }
  },
  {
    id: 13,
    text: '必须同时包含"AI"和"人类"',
    check: function (pw) {
      return pw.indexOf('AI') >= 0 && pw.indexOf('人类') >= 0
    }
  },
  {
    id: 14,
    text: '必须包含一种颜色的英文（red/blue/green/yellow/pink/black/white）',
    check: function (pw) {
      var colors = ['red','blue','green','yellow','pink','black','white']
      var lower = pw.toLowerCase()
      for (var i = 0; i < colors.length; i++) {
        if (lower.indexOf(colors[i]) >= 0) return true
      }
      return false
    }
  },
  {
    id: 15,
    text: '密码必须以感叹号结尾！',
    check: function (pw) { return pw.length > 0 && pw[pw.length - 1] === '!' }
  }
]

Page({
  data: {
    phase: 'intro',
    password: '',
    unlockedCount: 0,
    ruleResults: [],
    currentRuleIdx: 0,
    won: false,
    fadeIn: false,
    bestLevel: 0,
    shakeRule: -1,
    charCount: 0
  },

  onLoad: function () {
    var best = wx.getStorageSync('password_best') || 0
    this.setData({ bestLevel: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this.setData({
      phase: 'playing',
      password: '',
      unlockedCount: 1,
      currentRuleIdx: 0,
      ruleResults: [],
      won: false
    })
    this._checkRules('')
    wx.vibrateShort({ type: 'light' })
  },

  onInput: function (e) {
    var pw = e.detail.value
    this.setData({ password: pw, charCount: pw.length })
    this._checkRules(pw)
  },

  _checkRules: function (pw) {
    var unlocked = this.data.unlockedCount
    var results = []
    var allPass = true
    var firstFail = -1

    for (var i = 0; i < unlocked; i++) {
      var pass = RULES[i].check(pw)
      results.push({ id: RULES[i].id, text: RULES[i].text, pass: pass })
      if (!pass && firstFail < 0) firstFail = i
      if (!pass) allPass = false
    }

    // Keep unlocking next rules as long as all current rules pass
    while (allPass && unlocked < RULES.length) {
      unlocked++
      var newRule = RULES[unlocked - 1]
      var newPass = newRule.check(pw)
      results.push({ id: newRule.id, text: newRule.text, pass: newPass })
      if (!newPass) {
        allPass = false
        firstFail = unlocked - 1
      }
      wx.vibrateShort({ type: 'light' })
    }

    var won = allPass && unlocked >= RULES.length
    if (won) {
      wx.vibrateShort({ type: 'heavy' })
    }

    // Save best
    if (unlocked > this.data.bestLevel) {
      wx.setStorageSync('password_best', unlocked)
    }

    this.setData({
      ruleResults: results,
      unlockedCount: unlocked,
      won: won,
      bestLevel: Math.max(this.data.bestLevel, unlocked),
      shakeRule: firstFail
    })

    // Clear shake
    if (firstFail >= 0) {
      var self = this
      setTimeout(function () { self.setData({ shakeRule: -1 }) }, 500)
    }
  },

  restart: function () {
    this.startGame()
  },

  onShareAppMessage: function () {
    return {
      title: '我通过了' + this.data.unlockedCount + '关密码挑战！你能到第几关？',
      path: '/pages/password-game/password-game'
    }
  },

  onShareTimeline: function () {
    return { title: '密码挑战 - 智变纪趣味实验室' }
  }
})