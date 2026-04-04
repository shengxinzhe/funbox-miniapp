// pages/nback/nback.js
// 双重 N-Back 工作记忆挑战

var GRID_SIZE = 3       // 3x3 grid
var CELLS = GRID_SIZE * GRID_SIZE
var COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316']
var INTERVAL_MS = 2500  // time between stimuli
var ROUNDS_PER_LEVEL = 20 + 5 // 20 base + n extra for n-back matching
var MATCH_RATE = 0.25   // ~25% of rounds should be matches

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateSequence(n, total) {
  var posSeq = []
  var colSeq = []
  // Generate random sequences with controlled match rate
  for (var i = 0; i < total; i++) {
    if (i >= n && Math.random() < MATCH_RATE) {
      // position match
      posSeq.push(posSeq[i - n])
    } else {
      posSeq.push(Math.floor(Math.random() * CELLS))
    }
    if (i >= n && Math.random() < MATCH_RATE) {
      // color match
      colSeq.push(colSeq[i - n])
    } else {
      colSeq.push(Math.floor(Math.random() * COLORS.length))
    }
  }
  return { positions: posSeq, colors: colSeq }
}

Page({
  data: {
    phase: 'intro',     // intro | playing | feedback | levelup | result
    nLevel: 1,
    round: 0,
    totalRounds: 0,
    activeCell: -1,
    activeColor: '',
    cells: [],
    posCorrect: 0,
    colCorrect: 0,
    posWrong: 0,
    colWrong: 0,
    posMatches: 0,
    colMatches: 0,
    pressedPos: false,
    pressedCol: false,
    isPosMatch: false,
    isColMatch: false,
    showFeedback: false,
    feedbackPos: '',  // correct | wrong | missed | ''
    feedbackCol: '',
    bestLevel: 1,
    score: 0,
    streak: 0,
    maxStreak: 0,
    fadeIn: false,
    cellPulse: false,
    levelUpAnim: false,
    // result
    finalLevel: 1,
    totalCorrect: 0,
    totalWrong: 0,
    accuracy: 0
  },

  sequence: null,
  timer: null,
  feedbackTimer: null,
  levelScore: 0,
  levelTotal: 0,

  onLoad: function () {
    // Build cells array
    var cells = []
    for (var i = 0; i < CELLS; i++) {
      cells.push({ id: i })
    }
    var best = wx.getStorageSync('nback_best') || 1
    this.setData({ cells: cells, bestLevel: best, fadeIn: true })
  },

  startGame: function () {
    this.setData({
      phase: 'playing',
      nLevel: 1,
      score: 0,
      streak: 0,
      maxStreak: 0,
      fadeIn: false
    })
    var self = this
    setTimeout(function () {
      self.setData({ fadeIn: true })
      self.startLevel(1)
    }, 50)
  },

  startLevel: function (n) {
    var total = 20 + n
    var seq = generateSequence(n, total)
    this.sequence = seq
    this.levelScore = 0
    this.levelTotal = 0
    this.setData({
      nLevel: n,
      round: 0,
      totalRounds: total,
      posCorrect: 0,
      colCorrect: 0,
      posWrong: 0,
      colWrong: 0,
      posMatches: 0,
      colMatches: 0,
      activeCell: -1,
      activeColor: '',
      pressedPos: false,
      pressedCol: false,
      showFeedback: false,
      levelUpAnim: false
    })
    var self = this
    // small delay then start
    setTimeout(function () {
      self.showStimulus()
    }, 800)
  },

  showStimulus: function () {
    var r = this.data.round
    var seq = this.sequence
    if (r >= this.data.totalRounds) {
      this.endLevel()
      return
    }
    var pos = seq.positions[r]
    var colIdx = seq.colors[r]
    var n = this.data.nLevel

    // Check if this IS a match
    var isPosMatch = r >= n && seq.positions[r] === seq.positions[r - n]
    var isColMatch = r >= n && seq.colors[r] === seq.colors[r - n]

    this.setData({
      activeCell: pos,
      activeColor: COLORS[colIdx],
      pressedPos: false,
      pressedCol: false,
      isPosMatch: isPosMatch,
      isColMatch: isColMatch,
      showFeedback: false,
      cellPulse: true
    })

    if (isPosMatch) this.setData({ posMatches: this.data.posMatches + 1 })
    if (isColMatch) this.setData({ colMatches: this.data.colMatches + 1 })

    var self = this
    // After interval, evaluate and move to next
    this.timer = setTimeout(function () {
      self.setData({ cellPulse: false })
      self.evaluateRound()
    }, INTERVAL_MS - 400)
  },

  tapPosition: function () {
    if (this.data.pressedPos || this.data.round < this.data.nLevel) return
    this.setData({ pressedPos: true })
    wx.vibrateShort({ type: 'light' })
  },

  tapColor: function () {
    if (this.data.pressedCol || this.data.round < this.data.nLevel) return
    this.setData({ pressedCol: true })
    wx.vibrateShort({ type: 'light' })
  },

  evaluateRound: function () {
    var isPM = this.data.isPosMatch
    var isCM = this.data.isColMatch
    var pPress = this.data.pressedPos
    var cPress = this.data.pressedCol
    var r = this.data.round
    var n = this.data.nLevel

    var fbPos = ''
    var fbCol = ''
    var pcAdd = 0, pwAdd = 0, ccAdd = 0, cwAdd = 0
    var scoreAdd = 0

    if (r >= n) {
      // Position
      if (isPM && pPress) { fbPos = 'correct'; pcAdd = 1; scoreAdd += 10 }
      else if (isPM && !pPress) { fbPos = 'missed'; pwAdd = 1 }
      else if (!isPM && pPress) { fbPos = 'wrong'; pwAdd = 1 }
      // Color
      if (isCM && cPress) { fbCol = 'correct'; ccAdd = 1; scoreAdd += 10 }
      else if (isCM && !cPress) { fbCol = 'missed'; cwAdd = 1 }
      else if (!isCM && cPress) { fbCol = 'wrong'; cwAdd = 1 }

      this.levelTotal++
      if (fbPos === 'correct' || (!isPM && !pPress)) this.levelScore++
      if (fbCol === 'correct' || (!isCM && !cPress)) this.levelScore++
    }

    var newStreak = (fbPos !== 'wrong' && fbPos !== 'missed' && fbCol !== 'wrong' && fbCol !== 'missed') ? this.data.streak + 1 : 0

    this.setData({
      feedbackPos: fbPos,
      feedbackCol: fbCol,
      showFeedback: r >= n && (fbPos !== '' || fbCol !== ''),
      posCorrect: this.data.posCorrect + pcAdd,
      colCorrect: this.data.colCorrect + ccAdd,
      posWrong: this.data.posWrong + pwAdd,
      colWrong: this.data.colWrong + cwAdd,
      score: this.data.score + scoreAdd,
      streak: newStreak,
      maxStreak: Math.max(this.data.maxStreak, newStreak),
      activeCell: -1,
      activeColor: '',
      round: r + 1
    })

    var self = this
    this.feedbackTimer = setTimeout(function () {
      self.setData({ showFeedback: false })
      self.showStimulus()
    }, 400)
  },

  endLevel: function () {
    // Calculate accuracy for this level
    var totalChecks = this.levelTotal * 2
    var accuracy = totalChecks > 0 ? Math.round(this.levelScore / totalChecks * 100) : 0
    var n = this.data.nLevel

    if (accuracy >= 70 && n < 9) {
      // Level up!
      this.setData({ levelUpAnim: true })
      var self = this
      setTimeout(function () {
        self.startLevel(n + 1)
      }, 2000)
    } else {
      // Game over
      var best = Math.max(this.data.bestLevel, n)
      wx.setStorageSync('nback_best', best)
      var totalC = this.data.posCorrect + this.data.colCorrect
      var totalW = this.data.posWrong + this.data.colWrong
      var totalAll = totalC + totalW
      this.setData({
        phase: 'result',
        finalLevel: n,
        bestLevel: best,
        totalCorrect: totalC,
        totalWrong: totalW,
        accuracy: totalAll > 0 ? Math.round(totalC / totalAll * 100) : 0,
        fadeIn: false
      })
      var self = this
      setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
    }
  },

  restart: function () {
    if (this.timer) clearTimeout(this.timer)
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer)
    this.startGame()
  },

  backToHome: function () {
    if (this.timer) clearTimeout(this.timer)
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer)
    wx.navigateBack()
  },

  onUnload: function () {
    if (this.timer) clearTimeout(this.timer)
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer)
  },

  onShareAppMessage: function () {
    return {
      title: '智变纪 | 我在N-Back挑战中达到了 ' + this.data.finalLevel + '-Back，你能超越吗？',
      path: '/pages/nback/nback'
    }
  },

  onShareTimeline: function () {
    return {
      title: '智变纪 | 双重N-Back工作记忆挑战：你的大脑极限在哪里？'
    }
  }
})
