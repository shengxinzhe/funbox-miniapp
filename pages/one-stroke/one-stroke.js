// one-stroke.js
// Euler-path puzzle game "一笔画完"

// ─────────────────────────────────────────────
// LEVEL DATA  (nodes: [x,y] in 0-300 space, edges: [a,b])
// Every level verified to have 0 or 2 odd-degree nodes (valid Euler path/circuit).
// ─────────────────────────────────────────────
const LEVELS = [
  // L1 Triangle – Euler circuit (all deg 2)
  { nodes:[[150,60],[60,240],[240,240]], edges:[[0,1],[1,2],[2,0]] },
  // L2 Square + diagonal – 2 odd nodes
  { nodes:[[60,60],[240,60],[240,240],[60,240]], edges:[[0,1],[1,2],[2,3],[3,0],[0,2]] },
  // L3 House – 2 odd nodes
  { nodes:[[60,180],[240,180],[240,60],[60,60],[150,0]], edges:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,2]] },
  // L4 Envelope – Euler circuit
  { nodes:[[30,90],[270,90],[270,210],[30,210],[150,150]], edges:[[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]] },
  // L5 Bowtie – 2 odd nodes
  { nodes:[[30,150],[120,60],[120,240],[180,60],[180,240],[270,150]], edges:[[0,1],[0,2],[1,2],[3,4],[3,5],[4,5]] },
  // L6 Double pentagon (outer+inner) – Euler circuit (each node deg 4)
  {
    nodes:[[150,20],[272,111],[225,255],[75,255],[28,111],[150,70],[220,150],[185,230],[115,230],[80,150]],
    edges:[[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,6],[6,7],[7,8],[8,9],[9,5]]
  },
  // L7 3×3 grid – 2 odd nodes
  {
    nodes:[[60,60],[150,60],[240,60],[60,150],[150,150],[240,150],[60,240],[150,240],[240,240]],
    edges:[[0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[0,3],[3,6],[1,4],[4,7],[2,5],[5,8]]
  },
  // L8 Hexagon + alternate spokes + cross-chords – Euler circuit (all deg 4)
  {
    nodes:[[150,30],[255,90],[255,210],[150,270],[45,210],[45,90],[150,150]],
    edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[2,6],[4,6],[1,4],[3,0],[5,2]]
  },
  // L9 Diamond lattice – 2 odd nodes
  {
    nodes:[[150,20],[80,90],[220,90],[20,160],[150,160],[280,160],[80,230],[220,230],[150,300]],
    edges:[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7],[6,8],[7,8]]
  },
  // L10 Pentagon + center spokes – Euler circuit (center deg 5? No, outer deg 3 = odd)
  // Fix: pentagon(5) + spokes(5) → outer deg 3 (odd), center deg 5 (odd) = 6 odd. Invalid.
  // Use: outer pentagon(5) + skip-1 chords(5) → all deg 4. Euler circuit!
  {
    nodes:[[150,20],[272,111],[225,255],[75,255],[28,111],[150,140],[220,75],[248,200],[100,230],[52,130]],
    edges:[[0,1],[1,2],[2,3],[3,4],[4,0],[0,6],[1,7],[2,8],[3,9],[4,5],[5,6],[6,2],[7,3],[8,4],[9,0]]
  },
  // L11 Wide grid (4×2) – 2 odd nodes
  {
    nodes:[[40,90],[130,90],[220,90],[300,90],[40,210],[130,210],[220,210],[300,210]],
    edges:[[0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[0,4],[1,5],[2,6],[3,7],[1,6],[2,5]]
  },
  // L12 Octagon + 4 cross-diagonals – Euler circuit (all deg 4)
  {
    nodes:[[150,20],[229,50],[270,130],[250,210],[170,260],[80,250],[30,170],[40,80]],
    edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,4],[1,5],[2,6],[3,7]]
  },
  // L13 Ladder with diagonals – 2 odd nodes
  {
    nodes:[[40,80],[160,80],[280,80],[40,160],[160,160],[280,160],[40,240],[280,240]],
    edges:[[0,1],[1,2],[3,4],[4,5],[6,7],[0,3],[3,6],[1,4],[2,5],[5,7],[0,4],[4,7]]
  },
  // L14 Nested squares + connectors – Euler circuit (all deg 4)
  {
    nodes:[[40,40],[260,40],[260,260],[40,260],[100,100],[200,100],[200,200],[100,200]],
    edges:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
  },
  // L15 Double pentagon (outer+inner) + cross spokes – Euler circuit
  {
    nodes:[[150,20],[260,100],[220,230],[80,230],[40,100],[150,80],[220,150],[185,210],[115,210],[80,150]],
    edges:[[0,1],[1,2],[2,3],[3,4],[4,0],[5,6],[6,7],[7,8],[8,9],[9,5],[0,5],[1,6],[2,7],[3,8],[4,9]]
  }
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function dist(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)
}

function edgeKey(a, b) {
  return `${Math.min(a,b)}_${Math.max(a,b)}`
}

function computeOptimalTaps(nodes, edges) {
  // Count odd-degree nodes; optimal = edges + 1 (one start tap) if Euler circuit,
  // or edges + 1 if Euler path (start is free)
  return edges.length + 1
}

// ─────────────────────────────────────────────
Page({
  data: {
    phase: 'intro',      // intro | playing | complete | allComplete
    currentLevel: 0,
    levelMeta: [],       // {unlocked, stars} for each level
    visitedEdges: 0,
    totalEdges: 0,
    gameStarted: false,
    tapCount: 0,
    shaking: false,
    earnedStars: 0,
    starAnim: 0,
    totalStars: 0
  },

  // ── canvas & game state (not reactive)
  _canvas: null,
  _ctx: null,
  _canvasSize: 300,  // logical px matching coordinate space
  _ratio: 1,         // physical px per logical px
  _canvasRect: null,  // cached bounding rect {left, top, width, height}
  _level: null,      // current level definition
  _edgeState: [],    // false = unvisited, true = visited
  _currentNode: -1,
  _pulseAnim: null,
  _shimmerAnim: null,

  // ─────────────────────────────────────────────
  onLoad() {
    this._loadProgress()
  },

  onShow() {
    if (this.data.phase === 'playing') {
      this._drawLevel()
    }
  },

  // ─────────────────────────────────────────────
  _loadProgress() {
    let saved = {}
    try { saved = wx.getStorageSync('onestroke_progress') || {} } catch(e) {}
    const maxUnlocked = saved.maxUnlocked || 0
    const starsArr = saved.stars || Array(15).fill(0)
    const levelMeta = LEVELS.map((_, i) => ({
      unlocked: i <= maxUnlocked,
      stars: starsArr[i] || 0
    }))
    const totalStars = starsArr.reduce((s, v) => s + v, 0)
    const currentLevel = Math.min(maxUnlocked, 14)
    this.setData({ levelMeta, totalStars, currentLevel })
    this._savedStars = starsArr
    this._maxUnlocked = maxUnlocked
  },

  _saveProgress(levelIdx, stars) {
    const starsArr = this._savedStars || Array(15).fill(0)
    starsArr[levelIdx] = Math.max(starsArr[levelIdx] || 0, stars)
    const maxUnlocked = Math.max(this._maxUnlocked || 0, Math.min(levelIdx + 1, 14))
    this._savedStars = starsArr
    this._maxUnlocked = maxUnlocked
    const totalStars = starsArr.reduce((s, v) => s + v, 0)
    try {
      wx.setStorageSync('onestroke_progress', { maxUnlocked, stars: starsArr })
    } catch(e) {}
    // rebuild levelMeta
    const levelMeta = LEVELS.map((_, i) => ({
      unlocked: i <= maxUnlocked,
      stars: starsArr[i] || 0
    }))
    this.setData({ levelMeta, totalStars })
  },

  // ─────────────────────────────────────────────
  // INTRO actions
  // ─────────────────────────────────────────────
  selectLevel(e) {
    const idx = Number(e.currentTarget.dataset.index)
    const meta = this.data.levelMeta[idx]
    if (!meta.unlocked) return
    this.setData({ currentLevel: idx })
  },

  startLevel() {
    this._initLevel(this.data.currentLevel)
  },

  goIntro() {
    this._stopAnimations()
    this.setData({ phase: 'intro' })
    this._loadProgress()
  },

  // ─────────────────────────────────────────────
  // GAME setup
  // ─────────────────────────────────────────────
  _initLevel(idx) {
    this._stopAnimations()
    const level = LEVELS[idx]
    this._level = level
    this._edgeState = level.edges.map(() => false)
    this._currentNode = -1

    this.setData({
      phase: 'playing',
      currentLevel: idx,
      visitedEdges: 0,
      totalEdges: level.edges.length,
      gameStarted: false,
      tapCount: 0,
      shaking: false,
      earnedStars: 0,
      starAnim: 0
    })

    // init canvas after render
    wx.nextTick(() => this._initCanvas())
  },

  _initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#stroke-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width
      const h = res[0].height
      const ratio = wx.getWindowInfo
        ? (wx.getWindowInfo().pixelRatio || 2)
        : (wx.getSystemInfoSync().pixelRatio || 2)
      canvas.width = w * ratio
      canvas.height = h * ratio
      this._canvas = canvas
      this._ctx = canvas.getContext('2d')
      this._ratio = ratio * (w / 300)  // map 300 logical units to canvas px
      // Cache bounding rect for tap coordinate conversion
      wx.createSelectorQuery().select('#stroke-canvas').boundingClientRect(rect => {
        if (rect) this._canvasRect = rect
      }).exec()
      this._drawLevel()
      this._startPulse()
    })
  },

  // ─────────────────────────────────────────────
  // DRAWING
  // ─────────────────────────────────────────────
  _s(v) { return v * this._ratio },  // scale logical->canvas px

  _drawLevel() {
    const ctx = this._ctx
    if (!ctx) return
    const canvas = this._canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this._drawEdges()
    this._drawNodes()
  },

  _drawEdges() {
    const { nodes, edges } = this._level
    const ctx = this._ctx

    edges.forEach((e, i) => {
      const a = nodes[e[0]], b = nodes[e[1]]
      ctx.beginPath()
      ctx.moveTo(this._s(a[0]), this._s(a[1]))
      ctx.lineTo(this._s(b[0]), this._s(b[1]))
      ctx.lineWidth = this._s(4)
      ctx.lineCap = 'round'

      if (this._edgeState[i]) {
        ctx.strokeStyle = '#5856D6'
        ctx.shadowColor = 'rgba(88,86,214,0.4)'
        ctx.shadowBlur = this._s(6)
      } else {
        ctx.strokeStyle = '#D1D1D6'
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    })
  },

  _drawNodes() {
    const { nodes, edges } = this._level
    const ctx = this._ctx
    const cur = this._currentNode

    // Determine available nodes (adjacent to current via unvisited edge)
    const available = new Set()
    if (cur >= 0) {
      edges.forEach((e, i) => {
        if (!this._edgeState[i]) {
          if (e[0] === cur) available.add(e[1])
          if (e[1] === cur) available.add(e[0])
        }
      })
    }

    nodes.forEach((n, i) => {
      const x = this._s(n[0]), y = this._s(n[1])
      const r = this._s(i === cur ? 16 : 12)

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)

      if (i === cur) {
        ctx.fillStyle = '#5856D6'
        ctx.shadowColor = 'rgba(88,86,214,0.5)'
        ctx.shadowBlur = this._s(14)
      } else if (available.has(i)) {
        ctx.fillStyle = '#AF52DE'
        ctx.shadowColor = 'rgba(175,82,222,0.35)'
        ctx.shadowBlur = this._s(8)
      } else if (this._isNodeVisited(i)) {
        ctx.fillStyle = '#5856D6'
        ctx.shadowBlur = 0
      } else {
        ctx.fillStyle = '#E5E5EA'
        ctx.shadowBlur = 0
      }

      ctx.fill()
      ctx.shadowBlur = 0

      // stroke
      ctx.strokeStyle = i === cur ? '#3634A3' : (available.has(i) ? '#8944AB' : '#C7C7CC')
      ctx.lineWidth = this._s(2)
      ctx.stroke()
    })
  },

  _isNodeVisited(nodeIdx) {
    // A node is "visited" if any of its edges have been traversed
    const { edges } = this._level
    return edges.some((e, i) => this._edgeState[i] && (e[0] === nodeIdx || e[1] === nodeIdx))
  },

  _startPulse() {
    let tick = 0
    this._pulseAnim = setInterval(() => {
      if (this._currentNode < 0) return
      tick++
      // redraw to animate glow (via alternating shadow intensity)
      this._drawLevel()
    }, 600)
  },

  _stopAnimations() {
    if (this._pulseAnim) { clearInterval(this._pulseAnim); this._pulseAnim = null }
    if (this._shimmerAnim) { clearTimeout(this._shimmerAnim); this._shimmerAnim = null }
  },

  // ─────────────────────────────────────────────
  // TOUCH / TAP
  // ─────────────────────────────────────────────
  onCanvasTap(e) {
    if (this.data.phase !== 'playing') return

    // e.detail.x/y are page-level coordinates in WeChat
    const tapX = e.detail.x
    const tapY = e.detail.y

    const rect = this._canvasRect
    if (!rect) {
      // Fallback: try to get rect now
      wx.createSelectorQuery().select('#stroke-canvas').boundingClientRect(r => {
        if (r) {
          this._canvasRect = r
          const lx = ((tapX - r.left) / r.width) * 300
          const ly = ((tapY - r.top) / r.height) * 300
          this._handleTap(lx, ly)
        }
      }).exec()
      return
    }

    // Convert page coords to element-relative, then map to 0-300 logical space
    const lx = ((tapX - rect.left) / rect.width) * 300
    const ly = ((tapY - rect.top) / rect.height) * 300

    this._handleTap(lx, ly)
  },

  _handleTap(lx, ly) {
    const { nodes } = this._level
    const TAP_RADIUS = 30

    // Find nearest node within tap radius
    let nearestIdx = -1
    let nearestDist = Infinity
    nodes.forEach((n, i) => {
      const d = dist([lx, ly], n)
      if (d < TAP_RADIUS && d < nearestDist) {
        nearestDist = d
        nearestIdx = i
      }
    })

    if (nearestIdx < 0) return  // tapped empty space

    const cur = this._currentNode

    if (cur < 0) {
      // First tap: set starting node
      this._currentNode = nearestIdx
      this.setData({ gameStarted: true, tapCount: this.data.tapCount + 1 })
      this._drawLevel()
      return
    }

    if (nearestIdx === cur) {
      // Tapped same node, ignore
      return
    }

    // Check if there's an unvisited edge between cur and nearestIdx
    const edgeIdx = this._findUnvisitedEdge(cur, nearestIdx)
    if (edgeIdx < 0) {
      // Invalid move
      this._shakeCanvas()
      return
    }

    // Valid move
    this._edgeState[edgeIdx] = true
    this._currentNode = nearestIdx
    const visited = this._edgeState.filter(Boolean).length
    this.setData({
      visitedEdges: visited,
      tapCount: this.data.tapCount + 1
    })
    this._drawLevel()

    // Check win
    if (visited === this._level.edges.length) {
      this._onLevelComplete()
    }
  },

  _findUnvisitedEdge(a, b) {
    const { edges } = this._level
    for (let i = 0; i < edges.length; i++) {
      if (!this._edgeState[i]) {
        if ((edges[i][0] === a && edges[i][1] === b) ||
            (edges[i][0] === b && edges[i][1] === a)) {
          return i
        }
      }
    }
    return -1
  },

  _shakeCanvas() {
    this.setData({ shaking: true })
    setTimeout(() => this.setData({ shaking: false }), 400)
  },

  // ─────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────
  resetLevel() {
    this._initLevel(this.data.currentLevel)
  },

  // ─────────────────────────────────────────────
  // LEVEL COMPLETE
  // ─────────────────────────────────────────────
  _onLevelComplete() {
    this._stopAnimations()
    this._shimmerAllEdges()

    const tapCount = this.data.tapCount
    const optimal = computeOptimalTaps(this._level.nodes, this._level.edges)
    let stars = 1
    if (tapCount <= optimal + 4) stars = 2
    if (tapCount <= optimal) stars = 3

    const idx = this.data.currentLevel
    this._saveProgress(idx, stars)

    setTimeout(() => {
      this.setData({ phase: 'complete', earnedStars: stars, starAnim: 0 })
      // Animate stars appearing one by one
      setTimeout(() => this.setData({ starAnim: 1 }), 200)
      setTimeout(() => this.setData({ starAnim: 2 }), 500)
      setTimeout(() => this.setData({ starAnim: 3 }), 800)
    }, 700)
  },

  _shimmerAllEdges() {
    const colors = ['#5856D6','#AF52DE','#FF375F','#FF9F0A','#34C759','#5856D6']
    let ci = 0
    const ctx = this._ctx
    if (!ctx) return
    const flash = () => {
      const { nodes, edges } = this._level
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, this._canvas.width, this._canvas.height)

      edges.forEach(e => {
        const a = nodes[e[0]], b = nodes[e[1]]
        ctx.beginPath()
        ctx.moveTo(this._s(a[0]), this._s(a[1]))
        ctx.lineTo(this._s(b[0]), this._s(b[1]))
        ctx.strokeStyle = colors[ci % colors.length]
        ctx.lineWidth = this._s(5)
        ctx.lineCap = 'round'
        ctx.stroke()
      })
      ci++
    }
    for (let i = 0; i < 5; i++) {
      this._shimmerAnim = setTimeout(flash, i * 120)
    }
  },

  // ─────────────────────────────────────────────
  // COMPLETE screen actions
  // ─────────────────────────────────────────────
  nextLevel() {
    const next = this.data.currentLevel + 1
    if (next >= LEVELS.length) {
      const totalStars = (this._savedStars || []).reduce((s, v) => s + v, 0)
      this.setData({ phase: 'allComplete', totalStars })
    } else {
      this._initLevel(next)
    }
  }
})
