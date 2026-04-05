// Challenge generators
function genMathChallenge() {
  var ops = ['+', '-', 'x']
  var op = ops[Math.floor(Math.random() * ops.length)]
  var a, b, answer
  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 10
    b = Math.floor(Math.random() * 50) + 10
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 30
    b = Math.floor(Math.random() * 30) + 1
    answer = a - b
  } else {
    a = Math.floor(Math.random() * 12) + 2
    b = Math.floor(Math.random() * 12) + 2
    answer = a * b
  }
  var wrong1 = answer + Math.floor(Math.random() * 5) + 1
  var wrong2 = answer - Math.floor(Math.random() * 5) - 1
  var wrong3 = answer + Math.floor(Math.random() * 10) - 5
  if (wrong3 === answer) wrong3 = answer + 7
  var opts = shuffle([answer, wrong1, wrong2, wrong3])
  return {
    type: 'math',
    title: '请计算以下算式',
    question: a + ' ' + op + ' ' + b + ' = ?',
    options: opts.map(function (v) { return String(v) }),
    answer: String(answer)
  }
}

function genEmojiChallenge() {
  var sets = [
    { target: '找出所有的猫', match: ['🐱','🐈','😺','😸'], decoy: ['🐶','🐕','🦊','🐰','🐻','🐼','🐨','🐯'] },
    { target: '找出所有的食物', match: ['🍕','🍔','🌮','🍣'], decoy: ['⚽','🎸','📱','🚗','✈️','🎨','🔧','💡'] },
    { target: '找出所有的交通工具', match: ['🚗','✈️','🚂','🚢'], decoy: ['🍎','🌸','⭐','🎵','📚','🏠','🎯','💎'] },
    { target: '找出所有的天气', match: ['☀️','🌧️','❄️','⛈️'], decoy: ['🍕','🎸','📱','🚗','🐱','🎨','🔧','💡'] },
    { target: '找出所有的乐器', match: ['🎸','🎹','🥁','🎺'], decoy: ['🍎','🚗','📱','⭐','🐶','🌸','🔧','💡'] }
  ]
  var set = sets[Math.floor(Math.random() * sets.length)]
  var grid = shuffle(set.match.concat(set.decoy.slice(0, 5))).slice(0, 9)
  // Ensure at least 2 matches in grid
  var matchCount = 0
  for (var i = 0; i < grid.length; i++) {
    if (set.match.indexOf(grid[i]) >= 0) matchCount++
  }
  if (matchCount < 2) {
    grid[0] = set.match[0]
    grid[grid.length - 1] = set.match[1]
    grid = shuffle(grid)
  }
  return {
    type: 'emoji',
    title: set.target,
    grid: grid,
    answers: set.match
  }
}

function genSequenceChallenge() {
  var templates = [
    { seq: [2, 4, 6, 8], next: 10, hint: '2, 4, 6, 8, ?' },
    { seq: [1, 1, 2, 3, 5], next: 8, hint: '1, 1, 2, 3, 5, ?' },
    { seq: [3, 6, 9, 12], next: 15, hint: '3, 6, 9, 12, ?' },
    { seq: [1, 4, 9, 16], next: 25, hint: '1, 4, 9, 16, ?' },
    { seq: [2, 6, 18, 54], next: 162, hint: '2, 6, 18, 54, ?' },
    { seq: [1, 3, 7, 15], next: 31, hint: '1, 3, 7, 15, ?' },
    { seq: [100, 81, 64, 49], next: 36, hint: '100, 81, 64, 49, ?' }
  ]
  var t = templates[Math.floor(Math.random() * templates.length)]
  var wrong1 = t.next + Math.floor(Math.random() * 3) + 1
  var wrong2 = t.next - Math.floor(Math.random() * 3) - 1
  var wrong3 = t.next + Math.floor(Math.random() * 6) - 3
  if (wrong3 === t.next) wrong3 = t.next + 4
  var opts = shuffle([t.next, wrong1, wrong2, wrong3])
  return {
    type: 'sequence',
    title: '找出规律，选择下一个数',
    question: t.hint,
    options: opts.map(function (v) { return String(v) }),
    answer: String(t.next)
  }
}

function genColorCountChallenge() {
  var colors = [
    { name: '红色', emoji: '🔴', color: '#e74c3c' },
    { name: '蓝色', emoji: '🔵', color: '#3498db' },
    { name: '绿色', emoji: '🟢', color: '#22c55e' },
    { name: '黄色', emoji: '🟡', color: '#f39c12' },
    { name: '紫色', emoji: '🟣', color: '#9b59b6' }
  ]
  var targetColor = colors[Math.floor(Math.random() * colors.length)]
  var count = Math.floor(Math.random() * 4) + 2
  var grid = []
  for (var i = 0; i < count; i++) grid.push(targetColor.emoji)
  while (grid.length < 12) {
    var other = colors[Math.floor(Math.random() * colors.length)]
    if (other.name !== targetColor.name) grid.push(other.emoji)
  }
  grid = shuffle(grid)
  var wrong1 = count + 1
  var wrong2 = Math.max(1, count - 1)
  var wrong3 = count + 2
  var opts = shuffle([count, wrong1, wrong2, wrong3])
  return {
    type: 'colorcount',
    title: '数一数有多少个' + targetColor.name + '圆圈',
    grid: grid,
    options: opts.map(function (v) { return String(v) }),
    answer: String(count)
  }
}

function genRotateTextChallenge() {
  var words = ['验证','机器','人类','智能','密码','安全','通过','确认']
  var word = words[Math.floor(Math.random() * words.length)]
  var rotation = [90, 180, 270][Math.floor(Math.random() * 3)]
  return {
    type: 'rotate',
    title: '识别旋转后的文字',
    word: word,
    rotation: rotation,
    options: shuffle([word, words[(words.indexOf(word) + 1) % words.length], words[(words.indexOf(word) + 2) % words.length], words[(words.indexOf(word) + 3) % words.length]]),
    answer: word
  }
}

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

var generators = [genMathChallenge, genEmojiChallenge, genSequenceChallenge, genColorCountChallenge, genRotateTextChallenge]

Page({
  data: {
    phase: 'intro',
    current: 0,
    total: 8,
    challenge: null,
    selected: [],
    answered: false,
    correct: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    fadeIn: false,
    cardAnim: '',
    verified: false,
    checkboxChecked: false,
    bestScore: 0,
    timeLeft: 0,
    timerText: ''
  },

  onLoad: function () {
    var best = wx.getStorageSync('captcha_best') || 0
    this.setData({ bestScore: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  onUnload: function () {
    if (this._timer) clearInterval(this._timer)
  },

  tapCheckbox: function () {
    this.setData({ checkboxChecked: true })
    wx.vibrateShort({ type: 'light' })
    var self = this
    setTimeout(function () {
      self._startChallenges()
    }, 600)
  },

  _startChallenges: function () {
    this._challenges = []
    var used = {}
    while (this._challenges.length < 8) {
      var idx = Math.floor(Math.random() * generators.length)
      var c = generators[idx]()
      // Avoid too many same type
      var typeCount = used[c.type] || 0
      if (typeCount >= 2) continue
      used[c.type] = typeCount + 1
      this._challenges.push(c)
    }
    this._startTime = Date.now()
    this._elapsed = 0
    var self = this
    this._timer = setInterval(function () {
      self._elapsed = Math.floor((Date.now() - self._startTime) / 1000)
      var m = Math.floor(self._elapsed / 60)
      var s = self._elapsed % 60
      self.setData({ timerText: (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s })
    }, 1000)

    this.setData({
      phase: 'playing',
      current: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      challenge: this._challenges[0],
      selected: [],
      answered: false,
      cardAnim: 'card-enter'
    })
  },

  selectOption: function (e) {
    if (this.data.answered) return
    var val = e.currentTarget.dataset.val
    var ch = this.data.challenge

    if (ch.type === 'emoji') {
      // Toggle selection
      var sel = this.data.selected.slice()
      var idx = sel.indexOf(val)
      if (idx >= 0) sel.splice(idx, 1)
      else sel.push(val)
      this.setData({ selected: sel })
      return
    }

    // Single answer types
    var correct = (val === ch.answer)
    var combo = correct ? this.data.combo + 1 : 0
    var score = this.data.score + (correct ? 10 + combo * 2 : 0)
    this.setData({
      answered: true,
      correct: correct,
      selected: [val],
      score: score,
      combo: combo,
      maxCombo: Math.max(this.data.maxCombo, combo)
    })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
  },

  submitEmoji: function () {
    if (this.data.answered) return
    var ch = this.data.challenge
    var sel = this.data.selected
    // Check if all selected are correct and all correct are selected
    var allCorrect = true
    var grid = ch.grid
    for (var i = 0; i < grid.length; i++) {
      var isMatch = ch.answers.indexOf(grid[i]) >= 0
      var isSelected = sel.indexOf(String(i)) >= 0
      if (isMatch !== isSelected) { allCorrect = false; break }
    }
    var combo = allCorrect ? this.data.combo + 1 : 0
    var score = this.data.score + (allCorrect ? 10 + combo * 2 : 0)
    this.setData({
      answered: true,
      correct: allCorrect,
      score: score,
      combo: combo,
      maxCombo: Math.max(this.data.maxCombo, combo)
    })
    wx.vibrateShort({ type: allCorrect ? 'light' : 'heavy' })
  },

  nextChallenge: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      if (this._timer) clearInterval(this._timer)
      var verified = this.data.score >= 50
      if (this.data.score > this.data.bestScore) {
        wx.setStorageSync('captcha_best', this.data.score)
      }
      this.setData({
        phase: 'result',
        verified: verified,
        bestScore: Math.max(this.data.bestScore, this.data.score)
      })
      wx.vibrateShort({ type: 'heavy' })
      return
    }
    this.setData({
      current: next,
      challenge: this._challenges[next],
      selected: [],
      answered: false,
      correct: false,
      cardAnim: ''
    })
    var self = this
    setTimeout(function () { self.setData({ cardAnim: 'card-enter' }) }, 30)
  },

  restart: function () {
    this.setData({ phase: 'intro', checkboxChecked: false })
  },

  onShareAppMessage: function () {
    var msg = this.data.verified ? '我通过了人类验证！' : '我被判定为机器人了...'
    return {
      title: msg + ' 你能证明自己是人类吗？',
      path: '/pages/captcha/captcha'
    }
  },

  onShareTimeline: function () {
    return { title: '我不是机器人 - 智变纪趣味实验室' }
  }
})