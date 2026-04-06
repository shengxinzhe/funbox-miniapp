// pages/brain-daily/brain-daily.js
// 每日认知训练 - 4项测试综合评分

var TODAY = function () {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}

// ========== 测试1: 反应速度 ==========
function genReaction() {
  return { type: 'reaction', delay: Math.floor(Math.random() * 3000) + 1500 }
}

// ========== 测试2: 数字记忆 ==========
function genMemory(level) {
  var len = level + 3 // 4,5,6,7... digits
  var digits = ''
  for (var i = 0; i < len; i++) digits += Math.floor(Math.random() * 10)
  return { type: 'memory', digits: digits, level: level }
}

// ========== 测试3: 注意力(舒尔特方格) ==========
function genSchulte(size) {
  var total = size * size
  var nums = []
  for (var i = 1; i <= total; i++) nums.push(i)
  // shuffle
  for (var i = nums.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = nums[i]; nums[i] = nums[j]; nums[j] = t
  }
  return {
    type: 'schulte', size: size, numbers: nums,
    cells: nums.map(function (n) { return { num: n, found: false } })
  }
}

// ========== 测试4: 速算 ==========
function genMath(level) {
  var ops = ['+', '-']
  if (level >= 2) ops.push('x')
  var op = ops[Math.floor(Math.random() * ops.length)]
  var a, b, answer
  if (op === '+') {
    a = Math.floor(Math.random() * (20 * level)) + 5
    b = Math.floor(Math.random() * (20 * level)) + 5
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * (20 * level)) + 10
    b = Math.floor(Math.random() * a) + 1
    answer = a - b
  } else {
    a = Math.floor(Math.random() * (5 * level)) + 2
    b = Math.floor(Math.random() * 12) + 2
    answer = a * b
  }
  // Generate 3 wrong options
  var options = [answer]
  while (options.length < 4) {
    var wrong = answer + Math.floor(Math.random() * 20) - 10
    if (wrong !== answer && options.indexOf(wrong) === -1 && wrong >= 0) {
      options.push(wrong)
    }
  }
  // shuffle
  for (var i = options.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = options[i]; options[i] = options[j]; options[j] = t
  }
  return {
    type: 'math', question: a + ' ' + op + ' ' + b + ' = ?',
    answer: answer, options: options, level: level
  }
}

Page({
  data: {
    phase: 'home',  // home | test | result
    // Home
    todayDone: false,
    todayScore: 0,
    streak: 0,
    history: [],
    // Test state
    currentTest: 0,  // 0-3
    testNames: ['反应速度', '数字记忆', '注意力方格', '极速心算'],
    testIcons: ['flash', 'brain', 'grid', 'calc'],
    testScores: [0, 0, 0, 0],
    // Reaction
    reactionPhase: 'wait', // wait | ready | go | done
    reactionTime: 0,
    reactionBg: '',
    // Memory
    memoryDigits: '',
    memoryShow: true,
    memoryInput: '',
    memoryLevel: 1,
    memoryRound: 0,
    memoryCorrect: 0,
    memoryDone: false,
    // Schulte
    schulteSize: 4,
    schulteCells: [],
    schulteNext: 1,
    schulteTotal: 16,
    schulteStartTime: 0,
    schulteTime: 0,
    schulteWrong: 0,
    // Math
    mathQ: null,
    mathRound: 0,
    mathCorrect: 0,
    mathLevel: 1,
    mathTotal: 8,
    mathChosen: -1,
    // Overall
    totalScore: 0,
    brainLevel: '',
    fadeIn: false,
    testAnim: false
  },

  reactionTimer: null,
  memoryTimer: null,

  onLoad: function () {
    this.loadHistory()
    this.setData({ fadeIn: true })
  },

  loadHistory: function () {
    var history = wx.getStorageSync('brain_daily_history') || []
    var streak = wx.getStorageSync('brain_daily_streak') || 0
    var today = TODAY()
    var todayEntry = null
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === today) { todayEntry = history[i]; break }
    }
    this.setData({
      history: history.slice(-30), // last 30 days
      streak: streak,
      todayDone: !!todayEntry,
      todayScore: todayEntry ? todayEntry.score : 0
    })
  },

  startDaily: function () {
    this.setData({
      phase: 'test',
      currentTest: 0,
      testScores: [0, 0, 0, 0],
      fadeIn: false,
      testAnim: false
    })
    var self = this
    setTimeout(function () {
      self.setData({ fadeIn: true, testAnim: true })
      self.startReaction()
    }, 100)
  },

  // ========== REACTION ==========
  startReaction: function () {
    var cfg = genReaction()
    this.setData({
      reactionPhase: 'wait',
      reactionTime: 0,
      reactionBg: ''
    })
    var self = this
    this.reactionTimer = setTimeout(function () {
      self.setData({ reactionPhase: 'go', reactionBg: '#22c55e' })
      self.reactionStart = Date.now()
    }, cfg.delay)
  },

  tapReaction: function () {
    var phase = this.data.reactionPhase
    if (phase === 'wait') {
      // Too early!
      clearTimeout(this.reactionTimer)
      this.setData({ reactionPhase: 'wait', reactionBg: '#ef4444' })
      var self = this
      setTimeout(function () { self.startReaction() }, 1000)
      return
    }
    if (phase === 'go') {
      var time = Date.now() - this.reactionStart
      // Score: 100 at 150ms, 0 at 800ms
      var score = Math.max(0, Math.min(100, Math.round((800 - time) / 650 * 100)))
      var scores = this.data.testScores.slice()
      scores[0] = score
      this.setData({
        reactionPhase: 'done',
        reactionTime: time,
        testScores: scores,
        reactionBg: ''
      })
    }
  },

  nextFromReaction: function () {
    this.setData({ currentTest: 1, testAnim: false })
    var self = this
    setTimeout(function () {
      self.setData({ testAnim: true })
      self.startMemory()
    }, 100)
  },

  // ========== MEMORY ==========
  startMemory: function () {
    var cfg = genMemory(1)
    this.setData({
      memoryDigits: cfg.digits,
      memoryShow: true,
      memoryInput: '',
      memoryLevel: 1,
      memoryRound: 0,
      memoryCorrect: 0,
      memoryDone: false
    })
    var self = this
    if (this.memoryTimer) clearTimeout(this.memoryTimer)
    this.memoryTimer = setTimeout(function () {
      self.setData({ memoryShow: false })
    }, 2500)
  },

  inputMemory: function (e) {
    this.setData({ memoryInput: e.detail.value })
  },

  submitMemory: function () {
    var correct = this.data.memoryInput === this.data.memoryDigits
    var round = this.data.memoryRound + 1
    var correctCount = this.data.memoryCorrect + (correct ? 1 : 0)
    var level = this.data.memoryLevel

    if (correct && round < 4) {
      // Next round, harder
      var cfg = genMemory(level + 1)
      this.setData({
        memoryLevel: level + 1,
        memoryRound: round,
        memoryCorrect: correctCount,
        memoryDigits: cfg.digits,
        memoryShow: true,
        memoryInput: ''
      })
      var self = this
      var showTime = 2500 + level * 500
      if (this.memoryTimer) clearTimeout(this.memoryTimer)
      this.memoryTimer = setTimeout(function () {
        self.setData({ memoryShow: false })
      }, showTime)
    } else {
      // Done
      var score = Math.min(100, Math.round(correctCount / 4 * 100 + (correct ? level * 5 : 0)))
      var scores = this.data.testScores.slice()
      scores[1] = score
      this.setData({
        memoryRound: round,
        memoryCorrect: correctCount,
        testScores: scores,
        memoryShow: false,
        memoryDone: true
      })
    }
  },

  nextFromMemory: function () {
    if (this.memoryTimer) clearTimeout(this.memoryTimer)
    this.setData({ currentTest: 2, testAnim: false })
    var self = this
    setTimeout(function () {
      self.setData({ testAnim: true })
      self.startSchulte()
    }, 100)
  },

  // ========== SCHULTE ==========
  startSchulte: function () {
    var cfg = genSchulte(4)
    this.setData({
      schulteSize: cfg.size,
      schulteCells: cfg.cells,
      schulteNext: 1,
      schulteTotal: cfg.size * cfg.size,
      schulteTime: 0,
      schulteWrong: 0
    })
    this.schulteStart = Date.now()
  },

  tapSchulteCell: function (e) {
    var idx = e.currentTarget.dataset.idx
    var cells = this.data.schulteCells.slice()
    var cell = cells[idx]
    if (cell.found) return

    if (cell.num === this.data.schulteNext) {
      cells[idx] = { num: cell.num, found: true }
      var next = this.data.schulteNext + 1
      this.setData({ schulteCells: cells, schulteNext: next })
      wx.vibrateShort({ type: 'light' })

      if (next > this.data.schulteTotal) {
        var elapsed = Date.now() - this.schulteStart
        var sec = elapsed / 1000
        // Score: 100 at 10s, 0 at 60s
        var score = Math.max(0, Math.min(100, Math.round((60 - sec) / 50 * 100)))
        score = Math.max(0, score - this.data.schulteWrong * 5)
        var scores = this.data.testScores.slice()
        scores[2] = score
        this.setData({
          schulteTime: Math.round(sec * 10) / 10,
          testScores: scores
        })
      }
    } else {
      this.setData({ schulteWrong: this.data.schulteWrong + 1 })
      wx.vibrateShort({ type: 'heavy' })
    }
  },

  nextFromSchulte: function () {
    this.setData({ currentTest: 3, testAnim: false })
    var self = this
    setTimeout(function () {
      self.setData({ testAnim: true })
      self.startMath()
    }, 100)
  },

  // ========== MATH ==========
  startMath: function () {
    var q = genMath(1)
    this.setData({
      mathQ: q,
      mathRound: 0,
      mathCorrect: 0,
      mathLevel: 1,
      mathChosen: -1
    })
  },

  tapMathOption: function (e) {
    if (this.data.mathChosen >= 0) return
    var val = e.currentTarget.dataset.val
    var correct = val === this.data.mathQ.answer
    var round = this.data.mathRound + 1
    var correctCount = this.data.mathCorrect + (correct ? 1 : 0)
    var newLevel = correct ? Math.min(this.data.mathLevel + 1, 4) : Math.max(1, this.data.mathLevel - 1)

    this.setData({ mathChosen: val })

    if (correct) wx.vibrateShort({ type: 'light' })
    else wx.vibrateShort({ type: 'heavy' })

    var self = this
    setTimeout(function () {
      if (round >= self.data.mathTotal) {
        var score = Math.round(correctCount / self.data.mathTotal * 100)
        var scores = self.data.testScores.slice()
        scores[3] = score
        self.setData({
          mathRound: round,
          mathCorrect: correctCount,
          testScores: scores,
          mathChosen: -1
        })
      } else {
        var q = genMath(newLevel)
        self.setData({
          mathQ: q,
          mathRound: round,
          mathCorrect: correctCount,
          mathLevel: newLevel,
          mathChosen: -1
        })
      }
    }, 500)
  },

  finishDaily: function () {
    var scores = this.data.testScores
    var total = Math.round((scores[0] + scores[1] + scores[2] + scores[3]) / 4)
    var level = '需要训练'
    if (total >= 90) level = '认知精英'
    else if (total >= 75) level = '敏捷大脑'
    else if (total >= 60) level = '正常水平'
    else if (total >= 40) level = '有待提升'

    // Save to history
    var history = wx.getStorageSync('brain_daily_history') || []
    var today = TODAY()
    var found = false
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === today) {
        history[i].score = Math.max(history[i].score, total)
        found = true; break
      }
    }
    if (!found) history.push({ date: today, score: total, details: scores.slice() })

    // Calculate streak
    var streak = 1
    var d = new Date()
    for (var i = 1; i <= 365; i++) {
      d.setDate(d.getDate() - 1)
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var has = false
      for (var j = 0; j < history.length; j++) {
        if (history[j].date === key) { has = true; break }
      }
      if (has) streak++
      else break
    }

    // Keep only last 30 entries to prevent unbounded storage growth
    if (history.length > 30) history = history.slice(-30)
    wx.setStorageSync('brain_daily_history', history)
    wx.setStorageSync('brain_daily_streak', streak)

    this.setData({
      phase: 'result',
      totalScore: total,
      brainLevel: level,
      streak: streak,
      todayDone: true,
      todayScore: total,
      fadeIn: false
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  goHome: function () {
    this.loadHistory()
    this.setData({ phase: 'home', fadeIn: false })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  backToIndex: function () {
    wx.navigateBack()
  },

  onUnload: function () {
    if (this.reactionTimer) clearTimeout(this.reactionTimer)
    if (this.memoryTimer) clearTimeout(this.memoryTimer)
  },

  onShareAppMessage: function () {
    return {
      title: '智变纪 | 今日脑力指数 ' + this.data.totalScore + ' 分，连续训练 ' + this.data.streak + ' 天！',
      path: '/pages/brain-daily/brain-daily'
    }
  },

  onShareTimeline: function () {
    return {
      title: '智变纪 | 每日认知训练：记录你的大脑成长曲线'
    }
  }
})
