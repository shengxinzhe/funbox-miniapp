// cat-fishing.js — Pixel-art Cat Fishing Game

// ─── FISH DATA (20 fish, 4 rarities) ───
const FISH = [
  // Common (6)
  { id:'crucian',  name:'小鲫鱼', emoji:'🐟', rarity:'common',    rarityName:'普通', coins:5,  weight:[0.2,1.5] },
  { id:'goldfish', name:'金鱼',   emoji:'🐠', rarity:'common',    rarityName:'普通', coins:5,  weight:[0.1,0.8] },
  { id:'clown',    name:'小丑鱼', emoji:'🤡', rarity:'common',    rarityName:'普通', coins:6,  weight:[0.1,0.6] },
  { id:'bluefin',  name:'蓝鳍鱼', emoji:'🐟', rarity:'common',    rarityName:'普通', coins:5,  weight:[0.3,2.0] },
  { id:'bass',     name:'鲈鱼',   emoji:'🐟', rarity:'common',    rarityName:'普通', coins:7,  weight:[0.5,3.0] },
  { id:'loach',    name:'泥鳅',   emoji:'🐍', rarity:'common',    rarityName:'普通', coins:4,  weight:[0.05,0.3]},
  // Uncommon (5)
  { id:'koi',      name:'锦鲤',   emoji:'🎏', rarity:'uncommon',  rarityName:'稀有', coins:15, weight:[1.0,5.0] },
  { id:'puffer',   name:'河豚',   emoji:'🐡', rarity:'uncommon',  rarityName:'稀有', coins:18, weight:[0.5,3.0] },
  { id:'tropical', name:'热带鱼', emoji:'🐠', rarity:'uncommon',  rarityName:'稀有', coins:15, weight:[0.1,1.0] },
  { id:'flying',   name:'飞鱼',   emoji:'🦅', rarity:'uncommon',  rarityName:'稀有', coins:20, weight:[0.3,2.0] },
  { id:'seahorse', name:'海马',   emoji:'🦑', rarity:'uncommon',  rarityName:'稀有', coins:16, weight:[0.05,0.5]},
  // Rare (5)
  { id:'sword',    name:'剑鱼',   emoji:'⚔️', rarity:'rare',     rarityName:'珍稀', coins:50, weight:[5.0,30.0]},
  { id:'eel',      name:'电鳗',   emoji:'⚡', rarity:'rare',     rarityName:'珍稀', coins:55, weight:[2.0,15.0]},
  { id:'angler',   name:'灯笼鱼', emoji:'🔦', rarity:'rare',     rarityName:'珍稀', coins:50, weight:[1.0,8.0] },
  { id:'turtle',   name:'海龟',   emoji:'🐢', rarity:'rare',     rarityName:'珍稀', coins:60, weight:[10,80]   },
  { id:'jelly',    name:'水母',   emoji:'🪼', rarity:'rare',     rarityName:'珍稀', coins:45, weight:[0.5,5.0] },
  // Legendary (4)
  { id:'dragon',   name:'龙鱼',   emoji:'🐉', rarity:'legendary', rarityName:'传说', coins:200,weight:[3.0,20.0]},
  { id:'mermaid',  name:'美人鱼', emoji:'🧜', rarity:'legendary', rarityName:'传说', coins:250,weight:[30,60]   },
  { id:'whale',    name:'鲸鱼',   emoji:'🐳', rarity:'legendary', rarityName:'传说', coins:300,weight:[500,2000]},
  { id:'octopus',  name:'章鱼王', emoji:'🐙', rarity:'legendary', rarityName:'传说', coins:220,weight:[5.0,40.0]},
]

// ─── BAIT DATA ───
const BAITS = [
  { id:'bread',  name:'面包屑', emoji:'🍞', desc:'基础鱼饵',         cost:0,  unlockAt:0,  unlockText:'' },
  { id:'worm',   name:'蚯蚓',   emoji:'🪱', desc:'吸引稀有鱼类',     cost:10, unlockAt:0,  unlockText:'' },
  { id:'shrimp', name:'虾米',   emoji:'🦐', desc:'吸引珍稀鱼类',     cost:30, unlockAt:5,  unlockText:'钓5条鱼解锁' },
  { id:'golden', name:'金虫',   emoji:'✨', desc:'传说鱼类概率大增',  cost:80, unlockAt:15, unlockText:'钓15条鱼解锁' },
]

// Rarity probability tables per bait type
const RARITY_WEIGHTS = {
  bread:  { common:0.80, uncommon:0.15, rare:0.04, legendary:0.01 },
  worm:   { common:0.55, uncommon:0.30, rare:0.12, legendary:0.03 },
  shrimp: { common:0.35, uncommon:0.30, rare:0.28, legendary:0.07 },
  golden: { common:0.15, uncommon:0.25, rare:0.35, legendary:0.25 },
}

// ─── PIXEL SPRITE DATA ───
// Cat sprite (16x16) — palette: 0=transparent, 1=dark, 2=orange, 3=white, 4=pink, 5=eye
const CAT_IDLE = [
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,5,2,2,2,2,5,2,1,0,0,0],
  [0,0,0,1,2,2,2,4,4,2,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]
const CAT_PALETTE = ['transparent','#3A3A3C','#FF9F0A','#FFFFFF','#FF6B8A','#1D1D1F']

// Fish sprite templates (8x5 each)
const FISH_SPRITES = {
  common:    { px:[[0,0,1,1,0,0,0,0],[0,1,2,2,1,1,0,0],[1,2,2,3,2,2,1,0],[0,1,2,2,1,1,0,0],[0,0,1,1,0,0,0,0]], pal:['transparent','#86868B','#A8D8EA','#FFFFFF'] },
  uncommon:  { px:[[0,0,1,1,0,0,0,0],[0,1,2,2,1,1,0,0],[1,2,3,3,2,2,1,0],[0,1,2,2,1,1,0,0],[0,0,1,1,0,0,0,0]], pal:['transparent','#34C759','#7DCEA0','#FFD60A'] },
  rare:      { px:[[0,0,1,1,0,0,0,0],[0,1,2,2,1,1,0,0],[1,2,3,3,2,2,1,0],[0,1,2,2,1,1,0,0],[0,0,1,1,0,0,0,0]], pal:['transparent','#5856D6','#A8B4FF','#FFFFFF'] },
  legendary: { px:[[0,0,1,1,0,0,0,0],[0,1,2,3,1,1,0,0],[1,3,2,3,2,3,1,0],[0,1,2,3,1,1,0,0],[0,0,1,1,0,0,0,0]], pal:['transparent','#FF9F0A','#FFD60A','#FFFFFF'] },
}

// ─── HELPERS ───
function pickRarity(baitId) {
  const w = RARITY_WEIGHTS[baitId] || RARITY_WEIGHTS.bread
  const r = Math.random()
  let acc = 0
  for (const [rarity, prob] of Object.entries(w)) {
    acc += prob
    if (r <= acc) return rarity
  }
  return 'common'
}

function pickFish(baitId) {
  const rarity = pickRarity(baitId)
  const pool = FISH.filter(f => f.rarity === rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}

function randRange(a, b) {
  return a + Math.random() * (b - a)
}

// ─── PAGE ───
Page({
  data: {
    phase: 'intro',
    coins: 0,
    totalCaught: 0,
    albumCount: 0,
    totalFishTypes: FISH.length,
    sessionCaught: 0,
    fishState: 'idle', // idle | casting | waiting | bite | reeling | caught
    afkMode: false,
    currentBaitEmoji: '🍞',
    currentBaitName: '面包屑',
    selectedBait: 'bread',
    showToast: false,
    toastText: '',
    showBaitSelect: false,
    showAlbum: false,
    baits: [],
    albumList: [],
  },

  // non-reactive state
  _canvas: null,
  _ctx: null,
  _w: 0,
  _h: 0,
  _dpr: 2,
  _raf: null,
  _tick: 0,
  _album: {},       // fishId -> { count }
  _savedData: null,

  // fishing animation state
  _castProgress: 0,   // 0-1
  _bobberY: 0,
  _bobberX: 0,
  _waitTimer: 0,
  _biteTimer: 0,
  _reelTimer: 0,
  _caughtFish: null,
  _caughtAnim: 0,
  _sparkles: [],
  _coinPopups: [],
  _ambientFish: [],
  _waterOffset: 0,
  _afkTimer: 0,
  _toastTimer: null,
  _catFrame: 0,
  _catFrameTimer: 0,
  _zzz: [],

  onLoad() {
    this._loadData()
  },

  onUnload() {
    this._stopLoop()
  },

  onHide() {
    this._stopLoop()
  },

  onShow() {
    if (this.data.phase === 'fishing') {
      this._startLoop()
    }
  },

  // ─── PERSISTENCE ───
  _loadData() {
    let d = {}
    try { d = wx.getStorageSync('catfish_data') || {} } catch(e) {}
    this._album = d.album || {}
    this._savedData = d
    const albumCount = Object.keys(this._album).length
    this.setData({
      coins: d.coins || 0,
      totalCaught: d.totalCaught || 0,
      albumCount,
      selectedBait: d.selectedBait || 'bread',
    })
    this._updateBaitDisplay()
    this._buildAlbumList()
    this._buildBaitList()
  },

  _saveData() {
    const d = {
      coins: this.data.coins,
      totalCaught: this.data.totalCaught,
      album: this._album,
      selectedBait: this.data.selectedBait,
    }
    try { wx.setStorageSync('catfish_data', d) } catch(e) {}
  },

  // ─── INTRO ───
  startGame() {
    this.setData({ phase: 'fishing', sessionCaught: 0, fishState: 'idle' })
    this._initAmbientFish()
    wx.nextTick(() => this._initCanvas())
  },

  // ─── CANVAS INIT ───
  _initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#fish-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width
      const h = res[0].height
      const dpr = wx.getWindowInfo
        ? (wx.getWindowInfo().pixelRatio || 2)
        : (wx.getSystemInfoSync().pixelRatio || 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      this._canvas = canvas
      this._ctx = canvas.getContext('2d')
      this._w = w
      this._h = h
      this._dpr = dpr
      this._startLoop()
    })
  },

  // ─── GAME LOOP ───
  _startLoop() {
    if (this._raf) return
    const loop = () => {
      this._update()
      this._draw()
      this._raf = this._canvas.requestAnimationFrame(loop)
    }
    if (this._canvas && this._canvas.requestAnimationFrame) {
      this._raf = this._canvas.requestAnimationFrame(loop)
    } else {
      // fallback
      this._raf = setInterval(() => {
        this._update()
        this._draw()
      }, 16)
    }
  },

  _stopLoop() {
    if (this._raf) {
      if (this._canvas && this._canvas.cancelAnimationFrame) {
        this._canvas.cancelAnimationFrame(this._raf)
      } else {
        clearInterval(this._raf)
      }
      this._raf = null
    }
  },

  // ─── UPDATE ───
  _update() {
    this._tick++
    this._waterOffset += 0.03
    this._catFrameTimer++
    if (this._catFrameTimer > 30) {
      this._catFrame = 1 - this._catFrame
      this._catFrameTimer = 0
    }

    // Update ambient fish
    this._ambientFish.forEach(f => {
      f.x += f.speed
      if (f.x > this._w + 30) f.x = -30
      if (f.x < -30) f.x = this._w + 30
    })

    // Update sparkles
    this._sparkles = this._sparkles.filter(s => {
      s.x += s.vx
      s.y += s.vy
      s.life--
      return s.life > 0
    })

    // Update coin popups
    this._coinPopups = this._coinPopups.filter(p => {
      p.y -= 1.2
      p.life--
      return p.life > 0
    })

    // ZZZ for AFK
    if (this.data.afkMode) {
      if (this._tick % 50 === 0) {
        this._zzz.push({ x: this._w * 0.28 + Math.random() * 10, y: this._h * 0.18, life: 60, size: 8 + Math.random() * 6 })
      }
      this._zzz = this._zzz.filter(z => {
        z.y -= 0.6
        z.x += 0.3
        z.life--
        return z.life > 0
      })
    } else {
      this._zzz = []
    }

    // State machine
    const state = this.data.fishState
    if (state === 'casting') {
      this._castProgress += 0.04
      if (this._castProgress >= 1) {
        this._castProgress = 1
        this._enterWaiting()
      }
    } else if (state === 'waiting') {
      this._waitTimer--
      if (this._waitTimer <= 0) {
        this._enterBite()
      }
    } else if (state === 'bite') {
      this._biteTimer--
      if (this._biteTimer <= 0) {
        // Missed
        this._showToast('鱼跑了...')
        this._resetFishing()
      }
    } else if (state === 'reeling') {
      this._reelTimer--
      if (this._reelTimer <= 0) {
        this._onCatch()
      }
    } else if (state === 'caught') {
      this._caughtAnim++
      if (this._caughtAnim > 80) {
        this._resetFishing()
        // AFK auto-cast
        if (this.data.afkMode) {
          this._afkTimer = Math.floor(randRange(90, 180)) // frames
        }
      }
    } else if (state === 'idle' && this.data.afkMode) {
      this._afkTimer--
      if (this._afkTimer <= 0) {
        this.castLine()
      }
    }
  },

  // ─── DRAW ───
  _draw() {
    const ctx = this._ctx
    if (!ctx) return
    const w = this._w
    const h = this._h
    const dpr = this._dpr

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    // Sky
    ctx.fillStyle = '#E8F4FD'
    ctx.fillRect(0, 0, w, h * 0.42)

    // Water
    this._drawWater(ctx, w, h)

    // Ambient fish
    this._drawAmbientFish(ctx)

    // Cat
    this._drawCat(ctx, w, h)

    // Fishing line & bobber
    this._drawLine(ctx, w, h)

    // Bite indicator
    if (this.data.fishState === 'bite') {
      this._drawBiteIndicator(ctx)
    }

    // Caught fish animation
    if (this.data.fishState === 'caught' && this._caughtFish) {
      this._drawCaughtFish(ctx, w, h)
    }

    // Sparkles
    this._drawSparkles(ctx)

    // Coin popups
    this._drawCoinPopups(ctx)

    // ZZZ
    this._drawZzz(ctx)

    ctx.restore()
  },

  _drawWater(ctx, w, h) {
    const waterTop = h * 0.42
    // Gradient water
    const grad = ctx.createLinearGradient(0, waterTop, 0, h)
    grad.addColorStop(0, '#A8D8EA')
    grad.addColorStop(0.5, '#7EC8E3')
    grad.addColorStop(1, '#5B9BD5')
    ctx.fillStyle = grad
    ctx.fillRect(0, waterTop, w, h - waterTop)

    // Wave line
    ctx.beginPath()
    ctx.moveTo(0, waterTop)
    for (let x = 0; x <= w; x += 3) {
      const y = waterTop + Math.sin(x * 0.03 + this._waterOffset) * 3
        + Math.sin(x * 0.05 + this._waterOffset * 1.5) * 2
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, waterTop - 5)
    ctx.lineTo(0, waterTop - 5)
    ctx.closePath()
    ctx.fillStyle = '#B8E6F5'
    ctx.fill()
  },

  _drawAmbientFish(ctx) {
    this._ambientFish.forEach(f => {
      const alpha = 0.15 + f.depth * 0.1
      ctx.globalAlpha = alpha
      ctx.fillStyle = f.color
      // Simple pixel fish shape
      const s = f.size
      const dir = f.speed > 0 ? 1 : -1
      ctx.fillRect(f.x, f.y, s * 3 * dir, s)
      ctx.fillRect(f.x + s * dir, f.y - s * 0.5, s, s * 2)
      ctx.fillRect(f.x - s * 2 * dir, f.y - s * 0.3, s, s * 1.6)
      ctx.globalAlpha = 1
    })
  },

  _drawCat(ctx, w, h) {
    const catX = w * 0.15
    const catY = h * 0.18
    const pxSize = Math.max(2, w / 120)
    const sprite = CAT_IDLE
    const pal = CAT_PALETTE

    for (let row = 0; row < sprite.length; row++) {
      for (let col = 0; col < sprite[row].length; col++) {
        const ci = sprite[row][col]
        if (ci === 0) continue
        ctx.fillStyle = pal[ci]
        ctx.fillRect(
          catX + col * pxSize,
          catY + row * pxSize,
          pxSize + 0.5,
          pxSize + 0.5
        )
      }
    }

    // Tail animation
    const tailX = catX - pxSize * 2
    const tailY = catY + 10 * pxSize + Math.sin(this._tick * 0.1) * pxSize * 2
    ctx.fillStyle = CAT_PALETTE[2]
    ctx.fillRect(tailX, tailY, pxSize * 2, pxSize)
    ctx.fillRect(tailX - pxSize, tailY - pxSize, pxSize, pxSize * 2)
  },

  _drawLine(ctx, w, h) {
    const state = this.data.fishState
    if (state === 'idle') return

    const rodTipX = w * 0.32
    const rodTipY = h * 0.22

    // Rod (always visible when fishing)
    ctx.strokeStyle = '#8E8E93'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.22, h * 0.32)
    ctx.lineTo(rodTipX, rodTipY)
    ctx.stroke()

    // Calculate bobber position
    const targetX = w * 0.6
    const waterY = h * 0.44
    let bx, by

    if (state === 'casting') {
      const t = this._castProgress
      // Arc from rod tip to target
      bx = rodTipX + (targetX - rodTipX) * t
      by = rodTipY + (waterY - rodTipY) * t - Math.sin(t * Math.PI) * h * 0.15
    } else {
      bx = targetX
      const bobAmp = state === 'bite' ? 6 : 2
      const bobSpeed = state === 'bite' ? 0.3 : 0.08
      by = waterY + Math.sin(this._tick * bobSpeed) * bobAmp
      if (state === 'bite') {
        by += 5 // sinks lower
      }
    }

    this._bobberX = bx
    this._bobberY = by

    // Line
    ctx.strokeStyle = '#C7C7CC'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(rodTipX, rodTipY)
    ctx.quadraticCurveTo(
      (rodTipX + bx) / 2, rodTipY + (by - rodTipY) * 0.6,
      bx, by
    )
    ctx.stroke()

    // Bobber
    if (state !== 'casting' || this._castProgress > 0.7) {
      ctx.fillStyle = '#FF3B30'
      ctx.beginPath()
      ctx.arc(bx, by, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(bx, by - 2, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Ripples when in water
    if (state === 'waiting' || state === 'bite') {
      const rippleR = 8 + Math.sin(this._tick * 0.1) * 4
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(bx, by + 3, rippleR, rippleR * 0.3, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  },

  _drawBiteIndicator(ctx) {
    const bx = this._bobberX
    const by = this._bobberY
    const scale = 1 + Math.sin(this._tick * 0.4) * 0.2
    ctx.save()
    ctx.translate(bx, by - 25)
    ctx.scale(scale, scale)
    ctx.fillStyle = '#FF3B30'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('!', 0, 0)
    ctx.restore()
  },

  _drawCaughtFish(ctx, w, h) {
    const fish = this._caughtFish
    const t = Math.min(this._caughtAnim / 40, 1)
    // Jump arc
    const startX = this._bobberX || w * 0.6
    const startY = h * 0.44
    const peakY = h * 0.15
    const endY = h * 0.3
    const x = startX + (w * 0.5 - startX) * t
    const y = startY + (peakY - startY) * Math.sin(t * Math.PI)

    // Draw pixel fish sprite
    const spriteData = FISH_SPRITES[fish.rarity] || FISH_SPRITES.common
    const pxSize = Math.max(3, w / 80)
    const { px, pal } = spriteData

    ctx.save()
    ctx.translate(x, y)
    const rot = Math.sin(t * Math.PI * 2) * 0.3
    ctx.rotate(rot)

    for (let row = 0; row < px.length; row++) {
      for (let col = 0; col < px[row].length; col++) {
        const ci = px[row][col]
        if (ci === 0) continue
        ctx.fillStyle = pal[ci]
        ctx.fillRect(
          (col - 4) * pxSize,
          (row - 2.5) * pxSize,
          pxSize + 0.5,
          pxSize + 0.5
        )
      }
    }
    ctx.restore()

    // Name + coins text
    if (t > 0.3) {
      const alpha = Math.min((t - 0.3) / 0.3, 1)
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#1D1D1F'
      ctx.font = `bold ${Math.max(12, w / 25)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(fish.emoji + ' ' + fish.name, x, y - 20)
      ctx.globalAlpha = 1
    }
  },

  _drawSparkles(ctx) {
    this._sparkles.forEach(s => {
      const alpha = s.life / s.maxLife
      ctx.globalAlpha = alpha
      ctx.fillStyle = s.color
      ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3)
    })
    ctx.globalAlpha = 1
  },

  _drawCoinPopups(ctx) {
    this._coinPopups.forEach(p => {
      const alpha = Math.min(p.life / 20, 1)
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#FF9F0A'
      ctx.font = `bold ${Math.max(11, this._w / 28)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('+' + p.amount, p.x, p.y)
    })
    ctx.globalAlpha = 1
  },

  _drawZzz(ctx) {
    this._zzz.forEach(z => {
      const alpha = z.life / 60
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#5856D6'
      ctx.font = `${z.size}px sans-serif`
      ctx.fillText('z', z.x, z.y)
    })
    ctx.globalAlpha = 1
  },

  // ─── AMBIENT FISH ───
  _initAmbientFish() {
    this._ambientFish = []
    for (let i = 0; i < 6; i++) {
      this._ambientFish.push({
        x: Math.random() * 300,
        y: 150 + Math.random() * 120,
        speed: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5),
        size: 2 + Math.random() * 3,
        depth: Math.random(),
        color: ['#5B9BD5','#7EC8E3','#A8D8EA','#86868B'][Math.floor(Math.random()*4)],
      })
    }
  },

  // ─── FISHING STATE MACHINE ───
  castLine() {
    if (this.data.fishState !== 'idle') return

    // Check bait cost
    const bait = BAITS.find(b => b.id === this.data.selectedBait)
    if (bait && bait.cost > 0 && this.data.coins < bait.cost) {
      this._showToast('金币不足!')
      return
    }

    // Deduct bait cost
    if (bait && bait.cost > 0) {
      this.setData({ coins: this.data.coins - bait.cost })
    }

    this._castProgress = 0
    this.setData({ fishState: 'casting' })
  },

  _enterWaiting() {
    const waitFrames = Math.floor(randRange(120, 360)) // 2-6 seconds at 60fps
    this._waitTimer = waitFrames
    this.setData({ fishState: 'waiting' })
  },

  _enterBite() {
    this._biteTimer = this.data.afkMode ? 9999 : 120 // AFK auto-reels, manual has 2s window
    this.setData({ fishState: 'bite' })

    if (this.data.afkMode) {
      // Auto-reel after short delay, with 70% catch rate
      setTimeout(() => {
        if (this.data.fishState === 'bite') {
          if (Math.random() < 0.7) {
            this._startReeling()
          } else {
            this._showToast('鱼跑了...')
            this._resetFishing()
          }
        }
      }, 500)
    }
  },

  onCanvasTap() {
    if (this.data.fishState === 'bite') {
      this._startReeling()
    }
  },

  _startReeling() {
    this._reelTimer = 30
    this._caughtFish = pickFish(this.data.selectedBait)
    this.setData({ fishState: 'reeling' })
  },

  _onCatch() {
    const fish = this._caughtFish
    if (!fish) { this._resetFishing(); return }

    // Update album
    if (!this._album[fish.id]) {
      this._album[fish.id] = { count: 0 }
    }
    this._album[fish.id].count++
    const isNew = this._album[fish.id].count === 1
    const albumCount = Object.keys(this._album).length

    // Update coins & counts
    const newCoins = this.data.coins + fish.coins
    const newTotal = this.data.totalCaught + 1
    const newSession = this.data.sessionCaught + 1

    this.setData({
      fishState: 'caught',
      coins: newCoins,
      totalCaught: newTotal,
      sessionCaught: newSession,
      albumCount,
    })

    this._caughtAnim = 0

    // Spawn sparkles
    const cx = this._bobberX || this._w * 0.6
    const cy = this._h * 0.35
    const colors = ['#FFD60A','#FF9F0A','#5856D6','#AF52DE','#FF375F','#34C759']
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      this._sparkles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * (1.5 + Math.random()),
        vy: Math.sin(angle) * (1.5 + Math.random()),
        life: 30 + Math.floor(Math.random() * 15),
        maxLife: 45,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Coin popup
    this._coinPopups.push({
      x: cx, y: cy - 10,
      amount: fish.coins,
      life: 50,
    })

    // Toast
    const msg = isNew
      ? `新发现! ${fish.emoji} ${fish.name} +${fish.coins}`
      : `${fish.emoji} ${fish.name} +${fish.coins}`
    this._showToast(msg)

    // Save
    this._saveData()
    this._buildAlbumList()
    this._buildBaitList()
  },

  _resetFishing() {
    this._castProgress = 0
    this._caughtFish = null
    this._caughtAnim = 0
    this.setData({ fishState: 'idle' })
  },

  // ─── TOAST ───
  _showToast(text) {
    if (this._toastTimer) clearTimeout(this._toastTimer)
    this.setData({ toastText: text, showToast: true })
    this._toastTimer = setTimeout(() => {
      this.setData({ showToast: false })
      setTimeout(() => this.setData({ toastText: '' }), 300)
    }, 2000)
  },

  // ─── BAIT ───
  _updateBaitDisplay() {
    const bait = BAITS.find(b => b.id === this.data.selectedBait) || BAITS[0]
    this.setData({
      currentBaitEmoji: bait.emoji,
      currentBaitName: bait.name,
    })
  },

  _buildBaitList() {
    const total = this.data.totalCaught
    const baits = BAITS.map(b => ({
      ...b,
      unlocked: total >= b.unlockAt,
    }))
    this.setData({ baits })
  },

  toggleBaitSelect() {
    this.setData({ showBaitSelect: !this.data.showBaitSelect })
  },

  selectBait(e) {
    const id = e.currentTarget.dataset.id
    const bait = this.data.baits.find(b => b.id === id)
    if (!bait || !bait.unlocked) return
    this.setData({ selectedBait: id, showBaitSelect: false })
    this._updateBaitDisplay()
    this._saveData()
  },

  noop() {},

  // ─── ALBUM ───
  _buildAlbumList() {
    const list = FISH.map(f => ({
      id: f.id,
      name: f.name,
      emoji: f.emoji,
      rarity: f.rarity,
      rarityName: f.rarityName,
      caught: !!this._album[f.id],
      count: this._album[f.id] ? this._album[f.id].count : 0,
    }))
    this.setData({ albumList: list })
  },

  toggleAlbum() {
    this.setData({ showAlbum: !this.data.showAlbum })
  },

  // ─── AFK ───
  toggleAfk() {
    const newVal = !this.data.afkMode
    this.setData({ afkMode: newVal })
    if (newVal) {
      this._afkTimer = 60
      this._showToast('挂机钓鱼已开启')
    } else {
      this._showToast('挂机钓鱼已关闭')
    }
  },

  // ─── INTRO CANVAS (pixel cat preview) ───
  _drawIntroCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#intro-canvas').fields({ node: true, size: true }).exec(res => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const w = res[0].width
      const h = res[0].height
      const dpr = wx.getWindowInfo
        ? (wx.getWindowInfo().pixelRatio || 2)
        : (wx.getSystemInfoSync().pixelRatio || 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      // Background
      ctx.fillStyle = '#E8F4FD'
      ctx.fillRect(0, 0, w, h)

      // Water
      const wy = h * 0.55
      const grad = ctx.createLinearGradient(0, wy, 0, h)
      grad.addColorStop(0, '#A8D8EA')
      grad.addColorStop(1, '#5B9BD5')
      ctx.fillStyle = grad
      ctx.fillRect(0, wy, w, h - wy)

      // Cat
      const pxSize = Math.max(4, w / 40)
      const cx = w * 0.3
      const cy = h * 0.1
      for (let r = 0; r < CAT_IDLE.length; r++) {
        for (let c = 0; c < CAT_IDLE[r].length; c++) {
          const ci = CAT_IDLE[r][c]
          if (ci === 0) continue
          ctx.fillStyle = CAT_PALETTE[ci]
          ctx.fillRect(cx + c * pxSize, cy + r * pxSize, pxSize + 0.5, pxSize + 0.5)
        }
      }

      // Rod
      ctx.strokeStyle = '#8E8E93'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx + 8 * pxSize, cy + 8 * pxSize)
      ctx.lineTo(w * 0.7, h * 0.3)
      ctx.stroke()

      // Line
      ctx.strokeStyle = '#C7C7CC'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w * 0.7, h * 0.3)
      ctx.lineTo(w * 0.65, wy + 10)
      ctx.stroke()

      // Bobber
      ctx.fillStyle = '#FF3B30'
      ctx.beginPath()
      ctx.arc(w * 0.65, wy + 10, 4, 0, Math.PI * 2)
      ctx.fill()

      // Small fish
      const fishColors = ['#FF9F0A','#5856D6','#34C759']
      for (let i = 0; i < 3; i++) {
        const fx = w * 0.2 + i * w * 0.25
        const fy = wy + 20 + i * 15
        ctx.fillStyle = fishColors[i]
        ctx.globalAlpha = 0.5
        ctx.fillRect(fx, fy, 12, 4)
        ctx.fillRect(fx + 3, fy - 2, 6, 8)
        ctx.globalAlpha = 1
      }
    })
  },

  onReady() {
    if (this.data.phase === 'intro') {
      wx.nextTick(() => this._drawIntroCanvas())
    }
  },

  onShareAppMessage() {
    return {
      title: '猫猫钓鱼 - 像素风休闲垂钓',
      path: '/pages/cat-fishing/cat-fishing',
    }
  },
})
