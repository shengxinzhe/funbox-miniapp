/**
 * Sound effects utility for FunBox mini program
 * Uses wx.createInnerAudioContext for playback
 * All sounds are short base64 WAV data URIs for zero-latency playback
 */

// Pre-generate very short PCM WAV buffers as base64 data URIs
// These are tiny (<2KB each) synthesized sound effects

function generateWav(samples, sampleRate) {
  sampleRate = sampleRate || 22050
  var numSamples = samples.length
  var byteRate = sampleRate * 2
  var blockAlign = 2
  var dataSize = numSamples * 2
  var buffer = new ArrayBuffer(44 + dataSize)
  var view = new DataView(buffer)

  function writeString(offset, str) {
    for (var i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  for (var i = 0; i < numSamples; i++) {
    var s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(44 + i * 2, s * 32767, true)
  }

  return buffer
}

// Synth functions
function clickSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.05)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var env = Math.exp(-t * 80)
    samples[i] = Math.sin(2 * Math.PI * 800 * t) * env * 0.5
  }
  return generateWav(samples, sr)
}

function successSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.3)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = t < 0.1 ? 523 : t < 0.2 ? 659 : 784
    var env = Math.exp(-t * 5) * 0.5
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function failSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.3)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = 200 - t * 200
    var env = Math.exp(-t * 6) * 0.5
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function coinSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.15)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = 1200 + Math.sin(t * 40) * 200
    var env = Math.exp(-t * 15) * 0.4
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function bubbleSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.1)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = 600 + t * 2000
    var env = Math.exp(-t * 20) * 0.3
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function tapSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.03)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var env = Math.exp(-t * 120)
    samples[i] = (Math.random() * 2 - 1) * env * 0.3
  }
  return generateWav(samples, sr)
}

function goSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.2)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = 880
    var env = Math.exp(-t * 8) * 0.5
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function levelUpSound() {
  var sr = 22050
  var len = Math.floor(sr * 0.4)
  var samples = new Float32Array(len)
  for (var i = 0; i < len; i++) {
    var t = i / sr
    var freq = 440 + t * 880
    var env = Math.exp(-t * 4) * 0.4
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env
  }
  return generateWav(samples, sr)
}

function playBuffer(wavBuffer) {
  var base64 = wx.arrayBufferToBase64(wavBuffer)
  var filePath = wx.env.USER_DATA_PATH + '/sfx_' + Date.now() + '.wav'

  var fs = wx.getFileSystemManager()
  try {
    fs.writeFileSync(filePath, wx.base64ToArrayBuffer(base64), 'binary')
  } catch (e) {
    return
  }

  var audio = wx.createInnerAudioContext()
  audio.src = filePath
  audio.volume = 0.6
  audio.onEnded(function () {
    audio.destroy()
    try { fs.unlinkSync(filePath) } catch (e) {}
  })
  audio.onError(function () {
    audio.destroy()
    try { fs.unlinkSync(filePath) } catch (e) {}
  })
  audio.play()
}

// Pre-generate all sound buffers
var _buffers = {}

function getBuffer(name) {
  if (!_buffers[name]) {
    switch (name) {
      case 'click': _buffers[name] = clickSound(); break
      case 'success': _buffers[name] = successSound(); break
      case 'fail': _buffers[name] = failSound(); break
      case 'coin': _buffers[name] = coinSound(); break
      case 'bubble': _buffers[name] = bubbleSound(); break
      case 'tap': _buffers[name] = tapSound(); break
      case 'go': _buffers[name] = goSound(); break
      case 'levelup': _buffers[name] = levelUpSound(); break
    }
  }
  return _buffers[name]
}

module.exports = {
  play: function (name) {
    var buf = getBuffer(name)
    if (buf) playBuffer(buf)
  }
}
