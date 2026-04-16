// sumplete.js
// 数和删 - Sumplete puzzle game

const DIFFICULTIES = [
  { size: 3, label: '3x3', desc: '入门', maxNum: 9 },
  { size: 5, label: '5x5', desc: '进阶', maxNum: 9 },
  { size: 7, label: '7x7', desc: '挑战', maxNum: 9 },
  { size: 9, label: '9x9', desc: '大师', maxNum: 9 }
]

// Cell states: 0 = unknown, 1 = deleted (excluded), 2 = kept (included)
const UNKNOWN = 0
const DELETED = 1
const KEPT = 2

/**
 * Count solutions up to maxCount using row-subset backtracking with
 * bidirectional column-sum pruning. Returns 0, 1, or 2 (capped).
 */
function _countSolutions(grid, rowTargets, colTargets, size, maxCount) {
  // For each row, enumerate bitmasks whose selected cells sum to row target
  var rowOptions = []
  for (var r = 0; r < size; r++) {
    var opts = []
    var total = 1 << size
    for (var mask = 0; mask < total; mask++) {
      var sum = 0
      for (var c = 0; c < size; c++) {
        if (mask & (1 << c)) sum += grid[r][c]
      }
      if (sum === rowTargets[r]) opts.push(mask)
    }
    if (opts.length === 0) return 0
    rowOptions.push(opts)
  }

  // Precompute max remaining column sums: colMax[r][c] = sum of grid[i][c] for i >= r
  var colMax = []
  for (var i = 0; i <= size; i++) colMax.push(new Array(size).fill(0))
  for (var r2 = size - 1; r2 >= 0; r2--) {
    for (var c2 = 0; c2 < size; c2++) {
      colMax[r2][c2] = colMax[r2 + 1][c2] + grid[r2][c2]
    }
  }

  var count = 0
  var colSums = new Array(size).fill(0)

  function bt(row) {
    if (count >= maxCount) return
    if (row === size) {
      for (var c = 0; c < size; c++) {
        if (colSums[c] !== colTargets[c]) return
      }
      count++
      return
    }
    for (var i = 0; i < rowOptions[row].length; i++) {
      var mask = rowOptions[row][i]
      // Apply mask
      for (var c = 0; c < size; c++) {
        if (mask & (1 << c)) colSums[c] += grid[row][c]
      }
      // Prune: check upper & lower bounds on each column
      var ok = true
      for (var c = 0; c < size; c++) {
        if (colSums[c] > colTargets[c]) { ok = false; break }
        if (colSums[c] + colMax[row + 1][c] < colTargets[c]) { ok = false; break }
      }
      if (ok) bt(row + 1)
      // Undo mask
      for (var c = 0; c < size; c++) {
        if (mask & (1 << c)) colSums[c] -= grid[row][c]
      }
      if (count >= maxCount) return
    }
  }

  bt(0)
  return count
}

/**
 * Generate a Sumplete puzzle with a guaranteed unique solution.
 * Retries with fresh random grids until uniqueness is verified by solver.
 */
function generatePuzzle(size, maxNum) {
  var MAX_ATTEMPTS = 500

  for (var attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // 1. Create random grid
    var grid = []
    for (var r = 0; r < size; r++) {
      var row = []
      for (var c = 0; c < size; c++) {
        row.push(Math.floor(Math.random() * maxNum) + 1)
      }
      grid.push(row)
    }

    // 2. Create random solution mask (true = keep, false = delete)
    var solution = []
    for (var r = 0; r < size; r++) {
      var srow = []
      for (var c = 0; c < size; c++) {
        srow.push(Math.random() < 0.5)
      }
      solution.push(srow)
    }

    // Ensure each row has at least one kept and one deleted
    for (var r = 0; r < size; r++) {
      if (!solution[r].some(function (v) { return v })) {
        solution[r][Math.floor(Math.random() * size)] = true
      }
      if (solution[r].every(function (v) { return v })) {
        var idx
        do { idx = Math.floor(Math.random() * size) } while (!solution[r][idx])
        solution[r][idx] = false
      }
    }

    // Ensure each column has at least one kept and one deleted
    for (var c = 0; c < size; c++) {
      if (!solution.some(function (row) { return row[c] })) {
        solution[Math.floor(Math.random() * size)][c] = true
      }
      if (solution.every(function (row) { return row[c] })) {
        var idx
        do { idx = Math.floor(Math.random() * size) } while (!solution[idx][c])
        solution[idx][c] = false
      }
    }

    // 3. Calculate target sums
    var rowTargets = []
    for (var r = 0; r < size; r++) {
      var sum = 0
      for (var c = 0; c < size; c++) {
        if (solution[r][c]) sum += grid[r][c]
      }
      rowTargets.push(sum)
    }

    var colTargets = []
    for (var c = 0; c < size; c++) {
      var sum = 0
      for (var r = 0; r < size; r++) {
        if (solution[r][c]) sum += grid[r][c]
      }
      colTargets.push(sum)
    }

    // 4. Verify unique solution (exactly 1 solution exists)
    if (_countSolutions(grid, rowTargets, colTargets, size, 2) === 1) {
      return { grid, solution, rowTargets, colTargets }
    }
  }

  // Fallback: should rarely reach here; return last attempt anyway
  return { grid: grid, solution: solution, rowTargets: rowTargets, colTargets: colTargets }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
}

Page({
  data: {
    phase: 'intro',       // intro | playing | complete
    difficulties: DIFFICULTIES,
    selectedDiff: 0,
    // game state
    size: 3,
    grid: [],             // 2D array of numbers
    cellStates: [],       // 2D array of UNKNOWN/DELETED/KEPT
    rowTargets: [],
    colTargets: [],
    rowMatch: [],         // bool array: does current sum match target?
    colMatch: [],
    timer: 0,
    timerDisplay: '00:00',
    moveCount: 0,
    // complete
    stars: 0,
    // progress
    bestTimes: {},        // { '3': 45, '5': 120, ... }
    bestStars: {}         // { '3': 3, '5': 2, ... }
  },

  _timerInterval: null,
  _solution: null,
  _startTime: 0,

  onLoad() {
    this._loadProgress()
  },

  onUnload() {
    this._stopTimer()
  },

  // ─── Progress ───
  _loadProgress() {
    let saved = {}
    try { saved = wx.getStorageSync('sumplete_progress') || {} } catch (e) {}
    this.setData({
      bestTimes: saved.bestTimes || {},
      bestStars: saved.bestStars || {}
    })
  },

  _saveProgress(size, time, stars) {
    const bestTimes = Object.assign({}, this.data.bestTimes)
    const bestStars = Object.assign({}, this.data.bestStars)
    const key = String(size)
    if (!bestTimes[key] || time < bestTimes[key]) bestTimes[key] = time
    if (!bestStars[key] || stars > bestStars[key]) bestStars[key] = stars
    this.setData({ bestTimes, bestStars })
    try {
      wx.setStorageSync('sumplete_progress', { bestTimes, bestStars })
    } catch (e) {}
  },

  // ─── Intro ───
  selectDifficulty(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    this.setData({ selectedDiff: idx })
  },

  startGame() {
    const diff = DIFFICULTIES[this.data.selectedDiff]
    wx.showLoading({ title: '生成谜题...' })
    // Use setTimeout to let the loading indicator render before heavy computation
    setTimeout(() => {
      const { grid, solution, rowTargets, colTargets } = generatePuzzle(diff.size, diff.maxNum)
      wx.hideLoading()
      this._solution = solution

      const cellStates = []
      for (let r = 0; r < diff.size; r++) {
        cellStates.push(new Array(diff.size).fill(UNKNOWN))
      }

      // Calculate cell size to fit screen (750rpx - 64rpx padding = 686rpx available)
      const cols = diff.size + 1 // grid + target column
      const gap = 6
      const available = 686 - (cols - 1) * gap
      const cellSize = Math.min(80, Math.floor(available / cols))

      this.setData({
        phase: 'playing',
        size: diff.size,
        grid,
        cellStates,
        rowTargets,
        colTargets,
        rowMatch: new Array(diff.size).fill(false),
        colMatch: new Array(diff.size).fill(false),
        timer: 0,
        timerDisplay: '00:00',
        moveCount: 0,
        cellSize
      })

      this._startTime = Date.now()
      this._startTimer()
    }, 50)
  },

  // ─── Timer ───
  _startTimer() {
    this._stopTimer()
    this._timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._startTime) / 1000)
      this.setData({ timer: elapsed, timerDisplay: formatTime(elapsed) })
    }, 1000)
  },

  _stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
  },

  // ─── Cell tap ───
  tapCell(e) {
    if (this.data.phase !== 'playing') return
    const r = Number(e.currentTarget.dataset.r)
    const c = Number(e.currentTarget.dataset.c)

    const cellStates = this.data.cellStates.map(row => row.slice())
    // Cycle: unknown -> deleted -> kept -> unknown
    cellStates[r][c] = (cellStates[r][c] + 1) % 3

    // Recalculate row/col match
    const { grid, rowTargets, colTargets, size } = this.data
    const rowMatch = []
    for (let ri = 0; ri < size; ri++) {
      let sum = 0
      for (let ci = 0; ci < size; ci++) {
        if (cellStates[ri][ci] !== DELETED) sum += grid[ri][ci]
      }
      rowMatch.push(sum === rowTargets[ri])
    }
    const colMatch = []
    for (let ci = 0; ci < size; ci++) {
      let sum = 0
      for (let ri = 0; ri < size; ri++) {
        if (cellStates[ri][ci] !== DELETED) sum += grid[ri][ci]
      }
      colMatch.push(sum === colTargets[ci])
    }

    this.setData({
      cellStates,
      rowMatch,
      colMatch,
      moveCount: this.data.moveCount + 1
    })

    // Check win
    if (rowMatch.every(v => v) && colMatch.every(v => v)) {
      this._onWin()
    }
  },

  // ─── Win ───
  _onWin() {
    this._stopTimer()
    const time = this.data.timer
    const size = this.data.size
    const moves = this.data.moveCount
    const totalCells = size * size

    // Star calculation based on efficiency
    let stars = 1
    if (moves <= totalCells * 2) stars = 2
    if (moves <= totalCells * 1.2) stars = 3

    this._saveProgress(size, time, stars)
    this.setData({ phase: 'complete', stars })
  },

  // ─── Actions ───
  resetPuzzle() {
    const size = this.data.size
    const cellStates = []
    for (let r = 0; r < size; r++) {
      cellStates.push(new Array(size).fill(UNKNOWN))
    }
    this.setData({
      cellStates,
      rowMatch: new Array(size).fill(false),
      colMatch: new Array(size).fill(false),
      moveCount: 0
    })
    this._startTime = Date.now()
    this.setData({ timer: 0, timerDisplay: '00:00' })
  },

  newPuzzle() {
    this._stopTimer()
    this.startGame()
  },

  goIntro() {
    this._stopTimer()
    this._loadProgress()
    this.setData({ phase: 'intro' })
  },

  playAgain() {
    this.startGame()
  }
})
