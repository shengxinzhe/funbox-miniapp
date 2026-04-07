// bead-art.js — Perler Bead Art Game

// ─── COLOR PALETTES ───
const PALETTES = {
  easy: ['#FF3B30','#FF9F0A','#FFD60A','#34C759','#5856D6','#FFFFFF'],
  medium: ['#FF3B30','#FF9F0A','#FFD60A','#34C759','#007AFF','#5856D6','#AF52DE','#FF375F','#FFFFFF','#1D1D1F'],
  hard: ['#FF3B30','#FF9F0A','#FFD60A','#34C759','#30D158','#007AFF','#5856D6','#AF52DE','#FF375F','#8E8E93','#FFFFFF','#1D1D1F','#A2845E','#F5E6CC','#5B9BD5','#FF6B8A'],
}

// ─── PUZZLE DATA ───
// Each puzzle: { id, name, difficulty, size, data: 2D array of color indices (-1 = empty) }
// Color indices refer to the palette for that difficulty
const PUZZLES = [
  // ── EASY (8x8) ──
  { id:'heart', name:'爱心', difficulty:'easy', size:8, data:[
    [-1,-1, 0, 0,-1, 0, 0,-1],
    [-1, 0, 0, 0, 0, 0, 0,-1],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0, 0, 0, 0, 0, 0,-1],
    [-1,-1, 0, 0, 0, 0,-1,-1],
    [-1,-1,-1, 0, 0,-1,-1,-1],
  ]},
  { id:'star', name:'星星', difficulty:'easy', size:8, data:[
    [-1,-1,-1, 2,-1,-1,-1,-1],
    [-1,-1, 2, 2, 2,-1,-1,-1],
    [ 2, 2, 2, 2, 2, 2, 2,-1],
    [-1, 2, 2, 2, 2, 2,-1,-1],
    [-1, 2, 2, 2, 2, 2,-1,-1],
    [-1, 2, 2,-1, 2, 2,-1,-1],
    [ 2, 2,-1,-1,-1, 2, 2,-1],
    [ 2,-1,-1,-1,-1,-1, 2,-1],
  ]},
  { id:'mushroom', name:'蘑菇', difficulty:'easy', size:8, data:[
    [-1,-1, 0, 0, 0, 0,-1,-1],
    [-1, 0, 0, 5, 5, 0, 0,-1],
    [ 0, 0, 5, 5, 5, 5, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [-1,-1, 5, 5, 5, 5,-1,-1],
    [-1,-1, 5, 5, 5, 5,-1,-1],
    [-1,-1, 5, 5, 5, 5,-1,-1],
    [-1,-1, 5, 5, 5, 5,-1,-1],
  ]},
  { id:'flower', name:'小花', difficulty:'easy', size:8, data:[
    [-1,-1, 2,-1,-1, 2,-1,-1],
    [-1, 2, 2, 2, 2, 2, 2,-1],
    [ 2, 2, 0, 2, 2, 0, 2, 2],
    [-1, 2, 2, 2, 2, 2, 2,-1],
    [-1,-1, 2, 2, 2, 2,-1,-1],
    [-1,-1,-1, 3, 3,-1,-1,-1],
    [-1,-1, 3, 3, 3, 3,-1,-1],
    [-1,-1,-1, 3, 3,-1,-1,-1],
  ]},

  // ── MEDIUM (10x10) ──
  { id:'cat', name:'猫咪', difficulty:'medium', size:10, data:[
    [-1, 9, 9,-1,-1,-1,-1, 9, 9,-1],
    [ 9, 1, 1, 9,-1,-1, 9, 1, 1, 9],
    [ 9, 1, 1, 1, 1, 1, 1, 1, 1, 9],
    [ 9, 1, 4, 1, 1, 1, 1, 4, 1, 9],
    [ 9, 1, 1, 1, 0, 0, 1, 1, 1, 9],
    [-1, 9, 1, 1, 1, 1, 1, 1, 9,-1],
    [-1,-1, 9, 1, 1, 1, 1, 9,-1,-1],
    [-1, 9, 1, 1, 1, 1, 1, 1, 9,-1],
    [-1, 9, 1, 1, 1, 1, 1, 1, 9,-1],
    [-1,-1, 9, 9,-1,-1, 9, 9,-1,-1],
  ]},
  { id:'tree', name:'圣诞树', difficulty:'medium', size:10, data:[
    [-1,-1,-1,-1, 2,-1,-1,-1,-1,-1],
    [-1,-1,-1, 3, 3, 3,-1,-1,-1,-1],
    [-1,-1, 3, 3, 3, 3, 3,-1,-1,-1],
    [-1, 3, 3, 0, 3, 3, 0, 3,-1,-1],
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3,-1],
    [-1,-1, 3, 3, 3, 3, 3,-1,-1,-1],
    [-1, 3, 3, 2, 3, 2, 3, 3,-1,-1],
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3,-1],
    [-1,-1,-1, 1, 1, 1,-1,-1,-1,-1],
    [-1,-1,-1, 1, 1, 1,-1,-1,-1,-1],
  ]},
  { id:'fish', name:'热带鱼', difficulty:'medium', size:10, data:[
    [-1,-1,-1,-1, 4,-1,-1,-1,-1,-1],
    [-1,-1, 4, 4, 4, 4,-1,-1,-1,-1],
    [-1, 4, 0, 0, 2, 2, 4,-1,-1,-1],
    [ 4, 0, 9, 0, 2, 2, 2, 4,-1,-1],
    [ 4, 0, 0, 0, 2, 2, 2, 2, 4, 4],
    [ 4, 0, 0, 0, 2, 2, 2, 2, 4, 4],
    [ 4, 0, 0, 0, 2, 2, 2, 4,-1,-1],
    [-1, 4, 0, 0, 2, 2, 4,-1,-1,-1],
    [-1,-1, 4, 4, 4, 4,-1,-1,-1,-1],
    [-1,-1,-1,-1, 4,-1,-1,-1,-1,-1],
  ]},
  { id:'rocket', name:'火箭', difficulty:'medium', size:10, data:[
    [-1,-1,-1,-1, 0,-1,-1,-1,-1,-1],
    [-1,-1,-1, 0, 8, 0,-1,-1,-1,-1],
    [-1,-1,-1, 8, 8, 8,-1,-1,-1,-1],
    [-1,-1, 8, 8, 4, 8, 8,-1,-1,-1],
    [-1,-1, 8, 8, 4, 8, 8,-1,-1,-1],
    [-1, 0, 8, 8, 8, 8, 8, 0,-1,-1],
    [ 0, 0, 8, 8, 8, 8, 8, 0, 0,-1],
    [-1,-1,-1, 1, 0, 1,-1,-1,-1,-1],
    [-1,-1, 1, 2, 0, 2, 1,-1,-1,-1],
    [-1,-1,-1, 1,-1, 1,-1,-1,-1,-1],
  ]},

  // ── HARD (12x12) ──
  { id:'panda', name:'熊猫', difficulty:'hard', size:12, data:[
    [-1,-1, 11,11,-1,-1,-1,-1, 11,11,-1,-1],
    [-1, 11,11,11, 11,-1,-1,11, 11,11, 11,-1],
    [ 11,11,11,11,10,10,10,10,11,11,11, 11],
    [ 11,11,10,10,10,10,10,10,10,10,11, 11],
    [-1,10,10,11,11,10,10,11,11,10,10,-1],
    [-1,10,10,11,10,10,10,10,11,10,10,-1],
    [-1,10,10,10,10,11,11,10,10,10,10,-1],
    [-1,-1,10,10,10,10,10,10,10,10,-1,-1],
    [-1,-1,-1,10,10,10,10,10,10,-1,-1,-1],
    [-1,-1,11,11,10,10,10,10,11,11,-1,-1],
    [-1,11,11,11,11,11,11,11,11,11,11,-1],
    [-1,-1,11,11,-1,-1,-1,-1,11,11,-1,-1],
  ]},
  { id:'castle', name:'城堡', difficulty:'hard', size:12, data:[
    [-1, 8,-1,-1,-1, 8, 8,-1,-1,-1, 8,-1],
    [-1, 8,-1,-1,-1, 8, 8,-1,-1,-1, 8,-1],
    [ 8, 8, 8,-1, 8, 8, 8, 8,-1, 8, 8, 8],
    [ 8, 8, 8,-1, 8, 8, 8, 8,-1, 8, 8, 8],
    [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [ 8, 8, 14,14, 8, 8, 8, 8, 14,14, 8, 8],
    [ 8, 8, 14,14, 8, 8, 8, 8, 14,14, 8, 8],
    [ 8, 8, 8, 8, 8, 12, 12, 8, 8, 8, 8, 8],
    [ 8, 8, 8, 8, 8, 12, 12, 8, 8, 8, 8, 8],
    [ 8, 8, 8, 8, 8, 12, 12, 8, 8, 8, 8, 8],
    [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  ]},
  { id:'rainbow', name:'彩虹', difficulty:'hard', size:12, data:[
    [-1,-1,-1, 0, 0, 0, 0, 0, 0,-1,-1,-1],
    [-1,-1, 0, 0, 1, 1, 1, 1, 0, 0,-1,-1],
    [-1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0,-1],
    [ 0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0],
    [ 0, 1, 2, 3, 5, 5, 5, 5, 3, 2, 1, 0],
    [ 0, 1, 2, 3, 5,10, 10, 5, 3, 2, 1, 0],
    [ 0, 1, 2, 3, 5,10,-1,10, 5, 3, 2, 1],
    [ 0,-1, 2, 3, 5,-1,-1,-1, 5, 3,-1, 0],
    [ 0,-1,-1, 3,-1,-1,-1,-1,-1, 3,-1, 0],
    [ 0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  ]},
]

// ─── PAGE ───
Page({
  data: {
    phase: 'intro',      // intro | levelSelect | playing | result
    mode: 'puzzle',      // puzzle | free
    difficulty: 'easy',
    completedCount: 0,
    bestScore: 0,
    filteredLevels: [],
    gridSize: 8,
    palette: PALETTES.easy,
    selectedColor: 0,
    tool: 'paint',       // paint | erase | fill
    placedCount: 0,
    totalCells: 0,
    showRef: true,
    score: 0,
    showIronAnim: false,
  },

  // non-reactive
  _canvas: null,
  _ctx: null,
  _dpr: 2,
  _canvasW: 0,
  _canvasH: 0,
  _rect: null,
  _grid: [],          // 2D: colorIndex or -1
  _target: null,      // puzzle target data
  _currentPuzzle: null,
  _history: [],       // undo stack [{row, col, prevColor}]
  _scores: {},        // puzzleId -> best score
  _lastDrawnCell: null,

  onLoad() {
    this._loadProgress()
  },

  onReady() {
    if (this.data.phase === 'intro') {
      wx.nextTick(() => this._drawIntroPreview())
    }
  },

  // ─── PERSISTENCE ───
  _loadProgress() {
    let d = {}
    try { d = wx.getStorageSync('beadart_data') || {} } catch(e) {}
    this._scores = d.scores || {}
    const completedCount = Object.keys(this._scores).length
    const bestScore = Object.values(this._scores).reduce((m, v) => Math.max(m, v), 0)
    this.setData({ completedCount, bestScore })
  },

  _saveProgress() {
    try {
      wx.setStorageSync('beadart_data', { scores: this._scores })
    } catch(e) {}
  },

  // ─── INTRO ───
  _drawIntroPreview() {
    const query = wx.createSelectorQuery()
    query.select('#intro-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width, h = res[0].height
      const dpr = this._getDpr()
      canvas.width = w * dpr; canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      // Draw a mini bead heart
      ctx.fillStyle = '#F2F2F7'
      ctx.fillRect(0, 0, w, h)
      const heart = PUZZLES[0]
      const pal = PALETTES.easy
      const cellSize = w / (heart.size + 2)
      const ox = cellSize, oy = cellSize
      for (let r = 0; r < heart.size; r++) {
        for (let c = 0; c < heart.size; c++) {
          const ci = heart.data[r][c]
          if (ci < 0) continue
          this._drawBead(ctx, ox + c * cellSize + cellSize/2, oy + r * cellSize + cellSize/2, cellSize * 0.42, pal[ci])
        }
      }
    })
  },

  // ─── NAVIGATION ───
  goIntro() {
    this.setData({ phase: 'intro' })
    this._loadProgress()
    wx.nextTick(() => this._drawIntroPreview())
  },

  enterPuzzle() {
    this.setData({ phase: 'levelSelect', mode: 'puzzle', difficulty: 'easy' })
    this._filterLevels('easy')
    wx.nextTick(() => this._drawLevelPreviews())
  },

  enterFree() {
    this._startFreeMode(10)
  },

  setDifficulty(e) {
    const d = e.currentTarget.dataset.d
    this.setData({ difficulty: d })
    this._filterLevels(d)
    wx.nextTick(() => this._drawLevelPreviews())
  },

  _filterLevels(difficulty) {
    const levels = PUZZLES.filter(p => p.difficulty === difficulty).map(p => ({
      ...p,
      score: this._scores[p.id] || 0,
    }))
    this.setData({ filteredLevels: levels })
  },

  selectLevel(e) {
    const id = e.currentTarget.dataset.id
    const puzzle = PUZZLES.find(p => p.id === id)
    if (!puzzle) return
    this._startPuzzle(puzzle)
  },

  // ─── START GAME ───
  _startPuzzle(puzzle) {
    this._currentPuzzle = puzzle
    this._target = puzzle.data
    const size = puzzle.size
    this._grid = Array.from({ length: size }, () => Array(size).fill(-1))
    this._history = []
    const pal = PALETTES[puzzle.difficulty]
    const totalCells = puzzle.data.flat().filter(c => c >= 0).length

    this.setData({
      phase: 'playing',
      mode: 'puzzle',
      gridSize: size,
      palette: pal,
      selectedColor: 0,
      tool: 'paint',
      placedCount: 0,
      totalCells,
      showRef: true,
    })
    wx.nextTick(() => {
      this._initBoardCanvas()
      this._drawRefCanvas()
    })
  },

  _startFreeMode(size) {
    this._currentPuzzle = null
    this._target = null
    this._grid = Array.from({ length: size }, () => Array(size).fill(-1))
    this._history = []

    this.setData({
      phase: 'playing',
      mode: 'free',
      gridSize: size,
      palette: PALETTES.hard,
      selectedColor: 0,
      tool: 'paint',
      placedCount: 0,
      totalCells: size * size,
    })
    wx.nextTick(() => this._initBoardCanvas())
  },

  // ─── CANVAS ───
  _getDpr() {
    return wx.getWindowInfo
      ? (wx.getWindowInfo().pixelRatio || 2)
      : (wx.getSystemInfoSync().pixelRatio || 2)
  },

  _initBoardCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#board-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width, h = res[0].height
      const dpr = this._getDpr()
      canvas.width = w * dpr; canvas.height = h * dpr
      this._canvas = canvas
      this._ctx = canvas.getContext('2d')
      this._dpr = dpr
      this._canvasW = w
      this._canvasH = h

      wx.createSelectorQuery().select('#board-canvas').boundingClientRect(rect => {
        if (rect) this._rect = rect
      }).exec()

      this._drawBoard()
    })
  },

  _drawRefCanvas() {
    if (!this._target || !this._currentPuzzle) return
    const query = wx.createSelectorQuery()
    query.select('#ref-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width, h = res[0].height
      const dpr = this._getDpr()
      canvas.width = w * dpr; canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const size = this._currentPuzzle.size
      const pal = PALETTES[this._currentPuzzle.difficulty]
      const cellSize = w / size

      ctx.fillStyle = '#F2F2F7'
      ctx.fillRect(0, 0, w, h)

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const ci = this._target[r][c]
          if (ci < 0) continue
          this._drawBead(ctx, c * cellSize + cellSize/2, r * cellSize + cellSize/2, cellSize * 0.42, pal[ci])
        }
      }
    })
  },

  _drawBoard() {
    const ctx = this._ctx
    if (!ctx) return
    const w = this._canvasW, h = this._canvasH
    const dpr = this._dpr
    const size = this.data.gridSize

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    // Board background
    ctx.fillStyle = '#F2F2F7'
    ctx.fillRect(0, 0, w, h)

    const pad = 4
    const cellSize = (w - pad * 2) / size

    // Grid pegs (background dots)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cx = pad + c * cellSize + cellSize / 2
        const cy = pad + r * cellSize + cellSize / 2
        const beadR = cellSize * 0.42

        if (this._grid[r][c] >= 0) {
          // Filled bead
          const color = this.data.palette[this._grid[r][c]]
          this._drawBead(ctx, cx, cy, beadR, color)
        } else {
          // Empty peg
          ctx.fillStyle = '#D1D1D6'
          ctx.beginPath()
          ctx.arc(cx, cy, cellSize * 0.08, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(0,0,0,0.04)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= size; i++) {
      const x = pad + i * cellSize
      ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + size * cellSize); ctx.stroke()
      const y = pad + i * cellSize
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + size * cellSize, y); ctx.stroke()
    }

    ctx.restore()
  },

  _drawBead(ctx, cx, cy, r, color) {
    // Main circle
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // Inner highlight (glossy effect)
    ctx.beginPath()
    ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fill()

    // Center hole
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.15, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fill()

    // Border
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  },

  // ─── TOUCH ───
  onBoardTouch(e) {
    this._lastDrawnCell = null
    this._handleBoardInteraction(e.touches[0])
  },

  onBoardMove(e) {
    if (this.data.tool === 'fill') return
    this._handleBoardInteraction(e.touches[0])
  },

  onBoardTouchEnd() {
    this._lastDrawnCell = null
  },

  _handleBoardInteraction(touch) {
    const rect = this._rect
    if (!rect) return

    const w = this._canvasW
    const size = this.data.gridSize
    const pad = 4
    const cellSize = (w - pad * 2) / size

    const lx = ((touch.clientX - rect.left) / rect.width) * w
    const ly = ((touch.clientY - rect.top) / rect.height) * this._canvasH

    const col = Math.floor((lx - pad) / cellSize)
    const row = Math.floor((ly - pad) / cellSize)

    if (row < 0 || row >= size || col < 0 || col >= size) return

    // Avoid redrawing the same cell during drag
    const key = row + ',' + col
    if (this._lastDrawnCell === key && this.data.tool !== 'fill') return
    this._lastDrawnCell = key

    const tool = this.data.tool
    if (tool === 'paint') {
      const prev = this._grid[row][col]
      const newColor = this.data.selectedColor
      if (prev === newColor) return
      this._history.push({ row, col, prev })
      this._grid[row][col] = newColor
    } else if (tool === 'erase') {
      const prev = this._grid[row][col]
      if (prev < 0) return
      this._history.push({ row, col, prev })
      this._grid[row][col] = -1
    } else if (tool === 'fill') {
      this._floodFill(row, col, this.data.selectedColor)
    }

    this._updatePlacedCount()
    this._drawBoard()
  },

  _floodFill(startRow, startCol, newColor) {
    const size = this.data.gridSize
    const targetColor = this._grid[startRow][startCol]
    if (targetColor === newColor) return

    const stack = [[startRow, startCol]]
    const visited = new Set()

    while (stack.length > 0) {
      const [r, c] = stack.pop()
      const key = r + ',' + c
      if (visited.has(key)) continue
      if (r < 0 || r >= size || c < 0 || c >= size) continue
      if (this._grid[r][c] !== targetColor) continue

      visited.add(key)
      this._history.push({ row: r, col: c, prev: targetColor })
      this._grid[r][c] = newColor

      stack.push([r-1, c], [r+1, c], [r, c-1], [r, c+1])
    }
  },

  _updatePlacedCount() {
    const count = this._grid.flat().filter(c => c >= 0).length
    this.setData({ placedCount: count })
  },

  // ─── TOOLS ───
  pickColor(e) {
    const idx = Number(e.currentTarget.dataset.idx)
    this.setData({ selectedColor: idx, tool: 'paint' })
  },

  setTool(e) {
    this.setData({ tool: e.currentTarget.dataset.t })
  },

  undoLast() {
    if (this._history.length === 0) return
    const last = this._history.pop()
    this._grid[last.row][last.col] = last.prev
    this._updatePlacedCount()
    this._drawBoard()
  },

  clearBoard() {
    const size = this.data.gridSize
    // Save all current state for potential undo
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this._grid[r][c] >= 0) {
          this._history.push({ row: r, col: c, prev: this._grid[r][c] })
        }
      }
    }
    this._grid = Array.from({ length: size }, () => Array(size).fill(-1))
    this._updatePlacedCount()
    this._drawBoard()
  },

  toggleRef() {
    const show = !this.data.showRef
    this.setData({ showRef: show })
    if (show) {
      wx.nextTick(() => this._drawRefCanvas())
    }
    // Refresh cached rect since toggling ref shifts board position
    wx.nextTick(() => {
      wx.createSelectorQuery().select('#board-canvas').boundingClientRect(rect => {
        if (rect) this._rect = rect
      }).exec()
    })
  },

  // ─── FINISH ───
  finishWork() {
    // Iron animation
    this.setData({ showIronAnim: true })

    setTimeout(() => {
      this.setData({ showIronAnim: false })

      if (this.data.mode === 'puzzle') {
        const score = this._calcScore()
        const pid = this._currentPuzzle.id
        this._scores[pid] = Math.max(this._scores[pid] || 0, score)
        this._saveProgress()
        this.setData({ phase: 'result', score })
      } else {
        this.setData({ phase: 'result', score: 0 })
      }

      wx.nextTick(() => this._drawResultCanvas())
    }, 1500)
  },

  _calcScore() {
    if (!this._target) return 0
    const size = this.data.gridSize
    let correct = 0, total = 0

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this._target[r][c] >= 0) {
          total++
          if (this._grid[r][c] === this._target[r][c]) correct++
        }
      }
    }
    return total > 0 ? Math.round((correct / total) * 100) : 0
  },

  _drawResultCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#result-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width, h = res[0].height
      const dpr = this._getDpr()
      canvas.width = w * dpr; canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const size = this.data.gridSize
      const pal = this.data.palette
      const cellSize = w / size

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, w, h)

      // Draw ironed beads (slightly blurred, fused look)
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const ci = this._grid[r][c]
          if (ci < 0) continue
          const cx = c * cellSize + cellSize / 2
          const cy = r * cellSize + cellSize / 2
          const br = cellSize * 0.48 // slightly bigger = fused

          // Fused bead (flatter, less glossy)
          ctx.beginPath()
          ctx.arc(cx, cy, br, 0, Math.PI * 2)
          ctx.fillStyle = pal[ci]
          ctx.fill()

          // Subtle highlight
          ctx.beginPath()
          ctx.arc(cx - br * 0.15, cy - br * 0.15, br * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.25)'
          ctx.fill()

          // Center hole (smaller after ironing)
          ctx.beginPath()
          ctx.arc(cx, cy, br * 0.08, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0,0,0,0.06)'
          ctx.fill()
        }
      }
    })
  },

  confirmExit() {
    wx.showModal({
      title: '退出确认',
      content: '当前作品未保存，确定退出吗？',
      success: (res) => {
        if (res.confirm) this.goIntro()
      }
    })
  },

  retryOrNext() {
    if (this.data.score >= 95 && this._currentPuzzle) {
      // Find next puzzle
      const idx = PUZZLES.indexOf(this._currentPuzzle)
      if (idx < PUZZLES.length - 1) {
        this._startPuzzle(PUZZLES[idx + 1])
      } else {
        this.goIntro()
      }
    } else if (this._currentPuzzle) {
      this._startPuzzle(this._currentPuzzle)
    }
  },

  // ─── LEVEL PREVIEWS ───
  _drawLevelPreviews() {
    const levels = this.data.filteredLevels
    levels.forEach(level => {
      const query = wx.createSelectorQuery()
      query.select('#preview-' + level.id).fields({ node: true, size: true }).exec(res => {
        if (!res || !res[0]) return
        const canvas = res[0].node
        const w = res[0].width, h = res[0].height
        const dpr = this._getDpr()
        canvas.width = w * dpr; canvas.height = h * dpr
        const ctx = canvas.getContext('2d')
        ctx.scale(dpr, dpr)

        const pal = PALETTES[level.difficulty]
        const cellSize = Math.min(w, h) / level.size

        ctx.fillStyle = '#F2F2F7'
        ctx.fillRect(0, 0, w, h)

        const ox = (w - level.size * cellSize) / 2
        const oy = (h - level.size * cellSize) / 2

        for (let r = 0; r < level.size; r++) {
          for (let c = 0; c < level.size; c++) {
            const ci = level.data[r][c]
            if (ci < 0) continue
            this._drawBead(ctx, ox + c * cellSize + cellSize/2, oy + r * cellSize + cellSize/2, cellSize * 0.4, pal[ci])
          }
        }
      })
    })
  },

  onShareAppMessage() {
    return {
      title: '拼豆大师 - 像素拼豆创作',
      path: '/pages/bead-art/bead-art',
    }
  },
})
