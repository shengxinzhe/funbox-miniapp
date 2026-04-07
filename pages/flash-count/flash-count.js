// flash-count.js
// 闪数挑战 - Subitizing experiment game

var TOTAL_ROUNDS = 10

var DOT_COLORS = ['#5856D6', '#FF9F0A', '#30D158', '#FF3B30', '#007AFF']

// Round configuration: [minDots, maxDots, flashMs]
var ROUND_CONFIG = [
  [5,  12, 1000], // round 1
  [5,  12, 1000], // round 2
  [5,  12, 1000], // round 3
  [10, 25,  800], // round 4
  [10, 25,  800], // round 5
  [10, 25,  800], // round 6
  [20, 40,  600], // round 7
  [20, 40,  600], // round 8
  [35, 60,  500], // round 9
  [35, 60,  500], // round 10
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calcScore(actual, guess) {
  var diff = Math.abs(actual - guess)
  if (diff === 0) return 100
  if (diff === 1) return 90
  if (diff === 2) return 75
  if (diff === 3) return 60
  if (diff === 4) return 45
  if (diff === 5) return 30
  return Math.max(0, 20 - (diff - 5) * 3)
}

function getRating(score) {
  if (score >= 900) return { rating: 'S', label: '超凡数感', cls: 'rating-s' }
  if (score >= 750) return { rating: 'A', label: '敏锐感知', cls: 'rating-a' }
  if (score >= 600) return { rating: 'B', label: '良好直觉', cls: 'rating-b' }
  if (score >= 400) return { rating: 'C', label: '普通水平', cls: 'rating-c' }
  return { rating: 'D', label: '需要练习', cls: 'rating-d' }
}

function getFeedbackClass(diff) {
  if (diff === 0) return 'correct'
  if (diff <= 3) return 'close'
  return 'wrong'
}

function getDiffText(actual, guess) {
  var diff = actual - guess
  if (diff === 0) return '完全正确！'
  if (diff > 0) return '少估了 ' + diff + ' 个'
  return '多估了 ' + Math.abs(diff) + ' 个'
}

Page({
  data: {
    phase: 'home',         // home | ready | flash | recall | guess | feedback | result
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    countdownNum: 3,
    countdownAnim: '',
    guessInput: '',
    actualCount: 0,
    userGuess: 0,
    pointsEarned: 0,
    totalScore: 0,
    feedbackClass: '',
    diffText: '',
    bestScore: 0,
    rating: '',
    ratingLabel: '',
    ratingClass: '',
    accuracy: 0,
    isNewBest: false
  },

  // Non-reactive state
  _roundScores: [],
  _canvasNode: null,
  _canvasCtx: null,
  _canvasSize: 0,
  _flashTimer: null,
  _countdownTimer: null,

  onLoad: function () {
    var best = wx.getStorageSync('flash_count_best') || 0
    this.setData({ bestScore: best })
  },

  onUnload: function () {
    this._clearTimers()
  },

  _clearTimers: function () {
    if (this._flashTimer) clearTimeout(this._flashTimer)
    if (this._countdownTimer) clearTimeout(this._countdownTimer)
    this._flashTimer = null
    this._countdownTimer = null
  },

  // ===== HOME =====
  startGame: function () {
    this._roundScores = []
    this._clearTimers()
    this.setData({
      phase: 'ready',
      currentRound: 0,
      totalScore: 0,
      guessInput: '',
      countdownNum: 3
    })
    this._runCountdown(3)
  },

  goHome: function () {
    this._clearTimers()
    this.setData({ phase: 'home' })
  },

  restartGame: function () {
    this.startGame()
  },

  // ===== COUNTDOWN =====
  _runCountdown: function (n) {
    var self = this
    self.setData({ countdownNum: n, countdownAnim: '' })
    // force re-animation by toggling class
    setTimeout(function () {
      self.setData({ countdownAnim: 'countdown-pop' })
    }, 20)

    if (n > 1) {
      self._countdownTimer = setTimeout(function () {
        self._runCountdown(n - 1)
      }, 800)
    } else {
      // after last count, begin round
      self._countdownTimer = setTimeout(function () {
        self._beginRound()
      }, 800)
    }
  },

  // ===== ROUND FLOW =====
  _beginRound: function () {
    var round = this.data.currentRound + 1
    this.setData({ currentRound: round, phase: 'flash', guessInput: '' })
    this._initCanvas(round)
  },

  _initCanvas: function (round) {
    var self = this
    // We need to wait a tick for canvas to render
    setTimeout(function () {
      wx.createSelectorQuery()
        .in(self)
        .select('#flashCanvas')
        .fields({ node: true, size: true })
        .exec(function (res) {
          if (!res || !res[0] || !res[0].node) {
            // retry once
            setTimeout(function () { self._initCanvas(round) }, 100)
            return
          }
          var canvas = res[0].node
          var w = res[0].width
          var h = res[0].height
          var dpr = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : (wx.getSystemInfoSync().pixelRatio || 2)
          canvas.width = w * dpr
          canvas.height = h * dpr
          var ctx = canvas.getContext('2d')
          ctx.scale(dpr, dpr)
          self._canvasNode = canvas
          self._canvasCtx = ctx
          self._canvasSize = w  // logical pixels
          self._flashDots(round, ctx, w, h)
        })
    }, 80)
  },

  _flashDots: function (round, ctx, w, h) {
    var self = this
    var cfg = ROUND_CONFIG[round - 1]
    var minDots = cfg[0]
    var maxDots = cfg[1]
    var flashMs = cfg[2]
    var dotCount = randInt(minDots, maxDots)

    // Generate non-overlapping dot positions
    var dots = self._generateDots(dotCount, w, h)

    // Draw dots
    self._clearCanvas(ctx, w, h)
    self._drawDots(ctx, dots)

    // After flash duration, clear canvas and show recall hint, then go to guess
    self._flashTimer = setTimeout(function () {
      self._clearCanvas(ctx, w, h)
      self._drawRecallText(ctx, w, h)
      self.setData({ phase: 'recall', actualCount: dotCount })

      self._flashTimer = setTimeout(function () {
        self.setData({ phase: 'guess' })
      }, 500)
    }, flashMs)
  },

  _generateDots: function (count, w, h) {
    var dots = []
    var padding = 24  // logical px
    var minR = 6      // min radius in logical px (12rpx dia -> ~6px on typical screen)
    var maxR = 14     // max radius in logical px (28rpx dia -> ~14px)

    for (var i = 0; i < count; i++) {
      var placed = false
      for (var attempt = 0; attempt < 50; attempt++) {
        var r = minR + Math.random() * (maxR - minR)
        var x = padding + r + Math.random() * (w - 2 * padding - 2 * r)
        var y = padding + r + Math.random() * (h - 2 * padding - 2 * r)
        var ok = true
        for (var j = 0; j < dots.length; j++) {
          var dx = x - dots[j].x
          var dy = y - dots[j].y
          var minDist = r + dots[j].r + 4
          if (dx * dx + dy * dy < minDist * minDist) {
            ok = false
            break
          }
        }
        if (ok) {
          dots.push({
            x: x,
            y: y,
            r: r,
            color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)]
          })
          placed = true
          break
        }
      }
      if (!placed) {
        // place anyway to avoid infinite loops in dense configurations
        var r2 = minR
        dots.push({
          x: padding + r2 + Math.random() * (w - 2 * padding - 2 * r2),
          y: padding + r2 + Math.random() * (h - 2 * padding - 2 * r2),
          r: r2,
          color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)]
        })
      }
    }
    return dots
  },

  _clearCanvas: function (ctx, w, h) {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
  },

  _drawDots: function (ctx, dots) {
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i]
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = d.color
      ctx.fill()
    }
  },

  _drawRecallText: function (ctx, w, h) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#AEAEB2'
    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('回忆数量...', w / 2, h / 2)
  },

  // ===== GUESS INPUT =====
  onKeyTap: function (e) {
    var val = e.currentTarget.dataset.val + ''
    var current = this.data.guessInput
    // Limit to 3 digits (max possible count is 60)
    if (current.length >= 3) return
    var next = current + val
    // Prevent leading zeros (unless it's just "0")
    if (next.length > 1 && next[0] === '0') return
    this.setData({ guessInput: next })
  },

  onBackspace: function () {
    var current = this.data.guessInput
    if (current.length === 0) return
    this.setData({ guessInput: current.slice(0, -1) })
  },

  onConfirm: function () {
    var input = this.data.guessInput
    if (input === '' || input === '0') return
    var guess = parseInt(input, 10)
    var actual = this.data.actualCount
    var diff = Math.abs(actual - guess)
    var points = calcScore(actual, guess)
    var newTotal = this.data.totalScore + points
    var fbClass = getFeedbackClass(diff)
    var diffText = getDiffText(actual, guess)

    this._roundScores.push(points)

    this.setData({
      phase: 'feedback',
      userGuess: guess,
      pointsEarned: points,
      totalScore: newTotal,
      feedbackClass: fbClass,
      diffText: diffText
    })

    var self = this
    var isLastRound = this.data.currentRound >= TOTAL_ROUNDS

    self._flashTimer = setTimeout(function () {
      if (isLastRound) {
        self._showResult(newTotal)
      } else {
        // Next round countdown
        self.setData({ phase: 'ready', countdownNum: 3 })
        self._runCountdown(3)
      }
    }, 1500)
  },

  // ===== RESULT =====
  _showResult: function (total) {
    var ratingData = getRating(total)

    // Calculate accuracy: average of per-round percentage (points/100)
    var scores = this._roundScores
    var sumPct = 0
    for (var i = 0; i < scores.length; i++) {
      sumPct += scores[i]
    }
    var accuracy = Math.round(sumPct / scores.length)

    var bestScore = this.data.bestScore
    var isNewBest = total > bestScore
    if (isNewBest) {
      bestScore = total
      wx.setStorageSync('flash_count_best', total)
    }

    this.setData({
      phase: 'result',
      totalScore: total,
      accuracy: accuracy,
      rating: ratingData.rating,
      ratingLabel: ratingData.label,
      ratingClass: ratingData.cls,
      bestScore: bestScore,
      isNewBest: isNewBest
    })
  },

  // ===== SHARE =====
  onShareAppMessage: function () {
    var score = this.data.totalScore
    var rating = this.data.rating
    return {
      title: '闪数挑战 | 我的数感指数 ' + rating + '，得了 ' + score + ' 分，你能超过我吗？',
      path: '/pages/flash-count/flash-count'
    }
  },

  onShareTimeline: function () {
    var score = this.data.totalScore
    var rating = this.data.rating
    return {
      title: '闪数挑战 | 数感指数 ' + rating + '，' + score + ' 分，来挑战！'
    }
  }
})
