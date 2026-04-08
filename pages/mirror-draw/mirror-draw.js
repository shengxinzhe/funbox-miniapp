// mirror-draw.js
// 镜像画室 - Mirror Draw Studio

// ── Canvas logical size (px at 1:1, scaled by pixelRatio later)
const CANVAS_LOGICAL = 300; // rpx 600 / 2

// ── Shape data: [[[x,y], ...stroke], ...] normalised 0-1
// Coordinates are in 0-1 range, scaled to canvas at draw time.
const SHAPES = {
  // Mode 0: Horizontal Mirror
  0: [
    { name: '水平线',   strokes: [[[0.15,0.5],[0.85,0.5]]] },
    { name: 'V形',      strokes: [[[0.2,0.25],[0.5,0.75],[0.8,0.25]]] },
    { name: 'Z形',      strokes: [[[0.2,0.25],[0.8,0.25],[0.2,0.75],[0.8,0.75]]] },
    { name: '三角形',   strokes: [[[0.5,0.2],[0.8,0.75],[0.2,0.75],[0.5,0.2]]] },
    { name: '正方形',   strokes: [[[0.2,0.2],[0.8,0.2],[0.8,0.8],[0.2,0.8],[0.2,0.2]]] },
    { name: '五角星',   strokes: [[[0.5,0.15],[0.61,0.45],[0.93,0.45],[0.68,0.63],[0.79,0.93],[0.5,0.75],[0.21,0.93],[0.32,0.63],[0.07,0.45],[0.39,0.45],[0.5,0.15]]] },
    { name: '右箭头',   strokes: [[[0.15,0.5],[0.75,0.5]],[[0.55,0.3],[0.75,0.5],[0.55,0.7]]] },
    { name: '小房子',   strokes: [[[0.2,0.55],[0.2,0.8],[0.8,0.8],[0.8,0.55],[0.5,0.25],[0.2,0.55]]] },
    { name: '心形',     strokes: [[[0.5,0.75],[0.15,0.4],[0.15,0.28],[0.25,0.2],[0.38,0.2],[0.5,0.32],[0.62,0.2],[0.75,0.2],[0.85,0.28],[0.85,0.4],[0.5,0.75]]] },
    { name: '"大"字',   strokes: [[[0.5,0.22],[0.5,0.65]],[[0.2,0.42],[0.8,0.42]],[[0.5,0.65],[0.22,0.82]],[[0.5,0.65],[0.78,0.82]]] },
  ],
  // Mode 1: Vertical Mirror
  1: [
    { name: '竖线',     strokes: [[[0.5,0.15],[0.5,0.85]]] },
    { name: '山形',     strokes: [[[0.1,0.8],[0.5,0.2],[0.9,0.8]]] },
    { name: 'S形',      strokes: [[[0.65,0.2],[0.35,0.2],[0.35,0.5],[0.65,0.5],[0.65,0.8],[0.35,0.8]]] },
    { name: '菱形',     strokes: [[[0.5,0.15],[0.82,0.5],[0.5,0.85],[0.18,0.5],[0.5,0.15]]] },
    { name: '十字',     strokes: [[[0.5,0.15],[0.5,0.85]],[[0.15,0.5],[0.85,0.5]]] },
    { name: '六角星',   strokes: [[[0.5,0.15],[0.83,0.67],[0.17,0.67],[0.5,0.15]],[[0.5,0.85],[0.17,0.33],[0.83,0.33],[0.5,0.85]]] },
    { name: '上箭头',   strokes: [[[0.5,0.8],[0.5,0.2]],[[0.3,0.4],[0.5,0.2],[0.7,0.4]]] },
    { name: '阶梯',     strokes: [[[0.2,0.8],[0.2,0.6],[0.4,0.6],[0.4,0.4],[0.6,0.4],[0.6,0.2],[0.8,0.2]]] },
    { name: '螺旋',     strokes: [[[0.5,0.5],[0.7,0.5],[0.7,0.3],[0.3,0.3],[0.3,0.7],[0.65,0.7],[0.65,0.38]]] },
    { name: '"山"字',   strokes: [[[0.2,0.75],[0.2,0.3]],[[0.5,0.75],[0.5,0.2]],[[0.8,0.75],[0.8,0.3]],[[0.2,0.75],[0.8,0.75]]] },
  ],
  // Mode 2: Double Mirror
  2: [
    { name: '斜线',     strokes: [[[0.2,0.2],[0.8,0.8]]] },
    { name: 'X形',      strokes: [[[0.2,0.2],[0.8,0.8]],[[0.8,0.2],[0.2,0.8]]] },
    { name: '螺旋方',   strokes: [[[0.8,0.5],[0.8,0.2],[0.2,0.2],[0.2,0.8],[0.7,0.8],[0.7,0.3],[0.3,0.3],[0.3,0.7]]] },
    { name: '五边形',   strokes: [[[0.5,0.15],[0.85,0.42],[0.7,0.82],[0.3,0.82],[0.15,0.42],[0.5,0.15]]] },
    { name: '双三角',   strokes: [[[0.15,0.75],[0.5,0.25],[0.85,0.75],[0.15,0.75]],[[0.15,0.25],[0.5,0.75],[0.85,0.25],[0.15,0.25]]] },
    { name: '风车',     strokes: [[[0.5,0.5],[0.5,0.2],[0.7,0.35]],[[0.5,0.5],[0.8,0.5],[0.65,0.7]],[[0.5,0.5],[0.5,0.8],[0.3,0.65]],[[0.5,0.5],[0.2,0.5],[0.35,0.3]]] },
    { name: '迷宫口',   strokes: [[[0.2,0.2],[0.8,0.2],[0.8,0.8],[0.2,0.8],[0.2,0.5],[0.5,0.5],[0.5,0.65]]] },
    { name: '闪电',     strokes: [[[0.6,0.15],[0.35,0.5],[0.6,0.5],[0.35,0.85]]] },
    { name: '钥匙',     strokes: [[[0.5,0.75],[0.5,0.45]],[[0.5,0.45],[0.5,0.2],[0.35,0.2],[0.35,0.35],[0.5,0.45],[0.65,0.35],[0.65,0.2],[0.5,0.2]]] },
    { name: '"米"字',   strokes: [[[0.5,0.2],[0.5,0.8]],[[0.2,0.5],[0.8,0.5]],[[0.25,0.25],[0.75,0.75]],[[0.75,0.25],[0.25,0.75]]] },
  ],
};

const MODES = [
  { id: 0, name: '水平镜像', shortName: '水平', desc: '左右翻转', icon: '↔️' },
  { id: 1, name: '垂直镜像', shortName: '垂直', desc: '上下翻转', icon: '↕️' },
  { id: 2, name: '双轴镜像', shortName: '双轴', desc: '四角翻转', icon: '✦' },
];

Page({
  data: {
    screen: 'intro',      // intro | game | result | modeComplete
    modes: MODES,
    currentMode: 0,
    currentShape: 0,
    timerDisplay: '0:00',
    displayScore: 0,
    accuracyClass: '',
    resultStars: 0,
    resultLabel: '',
    shapeNames: {
      0: SHAPES[0].map(s => s.name),
      1: SHAPES[1].map(s => s.name),
      2: SHAPES[2].map(s => s.name),
    },
    progress: { unlockedModes: 1, modeStars: [0, 0, 0] },
    shapeResults: [],
    totalStarsEarned: 0,
    bestAccuracyDisplay: 0,
    unlockedNew: false,
  },

  // ── Internal state (not reactive)
  _canvas: null,
  _ctx: null,
  _ratio: 1,
  _canvasSize: CANVAS_LOGICAL,
  _isDrawing: false,
  _currentStroke: [],
  _allStrokes: [],        // array of strokes drawn this attempt
  _timerInterval: null,
  _timerSeconds: 0,
  _lastAccuracy: 0,
  _sessionStarResults: [], // stars per shape in current mode session

  onLoad() {
    this._loadProgress();
  },

  onUnload() {
    this._stopTimer();
  },

  // ── Progress storage ──────────────────────────────────────────
  _loadProgress() {
    try {
      const saved = wx.getStorageSync('mirror_progress');
      if (saved) {
        this.setData({ progress: saved });
      }
    } catch (e) { /* ignore */ }
  },

  _saveProgress() {
    try {
      wx.setStorageSync('mirror_progress', this.data.progress);
    } catch (e) { /* ignore */ }
  },

  // ── Navigation ────────────────────────────────────────────────
  selectMode(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    if (idx > 0 && this.data.progress.unlockedModes < idx + 1) {
      wx.showToast({ title: '完成前一模式后解锁', icon: 'none' });
      return;
    }
    this._sessionStarResults = [];
    this.setData({
      screen: 'game',
      currentMode: idx,
      currentShape: 0,
    }, () => {
      this._initCanvas();
      this._cacheCanvasOffset();
      this._startTimer();
    });
  },

  goIntro() {
    this._stopTimer();
    this.setData({ screen: 'intro' });
  },

  exitGame() {
    this._stopTimer();
    wx.showModal({
      title: '确认退出',
      content: '退出将丢失当前进度',
      confirmText: '退出',
      cancelText: '继续',
      success: (res) => {
        if (res.confirm) {
          this.setData({ screen: 'intro' });
        }
      }
    });
  },

  playNextMode() {
    const next = this.data.currentMode + 1;
    if (next >= 3) {
      this.setData({ screen: 'intro' });
      return;
    }
    this._sessionStarResults = [];
    this.setData({
      screen: 'game',
      currentMode: next,
      currentShape: 0,
    }, () => {
      this._initCanvas();
      this._startTimer();
    });
  },

  // ── Timer ─────────────────────────────────────────────────────
  _startTimer() {
    this._stopTimer();
    this._timerSeconds = 0;
    this._timerInterval = setInterval(() => {
      this._timerSeconds++;
      const m = Math.floor(this._timerSeconds / 60);
      const s = this._timerSeconds % 60;
      this.setData({ timerDisplay: `${m}:${s < 10 ? '0' : ''}${s}` });
    }, 1000);
  },

  _stopTimer() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  // ── Canvas init ───────────────────────────────────────────────
  _initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#draw-canvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return;
      const canvas = res[0].node;
      const w = res[0].width;
      const h = res[0].height;
      const ratio = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : wx.getSystemInfoSync().pixelRatio;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      this._canvas = canvas;
      this._ctx = canvas.getContext('2d');
      this._ratio = ratio;
      this._canvasSize = w * ratio;
      this._allStrokes = [];
      this._currentStroke = [];
      this._drawFrame();
    });
  },

  // ── Drawing ───────────────────────────────────────────────────
  _drawFrame() {
    const ctx = this._ctx;
    const sz = this._canvasSize;
    if (!ctx) return;

    ctx.clearRect(0, 0, sz, sz);

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, sz, sz);

    // Draw target shape (gray guide)
    this._drawTargetShape(ctx, sz);

    // Draw mirror axis
    this._drawMirrorAxis(ctx, sz);

    // Draw user strokes
    this._drawUserStrokes(ctx, sz);
  },

  _drawTargetShape(ctx, sz) {
    const mode = this.data.currentMode;
    const shapeIdx = this.data.currentShape;
    const shape = SHAPES[mode][shapeIdx];
    ctx.strokeStyle = '#E5E5EA';
    ctx.lineWidth = 3 * this._ratio;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    shape.strokes.forEach(stroke => {
      ctx.beginPath();
      stroke.forEach(([nx, ny], i) => {
        const x = nx * sz;
        const y = ny * sz;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  },

  _drawMirrorAxis(ctx, sz) {
    const mode = this.data.currentMode;
    ctx.save();
    ctx.setLineDash([8 * this._ratio, 6 * this._ratio]);
    ctx.strokeStyle = '#C7C7CC';
    ctx.lineWidth = 1.5 * this._ratio;
    if (mode === 0 || mode === 2) {
      // Vertical center axis
      ctx.beginPath();
      ctx.moveTo(sz / 2, 0);
      ctx.lineTo(sz / 2, sz);
      ctx.stroke();
    }
    if (mode === 1 || mode === 2) {
      // Horizontal center axis
      ctx.beginPath();
      ctx.moveTo(0, sz / 2);
      ctx.lineTo(sz, sz / 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  _drawUserStrokes(ctx, sz) {
    ctx.strokeStyle = '#5856D6';
    ctx.lineWidth = 3 * this._ratio;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw completed strokes
    this._allStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      stroke.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Draw current stroke
    if (this._currentStroke.length >= 2) {
      ctx.beginPath();
      this._currentStroke.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  },

  _drawFingerIndicator(ctx, sz, fx, fy) {
    // Faint orange dot at actual finger position
    ctx.save();
    ctx.beginPath();
    ctx.arc(fx, fy, 6 * this._ratio, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 149, 0, 0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 149, 0, 0.8)';
    ctx.lineWidth = 1.5 * this._ratio;
    ctx.stroke();
    ctx.restore();
  },

  // ── Mirror transform ──────────────────────────────────────────
  _mirrorPoint(touchX, touchY) {
    const sz = this._canvasSize;
    const mode = this.data.currentMode;
    let mx = touchX;
    let my = touchY;
    if (mode === 0) { mx = sz - touchX; }
    else if (mode === 1) { my = sz - touchY; }
    else { mx = sz - touchX; my = sz - touchY; }
    return [mx, my];
  },

  _touchToCanvas(e) {
    const touch = e.touches[0];
    // Get canvas bounding rect
    const ratio = this._ratio;
    const sz = this._canvasSize; // physical pixels
    // We need to convert page coordinates to canvas coordinates
    // The canvas element is 600rpx wide. Physical width = sz px.
    const canvasEl = this._canvas;
    // Use the stored offset
    const ox = this._canvasOffsetX || 0;
    const oy = this._canvasOffsetY || 0;
    const displayW = this._displayW || (sz / ratio);
    const displayH = this._displayH || (sz / ratio);
    const scaleX = sz / displayW;
    const scaleY = sz / displayH;
    const cx = (touch.clientX - ox) * scaleX;
    const cy = (touch.clientY - oy) * scaleY;
    return [cx, cy];
  },

  // ── Touch handlers ────────────────────────────────────────────
  onTouchStart(e) {
    if (!this._canvas) return;
    this._isDrawing = true;
    this._currentStroke = [];

    const [cx, cy] = this._touchToCanvas(e);
    const [mx, my] = this._mirrorPoint(cx, cy);
    this._currentStroke.push([mx, my]);

    this._drawFrame();
    this._drawFingerIndicator(this._ctx, this._canvasSize, cx, cy);
  },

  onTouchMove(e) {
    if (!this._isDrawing || !this._canvas) return;
    const [cx, cy] = this._touchToCanvas(e);
    const [mx, my] = this._mirrorPoint(cx, cy);
    this._currentStroke.push([mx, my]);

    this._drawFrame();
    this._drawFingerIndicator(this._ctx, this._canvasSize, cx, cy);
  },

  onTouchEnd() {
    if (!this._isDrawing) return;
    this._isDrawing = false;
    if (this._currentStroke.length > 0) {
      this._allStrokes.push([...this._currentStroke]);
    }
    this._currentStroke = [];
    this._drawFrame();
  },

  // ── Canvas offset cache (needed for coordinate conversion) ────
  onShow() {
    this._cacheCanvasOffset();
  },

  _cacheCanvasOffset() {
    if (this.data.screen !== 'game') return;
    const query = wx.createSelectorQuery();
    query.select('#draw-canvas').boundingClientRect((rect) => {
      if (rect) {
        this._canvasOffsetX = rect.left;
        this._canvasOffsetY = rect.top;
        this._displayW = rect.width;
        this._displayH = rect.height;
      }
    }).exec();
  },

  // ── Game actions ──────────────────────────────────────────────
  clearCanvas() {
    this._allStrokes = [];
    this._currentStroke = [];
    this._drawFrame();
  },

  submitDrawing() {
    this._stopTimer();
    const accuracy = this._calculateAccuracy();
    this._lastAccuracy = accuracy;
    const stars = accuracy >= 80 ? 3 : accuracy >= 60 ? 2 : accuracy >= 30 ? 1 : 0;
    const label = accuracy >= 80 ? '完美!' : accuracy >= 60 ? '很好!' : accuracy >= 30 ? '不错的尝试' : '再试试';
    const cls = accuracy >= 60 ? 'great' : accuracy >= 30 ? 'good' : 'poor';

    this._sessionStarResults.push(stars);

    this.setData({
      screen: 'result',
      displayScore: 0,
      resultStars: stars,
      resultLabel: label,
      accuracyClass: cls,
    }, () => {
      this._animateScore(accuracy);
      this._initCompareCanvas();
    });
  },

  _animateScore(target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      this.setData({ displayScore: current });
      if (current >= target) clearInterval(interval);
    }, 30);
  },

  retryShape() {
    // Remove last star entry (we'll re-record)
    this._sessionStarResults.pop();
    this.setData({ screen: 'game' }, () => {
      this._initCanvas();
      this._cacheCanvasOffset();
      this._startTimer();
    });
  },

  nextShape() {
    const next = this.data.currentShape + 1;
    if (next >= 10) {
      this._showModeComplete();
    } else {
      this.setData({ screen: 'game', currentShape: next }, () => {
        this._initCanvas();
        this._cacheCanvasOffset();
        this._startTimer();
      });
    }
  },

  _showModeComplete() {
    const stars = this._sessionStarResults;
    const total = stars.reduce((a, b) => a + b, 0);
    const maxStars = stars.length * 3;
    const best = this._lastAccuracy;
    const modeIdx = this.data.currentMode;

    // Update progress
    const progress = { ...this.data.progress };
    const modeStarsTotal = Math.floor(total / Math.max(stars.length, 1));
    if (modeStarsTotal > (progress.modeStars[modeIdx] || 0)) {
      progress.modeStars[modeIdx] = modeStarsTotal;
    }
    let unlockedNew = false;
    if (total >= maxStars * 0.3 && modeIdx + 1 < 3 && progress.unlockedModes <= modeIdx + 1) {
      progress.unlockedModes = modeIdx + 2;
      unlockedNew = true;
    }

    this.setData({
      screen: 'modeComplete',
      shapeResults: stars,
      totalStarsEarned: total,
      bestAccuracyDisplay: best,
      unlockedNew,
      progress,
    });
    this._saveProgress();
  },

  // ── Compare canvas ────────────────────────────────────────────
  _initCompareCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#compare-canvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return;
      const canvas = res[0].node;
      const w = res[0].width;
      const h = res[0].height;
      const ratio = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : wx.getSystemInfoSync().pixelRatio;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      const ctx = canvas.getContext('2d');
      const sz = w * ratio;

      ctx.fillStyle = '#F5F5F7';
      ctx.fillRect(0, 0, sz, sz);

      const mode = this.data.currentMode;
      const shapeIdx = this.data.currentShape;
      const shape = SHAPES[mode][shapeIdx];

      // Target (gray)
      ctx.strokeStyle = '#C7C7CC';
      ctx.lineWidth = 3 * ratio;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      shape.strokes.forEach(stroke => {
        ctx.beginPath();
        stroke.forEach(([nx, ny], i) => {
          const x = nx * sz;
          const y = ny * sz;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      // User strokes (purple) - scale from draw canvas coords
      const drawSz = this._canvasSize;
      const scale = sz / drawSz;
      ctx.strokeStyle = '#5856D6';
      ctx.lineWidth = 2.5 * ratio;
      this._allStrokes.forEach(stroke => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        stroke.forEach(([x, y], i) => {
          const cx2 = x * scale;
          const cy2 = y * scale;
          if (i === 0) ctx.moveTo(cx2, cy2);
          else ctx.lineTo(cx2, cy2);
        });
        ctx.stroke();
      });
    });
  },

  // ── Accuracy calculation ──────────────────────────────────────
  _calculateAccuracy() {
    const mode = this.data.currentMode;
    const shapeIdx = this.data.currentShape;
    const shape = SHAPES[mode][shapeIdx];
    const sz = this._canvasSize;

    // Build dense target points from normalised shape
    const targetPts = [];
    shape.strokes.forEach(stroke => {
      for (let i = 0; i < stroke.length - 1; i++) {
        const [x0, y0] = stroke[i];
        const [x1, y1] = stroke[i + 1];
        const steps = 20;
        for (let t = 0; t <= steps; t++) {
          targetPts.push([
            (x0 + (x1 - x0) * t / steps) * sz,
            (y0 + (y1 - y0) * t / steps) * sz,
          ]);
        }
      }
    });

    if (targetPts.length === 0) return 0;

    // Sample user strokes
    const userPts = [];
    this._allStrokes.forEach(stroke => {
      for (let i = 0; i < stroke.length - 1; i++) {
        const [x0, y0] = stroke[i];
        const [x1, y1] = stroke[i + 1];
        const steps = 5;
        for (let t = 0; t <= steps; t++) {
          userPts.push([
            x0 + (x1 - x0) * t / steps,
            y0 + (y1 - y0) * t / steps,
          ]);
        }
      }
    });

    if (userPts.length === 0) return 0;

    // Sample 50 evenly spaced from user points
    const sample = [];
    const step = Math.max(1, Math.floor(userPts.length / 50));
    for (let i = 0; i < userPts.length; i += step) {
      sample.push(userPts[i]);
      if (sample.length >= 50) break;
    }

    // Average min distance from each sample to target
    let totalDist = 0;
    sample.forEach(([ux, uy]) => {
      let minD = Infinity;
      targetPts.forEach(([tx, ty]) => {
        const d = Math.sqrt((ux - tx) ** 2 + (uy - ty) ** 2);
        if (d < minD) minD = d;
      });
      totalDist += minD;
    });

    const avgDist = totalDist / sample.length;
    const maxAllowed = sz * 0.25; // 25% of canvas size as "max miss"
    const accuracy = Math.round(Math.max(0, Math.min(100, 100 - (avgDist / maxAllowed * 100))));
    return accuracy;
  },
});
