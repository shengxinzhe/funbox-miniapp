/**
 * Reaction-Diffusion Engine (Gray-Scott model)
 * Runs on a grid of A/B concentrations.
 * Turing instability produces organic patterns from simple math.
 */

var DEFAULT_W = 128
var DEFAULT_H = 128

function createEngine(w, h) {
  w = w || DEFAULT_W
  h = h || DEFAULT_H
  var size = w * h

  // Double-buffer: current and next
  var A = new Float32Array(size)
  var B = new Float32Array(size)
  var An = new Float32Array(size)
  var Bn = new Float32Array(size)

  // Default Gray-Scott parameters
  var dA = 0.2097
  var dB = 0.105
  var feed = 0.037
  var kill = 0.06
  var dt = 1.0

  // Init: A=1 everywhere, B=0 with a seed patch in center
  function init(f, k) {
    feed = f || 0.037
    kill = k || 0.06
    for (var i = 0; i < size; i++) {
      A[i] = 1.0
      B[i] = 0.0
    }
    // Seed a few random patches
    _seedPatch(w / 2, h / 2, 6)
    _seedPatch(w / 3, h / 3, 4)
    _seedPatch(w * 2 / 3, h * 2 / 3, 4)
  }

  function _seedPatch(cx, cy, r) {
    cx = Math.floor(cx)
    cy = Math.floor(cy)
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          var x = (cx + dx + w) % w
          var y = (cy + dy + h) % h
          var idx = y * w + x
          A[idx] = 0.5 + Math.random() * 0.1
          B[idx] = 0.25 + Math.random() * 0.1
        }
      }
    }
  }

  // One simulation step
  function step() {
    for (var y = 0; y < h; y++) {
      var ym = ((y - 1) + h) % h
      var yp = (y + 1) % h
      for (var x = 0; x < w; x++) {
        var xm = ((x - 1) + w) % w
        var xp = (x + 1) % w
        var idx = y * w + x

        var a = A[idx]
        var b = B[idx]

        // Laplacian (5-point stencil)
        var lapA = A[ym * w + x] + A[yp * w + x] + A[y * w + xm] + A[y * w + xp] - 4 * a
        var lapB = B[ym * w + x] + B[yp * w + x] + B[y * w + xm] + B[y * w + xp] - 4 * b

        var abb = a * b * b
        An[idx] = a + dt * (dA * lapA - abb + feed * (1 - a))
        Bn[idx] = b + dt * (dB * lapB + abb - (feed + kill) * b)

        // Clamp
        if (An[idx] < 0) An[idx] = 0
        if (An[idx] > 1) An[idx] = 1
        if (Bn[idx] < 0) Bn[idx] = 0
        if (Bn[idx] > 1) Bn[idx] = 1
      }
    }
    // Swap buffers
    var tA = A; A = An; An = tA
    var tB = B; B = Bn; Bn = tB
  }

  // Run N steps at once
  function stepN(n) {
    for (var i = 0; i < n; i++) step()
  }

  // Inject activator at (cx, cy) with radius r
  function injectA(cx, cy, r, strength) {
    r = r || 3
    strength = strength || 0.12
    cx = Math.floor(cx)
    cy = Math.floor(cy)
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          var x = (cx + dx + w) % w
          var y = (cy + dy + h) % h
          var idx = y * w + x
          B[idx] = Math.min(1.0, B[idx] + strength)
          A[idx] = Math.max(0.0, A[idx] - strength * 0.5)
        }
      }
    }
  }

  // Inject inhibitor barrier along a line
  function injectBarrier(cx, cy, r) {
    r = r || 2
    cx = Math.floor(cx)
    cy = Math.floor(cy)
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          var x = (cx + dx + w) % w
          var y = (cy + dy + h) % h
          var idx = y * w + x
          A[idx] = 1.0
          B[idx] = 0.0
        }
      }
    }
  }

  // Freeze (crystallize) area
  function freeze(cx, cy, r) {
    r = r || 5
    cx = Math.floor(cx)
    cy = Math.floor(cy)
    for (var dy = -r; dy <= r; dy++) {
      for (var dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          var x = (cx + dx + w) % w
          var y = (cy + dy + h) % h
          var idx = y * w + x
          // Snap to nearest stable state
          B[idx] = B[idx] > 0.15 ? 0.5 : 0.0
          A[idx] = B[idx] > 0.15 ? 0.3 : 1.0
        }
      }
    }
  }

  // Get current A/B arrays (read-only reference)
  function getA() { return A }
  function getB() { return B }
  function getWidth() { return w }
  function getHeight() { return h }

  // Set parameters
  function setParams(f, k) {
    feed = f
    kill = k
  }

  function getParams() {
    return { feed: feed, kill: kill }
  }

  // Calculate stats
  function getStats() {
    var sumA = 0, sumB = 0, crystalCount = 0
    for (var i = 0; i < size; i++) {
      sumA += A[i]
      sumB += B[i]
      if (B[i] > 0.3) crystalCount++
    }
    return {
      avgA: sumA / size,
      avgB: sumB / size,
      crystalRatio: crystalCount / size,
      entropy: _calcEntropy()
    }
  }

  function _calcEntropy() {
    // Simplified Shannon entropy on B values (binned to 10 levels)
    var bins = new Float32Array(10)
    for (var i = 0; i < size; i++) {
      var bin = Math.min(9, Math.floor(B[i] * 10))
      bins[bin]++
    }
    var e = 0
    for (var j = 0; j < 10; j++) {
      var p = bins[j] / size
      if (p > 0) e -= p * Math.log(p)
    }
    return e / Math.log(10) // normalize to [0,1]
  }

  init()

  return {
    init: init,
    step: step,
    stepN: stepN,
    injectA: injectA,
    injectBarrier: injectBarrier,
    freeze: freeze,
    getA: getA,
    getB: getB,
    getWidth: getWidth,
    getHeight: getHeight,
    setParams: setParams,
    getParams: getParams,
    getStats: getStats
  }
}

module.exports = { createEngine: createEngine }
