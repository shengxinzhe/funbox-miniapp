// pages/brain-daily/brain-daily.js
// 每日认知训练 v2 - 7项测试池 每日随机4项 综合评分

// === UTILITIES ===
function TODAY() {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}
function dateSeed(s) {
  var h = 0
  for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h }
  return Math.abs(h)
}
function seededShuffle(a, seed) {
  a = a.slice()
  for (var i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    var j = seed % (i + 1); var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

// === TEST POOL ===
var ALL_TESTS = [
  { key: 'reaction', name: '反应速度', icon: 'flash', dim: '反应' },
  { key: 'memory', name: '数字记忆', icon: 'brain', dim: '记忆' },
  { key: 'schulte', name: '注意力方格', icon: 'grid', dim: '注意' },
  { key: 'math', name: '极速心算', icon: 'calc', dim: '计算' },
  { key: 'stroop', name: '色词干扰', icon: 'stroop', dim: '抗干扰' },
  { key: 'visual', name: '视觉搜索', icon: 'eye', dim: '观察' },
  { key: 'sequence', name: '序列记忆', icon: 'seq', dim: '序列' }
]
function getTodayTests() {
  return seededShuffle(ALL_TESTS, dateSeed(TODAY())).slice(0, 4)
}

// === CONSTANTS ===
var STROOP_COLORS = [
  { name: '红', color: '#ef4444' }, { name: '蓝', color: '#3b82f6' },
  { name: '绿', color: '#22c55e' }, { name: '黄', color: '#eab308' },
  { name: '紫', color: '#a855f7' }
]
var VISUAL_PAIRS = [
  ['🔵', '🔴'], ['🍎', '🍊'], ['😀', '😃'],
  ['🟦', '🟪'], ['🌑', '🌕'], ['👆', '👇']
]
var SEQ_SCORES = [0, 0, 0, 15, 30, 50, 65, 80, 92, 100]

// === GENERATORS ===
function genMemory(level) {
  var len = level + 3, d = ''
  for (var i = 0; i < len; i++) d += Math.floor(Math.random() * 10)
  return { digits: d, level: level }
}

function genSchulte(size) {
  var t = size * size, nums = []
  for (var i = 1; i <= t; i++) nums.push(i)
  for (var i = nums.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp
  }
  return { size: size, cells: nums.map(function (n) { return { num: n, found: false } }) }
}

function genMath(level) {
  var ops = ['+', '-']; if (level >= 2) ops.push('x')
  var op = ops[Math.floor(Math.random() * ops.length)], a, b, ans
  if (op === '+') { a = Math.floor(Math.random() * (20 * level)) + 5; b = Math.floor(Math.random() * (20 * level)) + 5; ans = a + b }
  else if (op === '-') { a = Math.floor(Math.random() * (20 * level)) + 10; b = Math.floor(Math.random() * a) + 1; ans = a - b }
  else { a = Math.floor(Math.random() * (5 * level)) + 2; b = Math.floor(Math.random() * 12) + 2; ans = a * b }
  var opts = [ans]
  while (opts.length < 4) {
    var w = ans + Math.floor(Math.random() * 20) - 10
    if (w !== ans && opts.indexOf(w) === -1 && w >= 0) opts.push(w)
  }
  for (var i = opts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); var tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp
  }
  return { question: a + ' ' + op + ' ' + b + ' = ?', answer: ans, options: opts, level: level }
}

function genStroop() {
  var wi = Math.floor(Math.random() * 5), ci
  do { ci = Math.floor(Math.random() * 5) } while (ci === wi)
  var opts = [ci]
  while (opts.length < 4) { var r = Math.floor(Math.random() * 5); if (opts.indexOf(r) === -1) opts.push(r) }
  for (var i = opts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); var t = opts[i]; opts[i] = opts[j]; opts[j] = t
  }
  return {
    word: STROOP_COLORS[wi].name, displayColor: STROOP_COLORS[ci].color, correctIdx: ci,
    options: opts.map(function (idx) { return { idx: idx, name: STROOP_COLORS[idx].name, color: STROOP_COLORS[idx].color } })
  }
}

function genVisual(round) {
  var pi = Math.min(round, VISUAL_PAIRS.length - 1), pair = VISUAL_PAIRS[pi]
  var gs = round < 2 ? 4 : (round < 4 ? 5 : 6), total = gs * gs
  var op = Math.floor(Math.random() * total)
  var cells = []
  for (var i = 0; i < total; i++) cells.push({ emoji: i === op ? pair[1] : pair[0], isOdd: i === op })
  return { cells: cells, gridSize: gs }
}

function calcCogAge(s) {
  if (s >= 95) return 16; if (s >= 90) return 18; if (s >= 85) return 20; if (s >= 80) return 23
  if (s >= 75) return 26; if (s >= 70) return 30; if (s >= 65) return 35; if (s >= 60) return 40
  if (s >= 50) return 48; if (s >= 40) return 55; return 65
}
function cogAgeLabel(age) {
  if (age <= 18) return '巅峰状态'; if (age <= 25) return '黄金时期'; if (age <= 35) return '稳定期'
  if (age <= 45) return '需要锻炼'; return '加强训练'
}

// === PAGE ===
Page({
  data: {
    phase: 'home', fadeIn: false, testAnim: false, testDone: false,
    // Home
    todayDone: false, todayScore: 0, streak: 0, history: [],
    compareScore: 0, showCompare: false,
    // Today
    todayTests: [], currentTest: 0, currentTestKey: '',
    testScores: [0, 0, 0, 0], testDims: [],
    // Reaction (3 rounds)
    reactionPhase: 'wait', reactionRound: 0, reactionTimes: [],
    reactionTime: 0, reactionBg: '', reactionMedian: 0,
    // Memory (sequential reveal)
    memoryDigits: '', memoryShow: true, memoryRevealIdx: -1,
    memoryInput: '', memoryLevel: 1, memoryRound: 0,
    memoryCorrect: 0, memoryDone: false,
    // Schulte (5x5)
    schulteSize: 5, schulteCells: [], schulteNext: 1,
    schulteTotal: 25, schulteTime: 0, schulteWrong: 0,
    // Math (timed)
    mathQ: null, mathRound: 0, mathCorrect: 0, mathLevel: 1,
    mathTotal: 8, mathChosen: -1, mathTimerActive: false,
    // Stroop
    stroopQ: null, stroopRound: 0, stroopCorrect: 0,
    stroopTotal: 8, stroopChosen: -1,
    // Visual search
    visualCells: [], visualGridSize: 4, visualRound: 0,
    visualCorrect: 0, visualTotal: 6, visualTapped: -1,
    // Sequence memory
    seqCells: [], seqSequence: [], seqPlayerIdx: 0,
    seqPhase: 'watch', seqLevel: 3, seqShowIdx: -1, seqMaxLevel: 0,
    // Result
    totalScore: 0, brainLevel: '', cognitiveAge: 0, cogAgeLabel: ''
  },

  reactionTimer: null, memoryTimer: null, mathTimer: null, seqTimer: null,

  // === LIFECYCLE ===
  onLoad: function (opt) {
    if (opt && opt.score) this.setData({ compareScore: parseInt(opt.score) || 0, showCompare: true })
    var tests = getTodayTests()
    this.setData({ todayTests: tests })
    this.loadHistory()
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  onUnload: function () { this._clearTimers() },

  _clearTimers: function () {
    if (this.reactionTimer) { clearTimeout(this.reactionTimer); this.reactionTimer = null }
    if (this.memoryTimer) { clearTimeout(this.memoryTimer); this.memoryTimer = null }
    if (this.mathTimer) { clearTimeout(this.mathTimer); this.mathTimer = null }
    if (this.seqTimer) { clearTimeout(this.seqTimer); this.seqTimer = null }
  },

  loadHistory: function () {
    var h = wx.getStorageSync('brain_daily_history') || []
    var streak = wx.getStorageSync('brain_daily_streak') || 0
    var today = TODAY(), entry = null
    for (var i = 0; i < h.length; i++) { if (h[i].date === today) { entry = h[i]; break } }
    this.setData({ history: h.slice(-30), streak: streak, todayDone: !!entry, todayScore: entry ? entry.score : 0 })
  },

  // === FLOW CONTROL ===
  startDaily: function () {
    this._clearTimers()
    var tests = getTodayTests()
    this.setData({
      phase: 'test', currentTest: 0, currentTestKey: tests[0].key,
      todayTests: tests, testScores: [0, 0, 0, 0], testDone: false,
      fadeIn: false, testAnim: false,
      testDims: tests.map(function (t) { return t.dim })
    })
    var self = this
    setTimeout(function () {
      self.setData({ fadeIn: true, testAnim: true })
      self._startCurrentTest()
    }, 100)
    wx.vibrateShort({ type: 'light' })
  },

  onNextTap: function () {
    if (this.data.currentTest >= 3) this.finishDaily()
    else this.nextTest()
  },

  nextTest: function () {
    this._clearTimers()
    var next = this.data.currentTest + 1
    if (next >= 4) { this.finishDaily(); return }
    var key = this.data.todayTests[next].key
    this.setData({ currentTest: next, currentTestKey: key, testDone: false, testAnim: false })
    var self = this
    setTimeout(function () { self.setData({ testAnim: true }); self._startCurrentTest() }, 100)
  },

  _startCurrentTest: function () {
    var k = this.data.currentTestKey
    if (k === 'reaction') this.startReaction()
    else if (k === 'memory') this.startMemory()
    else if (k === 'schulte') this.startSchulte()
    else if (k === 'math') this.startMath()
    else if (k === 'stroop') this.startStroop()
    else if (k === 'visual') this.startVisual()
    else if (k === 'sequence') this.startSequence()
  },

  _setScore: function (score) {
    var s = this.data.testScores.slice()
    s[this.data.currentTest] = Math.max(0, Math.min(100, score))
    this.setData({ testScores: s, testDone: true })
  },

  // === REACTION (3 rounds, median) ===
  startReaction: function () {
    this.setData({
      reactionPhase: 'wait', reactionRound: 0, reactionTimes: [],
      reactionTime: 0, reactionBg: '', reactionMedian: 0, testDone: false
    })
    this._startReactionRound()
  },

  _startReactionRound: function () {
    this.setData({ reactionPhase: 'wait', reactionBg: '', reactionTime: 0 })
    var delay = Math.floor(Math.random() * 3000) + 1500
    var self = this
    this.reactionTimer = setTimeout(function () {
      self.setData({ reactionPhase: 'go', reactionBg: '#22c55e' })
      self._reactionStart = Date.now()
    }, delay)
  },

  tapReaction: function () {
    var phase = this.data.reactionPhase
    if (phase === 'wait') {
      clearTimeout(this.reactionTimer)
      this.setData({ reactionBg: '#ef4444' })
      var self = this
      setTimeout(function () { self._startReactionRound() }, 800)
      return
    }
    if (phase === 'go') {
      var time = Date.now() - this._reactionStart
      var times = this.data.reactionTimes.concat([time])
      var round = this.data.reactionRound + 1
      this.setData({ reactionPhase: 'done', reactionTime: time, reactionTimes: times, reactionRound: round, reactionBg: '' })
      if (round < 3) {
        var self = this
        setTimeout(function () { self._startReactionRound() }, 1200)
      } else {
        var sorted = times.slice().sort(function (a, b) { return a - b })
        var median = sorted[1]
        var score = Math.max(0, Math.min(100, Math.round((800 - median) / 650 * 100)))
        this.setData({ reactionMedian: median })
        this._setScore(score)
      }
    }
  },

  // === MEMORY (sequential reveal) ===
  startMemory: function () {
    var cfg = genMemory(1)
    this.setData({
      memoryDigits: cfg.digits, memoryShow: true, memoryRevealIdx: 0,
      memoryInput: '', memoryLevel: 1, memoryRound: 0,
      memoryCorrect: 0, memoryDone: false, testDone: false
    })
    this._revealNext()
  },

  _revealNext: function () {
    var idx = this.data.memoryRevealIdx, len = this.data.memoryDigits.length
    if (idx < len) {
      var self = this
      this.memoryTimer = setTimeout(function () {
        self.setData({ memoryRevealIdx: idx + 1 })
        self._revealNext()
      }, 500)
    } else {
      var self = this
      this.memoryTimer = setTimeout(function () {
        self.setData({ memoryShow: false, memoryRevealIdx: -1 })
      }, 1200)
    }
  },

  inputMemory: function (e) { this.setData({ memoryInput: e.detail.value }) },

  submitMemory: function () {
    if (this.memoryTimer) { clearTimeout(this.memoryTimer); this.memoryTimer = null }
    var correct = this.data.memoryInput === this.data.memoryDigits
    var round = this.data.memoryRound + 1
    var cc = this.data.memoryCorrect + (correct ? 1 : 0)
    var lv = this.data.memoryLevel
    if (correct && round < 4) {
      var cfg = genMemory(lv + 1)
      this.setData({
        memoryLevel: lv + 1, memoryRound: round, memoryCorrect: cc,
        memoryDigits: cfg.digits, memoryShow: true, memoryRevealIdx: 0, memoryInput: ''
      })
      this._revealNext()
    } else {
      var score = Math.min(100, Math.round(cc / 4 * 100 + (correct ? lv * 5 : 0)))
      this.setData({ memoryRound: round, memoryCorrect: cc, memoryDone: true })
      this._setScore(score)
    }
  },

  // === SCHULTE (5x5 standard) ===
  startSchulte: function () {
    var cfg = genSchulte(5)
    this.setData({
      schulteSize: 5, schulteCells: cfg.cells, schulteNext: 1,
      schulteTotal: 25, schulteTime: 0, schulteWrong: 0, testDone: false
    })
    this._schulteStart = Date.now()
  },

  tapSchulteCell: function (e) {
    if (this.data.testDone) return
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
        var sec = (Date.now() - this._schulteStart) / 1000
        var score = Math.max(0, Math.min(100, Math.round((90 - sec) / 70 * 100)))
        score = Math.max(0, score - this.data.schulteWrong * 3)
        this.setData({ schulteTime: Math.round(sec * 10) / 10 })
        this._setScore(score)
      }
    } else {
      this.setData({ schulteWrong: this.data.schulteWrong + 1 })
      wx.vibrateShort({ type: 'heavy' })
    }
  },

  // === MATH (8s countdown) ===
  startMath: function () {
    this.setData({
      mathQ: genMath(1), mathRound: 0, mathCorrect: 0,
      mathLevel: 1, mathChosen: -1, mathTimerActive: true, testDone: false
    })
    this._startMathTimer()
  },

  _startMathTimer: function () {
    if (this.mathTimer) clearTimeout(this.mathTimer)
    this.setData({ mathTimerActive: false })
    var self = this
    setTimeout(function () {
      self.setData({ mathTimerActive: true })
      self.mathTimer = setTimeout(function () {
        if (self.data.mathChosen < 0 && !self.data.testDone) self._mathAdvance(false)
      }, 8000)
    }, 50)
  },

  tapMathOption: function (e) {
    if (this.data.mathChosen >= 0 || this.data.testDone) return
    if (this.mathTimer) { clearTimeout(this.mathTimer); this.mathTimer = null }
    var val = e.currentTarget.dataset.val
    var correct = val === this.data.mathQ.answer
    this.setData({ mathChosen: val })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
    var self = this
    setTimeout(function () { self._mathAdvance(correct) }, 500)
  },

  _mathAdvance: function (correct) {
    var round = this.data.mathRound + 1
    var cc = this.data.mathCorrect + (correct ? 1 : 0)
    var newLv = correct ? Math.min(this.data.mathLevel + 1, 4) : Math.max(1, this.data.mathLevel - 1)
    if (round >= this.data.mathTotal) {
      var score = Math.round(cc / this.data.mathTotal * 100)
      this.setData({ mathRound: round, mathCorrect: cc, mathChosen: -1, mathTimerActive: false })
      this._setScore(score)
    } else {
      this.setData({ mathQ: genMath(newLv), mathRound: round, mathCorrect: cc, mathLevel: newLv, mathChosen: -1 })
      this._startMathTimer()
    }
  },

  // === STROOP (color-word interference) ===
  startStroop: function () {
    this.setData({ stroopQ: genStroop(), stroopRound: 0, stroopCorrect: 0, stroopChosen: -1, testDone: false })
  },

  tapStroopOption: function (e) {
    if (this.data.stroopChosen >= 0 || this.data.testDone) return
    var idx = parseInt(e.currentTarget.dataset.index)
    var opt = this.data.stroopQ.options[idx]
    var correct = opt.idx === this.data.stroopQ.correctIdx
    this.setData({ stroopChosen: idx })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
    var self = this
    setTimeout(function () {
      var round = self.data.stroopRound + 1
      var cc = self.data.stroopCorrect + (correct ? 1 : 0)
      if (round >= self.data.stroopTotal) {
        self.setData({ stroopRound: round, stroopCorrect: cc, stroopChosen: -1 })
        self._setScore(Math.round(cc / self.data.stroopTotal * 100))
      } else {
        self.setData({ stroopQ: genStroop(), stroopRound: round, stroopCorrect: cc, stroopChosen: -1 })
      }
    }, 600)
  },

  // === VISUAL SEARCH ===
  startVisual: function () {
    var v = genVisual(0)
    this.setData({
      visualCells: v.cells, visualGridSize: v.gridSize,
      visualRound: 0, visualCorrect: 0, visualTapped: -1, testDone: false
    })
    this._visualStart = Date.now()
  },

  tapVisualCell: function (e) {
    if (this.data.visualTapped >= 0 || this.data.testDone) return
    var idx = parseInt(e.currentTarget.dataset.idx)
    var cell = this.data.visualCells[idx]
    var correct = cell.isOdd
    var cc = this.data.visualCorrect + (correct ? 1 : 0)
    this.setData({ visualTapped: idx, visualCorrect: cc })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
    var self = this
    setTimeout(function () {
      var round = self.data.visualRound + 1
      if (round >= self.data.visualTotal) {
        var sec = (Date.now() - self._visualStart) / 1000
        var score = Math.round(cc / self.data.visualTotal * 70) + Math.max(0, Math.round(30 - sec / 2))
        self.setData({ visualRound: round })
        self._setScore(Math.min(100, score))
      } else {
        var v = genVisual(round)
        self.setData({ visualCells: v.cells, visualGridSize: v.gridSize, visualRound: round, visualTapped: -1 })
      }
    }, 800)
  },

  // === SEQUENCE MEMORY (Simon Says) ===
  startSequence: function () {
    var cells = []
    for (var i = 0; i < 9; i++) cells.push({ idx: i, active: false, playerHit: false, wrong: false })
    var seq = []
    for (var i = 0; i < 3; i++) seq.push(Math.floor(Math.random() * 9))
    this.setData({
      seqCells: cells, seqSequence: seq, seqPlayerIdx: 0,
      seqPhase: 'watch', seqLevel: 3, seqShowIdx: -1, seqMaxLevel: 0, testDone: false
    })
    var self = this
    setTimeout(function () { self._playSeq(0) }, 600)
  },

  _resetSeqCells: function () {
    var c = []
    for (var i = 0; i < 9; i++) c.push({ idx: i, active: false, playerHit: false, wrong: false })
    return c
  },

  _playSeq: function (idx) {
    if (idx >= this.data.seqSequence.length) {
      this.setData({ seqPhase: 'input', seqPlayerIdx: 0, seqCells: this._resetSeqCells() })
      return
    }
    var ci = this.data.seqSequence[idx]
    var cells = this._resetSeqCells()
    cells[ci].active = true
    this.setData({ seqCells: cells, seqShowIdx: idx })
    var self = this
    this.seqTimer = setTimeout(function () {
      self.setData({ seqCells: self._resetSeqCells() })
      self.seqTimer = setTimeout(function () { self._playSeq(idx + 1) }, 250)
    }, 500)
  },

  tapSeqCell: function (e) {
    if (this.data.seqPhase !== 'input') return
    var idx = parseInt(e.currentTarget.dataset.idx)
    var expected = this.data.seqSequence[this.data.seqPlayerIdx]
    if (idx === expected) {
      var cells = this._resetSeqCells()
      cells[idx].playerHit = true
      var pi = this.data.seqPlayerIdx + 1
      this.setData({ seqCells: cells, seqPlayerIdx: pi })
      wx.vibrateShort({ type: 'light' })
      var self = this
      setTimeout(function () {
        if (pi >= self.data.seqSequence.length) {
          var seq = self.data.seqSequence.concat([Math.floor(Math.random() * 9)])
          var lv = self.data.seqLevel + 1
          self.setData({
            seqSequence: seq, seqLevel: lv,
            seqMaxLevel: Math.max(self.data.seqMaxLevel, lv),
            seqPhase: 'watch'
          })
          setTimeout(function () { self._playSeq(0) }, 600)
        } else {
          self.setData({ seqCells: self._resetSeqCells() })
        }
      }, 300)
    } else {
      var cells = this._resetSeqCells()
      cells[idx].wrong = true
      cells[expected].active = true
      var maxLv = Math.max(this.data.seqMaxLevel, this.data.seqLevel - 1)
      var score = maxLv >= SEQ_SCORES.length ? 100 : (SEQ_SCORES[maxLv] || 10)
      this.setData({ seqCells: cells, seqPhase: 'result', seqMaxLevel: maxLv })
      wx.vibrateShort({ type: 'heavy' })
      this._setScore(score)
    }
  },

  // === RESULTS ===
  finishDaily: function () {
    this._clearTimers()
    var scores = this.data.testScores
    var total = Math.round((scores[0] + scores[1] + scores[2] + scores[3]) / 4)
    var level = '需要训练'
    if (total >= 90) level = '认知精英'
    else if (total >= 75) level = '敏捷大脑'
    else if (total >= 60) level = '正常水平'
    else if (total >= 40) level = '有待提升'
    var age = calcCogAge(total)

    // Save
    var history = wx.getStorageSync('brain_daily_history') || []
    var today = TODAY(), found = false
    for (var i = 0; i < history.length; i++) {
      if (history[i].date === today) { history[i].score = Math.max(history[i].score, total); found = true; break }
    }
    if (!found) history.push({ date: today, score: total, details: scores.slice() })
    var streak = 1, d = new Date()
    for (var i = 1; i <= 365; i++) {
      d.setDate(d.getDate() - 1)
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var has = false
      for (var j = 0; j < history.length; j++) { if (history[j].date === key) { has = true; break } }
      if (has) streak++; else break
    }
    if (history.length > 30) history = history.slice(-30)
    wx.setStorageSync('brain_daily_history', history)
    wx.setStorageSync('brain_daily_streak', streak)

    this.setData({
      phase: 'result', totalScore: total, brainLevel: level,
      cognitiveAge: age, cogAgeLabel: cogAgeLabel(age),
      streak: streak, todayDone: true, todayScore: total, fadeIn: false
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }); self.drawRadar() }, 100)
  },

  drawRadar: function () {
    var ctx = wx.createCanvasContext('radar', this)
    var w = 200, h = 200, cx = 100, cy = 100, r = 65
    var scores = this.data.testScores, dims = this.data.testDims, n = 4
    // Background rings
    ctx.setStrokeStyle('rgba(255,255,255,0.06)')
    ctx.setLineWidth(1)
    for (var ring = 1; ring <= 4; ring++) {
      var rr = r * ring / 4
      ctx.beginPath()
      for (var i = 0; i < n; i++) {
        var a = Math.PI * 2 * i / n - Math.PI / 2
        if (i === 0) ctx.moveTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a))
        else ctx.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a))
      }
      ctx.closePath(); ctx.stroke()
    }
    // Axes
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n - Math.PI / 2
      ctx.beginPath(); ctx.moveTo(cx, cy)
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); ctx.stroke()
    }
    // Data polygon
    ctx.beginPath()
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n - Math.PI / 2, v = Math.max(0.05, scores[i] / 100)
      var x = cx + r * v * Math.cos(a), y = cy + r * v * Math.sin(a)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.setFillStyle('rgba(34,197,94,0.2)'); ctx.fill()
    ctx.setStrokeStyle('#22c55e'); ctx.setLineWidth(2); ctx.stroke()
    // Points and labels
    for (var i = 0; i < n; i++) {
      var a = Math.PI * 2 * i / n - Math.PI / 2, v = Math.max(0.05, scores[i] / 100)
      ctx.setFillStyle('#22c55e')
      ctx.beginPath()
      ctx.arc(cx + r * v * Math.cos(a), cy + r * v * Math.sin(a), 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.setFillStyle('#999')
      ctx.setFontSize(11)
      ctx.setTextAlign('center')
      ctx.setTextBaseline('middle')
      ctx.fillText(dims[i] || '', cx + (r + 18) * Math.cos(a), cy + (r + 18) * Math.sin(a))
    }
    ctx.draw()
  },

  goHome: function () {
    this.loadHistory()
    this.setData({ phase: 'home', fadeIn: false })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  backToIndex: function () { wx.navigateBack() },

  onShareAppMessage: function () {
    return {
      title: '智变纪|脑力' + this.data.totalScore + '分 认知年龄' + this.data.cognitiveAge + '岁 连续' + this.data.streak + '天',
      path: '/pages/brain-daily/brain-daily?score=' + this.data.totalScore
    }
  },
  onShareTimeline: function () {
    return { title: '智变纪|每日认知训练 认知年龄' + this.data.cognitiveAge + '岁' }
  }
})
