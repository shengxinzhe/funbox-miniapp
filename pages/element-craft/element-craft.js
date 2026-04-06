// Element combination recipes: [a, b] => result
// Elements: emoji + name
var ELEMENTS = {
  water: { emoji: '\ud83d\udca7', name: '\u6c34' },
  fire: { emoji: '\ud83d\udd25', name: '\u706b' },
  earth: { emoji: '\ud83c\udf0d', name: '\u571f' },
  air: { emoji: '\ud83d\udca8', name: '\u98ce' },
  steam: { emoji: '\u2668\ufe0f', name: '\u84b8\u6c14' },
  mud: { emoji: '\ud83d\udfe4', name: '\u6ce5' },
  lava: { emoji: '\ud83d\udfe0', name: '\u5ca9\u6d46' },
  dust: { emoji: '\ud83c\udf2b\ufe0f', name: '\u5c18\u57c3' },
  rain: { emoji: '\ud83c\udf27\ufe0f', name: '\u96e8' },
  stone: { emoji: '\ud83e\udea8', name: '\u77f3\u5934' },
  metal: { emoji: '\u2699\ufe0f', name: '\u91d1\u5c5e' },
  plant: { emoji: '\ud83c\udf31', name: '\u690d\u7269' },
  sand: { emoji: '\u23f3', name: '\u6c99' },
  glass: { emoji: '\ud83e\udea9', name: '\u7acb\u7483' },
  cloud: { emoji: '\u2601\ufe0f', name: '\u4e91' },
  snow: { emoji: '\u2744\ufe0f', name: '\u96ea' },
  ice: { emoji: '\ud83e\uddca', name: '\u51b0' },
  tree: { emoji: '\ud83c\udf33', name: '\u6811' },
  wood: { emoji: '\ud83e\udeb5', name: '\u6728\u5934' },
  charcoal: { emoji: '\u25aa\ufe0f', name: '\u70ad' },
  lightning: { emoji: '\u26a1', name: '\u95ea\u7535' },
  energy: { emoji: '\ud83d\udd0b', name: '\u80fd\u91cf' },
  life: { emoji: '\ud83e\udda0', name: '\u751f\u547d' },
  flower: { emoji: '\ud83c\udf38', name: '\u82b1' },
  mountain: { emoji: '\u26f0\ufe0f', name: '\u5c71' },
  volcano: { emoji: '\ud83c\udf0b', name: '\u706b\u5c71' },
  ocean: { emoji: '\ud83c\udf0a', name: '\u6d77\u6d0b' },
  fish: { emoji: '\ud83d\udc1f', name: '\u9c7c' },
  bird: { emoji: '\ud83d\udc26', name: '\u9e1f' },
  egg: { emoji: '\ud83e\udd5a', name: '\u86cb' },
  brick: { emoji: '\ud83e\uddf1', name: '\u7816' },
  house: { emoji: '\ud83c\udfe0', name: '\u623f\u5c4b' },
  sword: { emoji: '\u2694\ufe0f', name: '\u5251' },
  diamond: { emoji: '\ud83d\udc8e', name: '\u94bb\u77f3' },
  sun: { emoji: '\u2600\ufe0f', name: '\u592a\u9633' },
  moon: { emoji: '\ud83c\udf19', name: '\u6708\u4eae' },
  star: { emoji: '\u2b50', name: '\u661f\u661f' },
  human: { emoji: '\ud83e\uddd1', name: '\u4eba\u7c7b' },
  tool: { emoji: '\ud83d\udd28', name: '\u5de5\u5177' },
  wheel: { emoji: '\u2638\ufe0f', name: '\u8f6e\u5b50' },
  paper: { emoji: '\ud83d\udcc4', name: '\u7eb8' },
  book: { emoji: '\ud83d\udcd6', name: '\u4e66' },
  idea: { emoji: '\ud83d\udca1', name: '\u7075\u611f' },
  music: { emoji: '\ud83c\udfb5', name: '\u97f3\u4e50' },
  love: { emoji: '\u2764\ufe0f', name: '\u7231' },
  time: { emoji: '\u231b', name: '\u65f6\u95f4' },
  phoenix: { emoji: '\ud83d\udd25', name: '\u51e4\u51f0' },
  dragon: { emoji: '\ud83d\udc09', name: '\u9f99' },
  robot: { emoji: '\ud83e\udd16', name: '\u673a\u5668\u4eba' },
  rocket: { emoji: '\ud83d\ude80', name: '\u706b\u7bad' },
  alien: { emoji: '\ud83d\udc7d', name: '\u5916\u661f\u4eba' },
  internet: { emoji: '\ud83c\udf10', name: '\u4e92\u8054\u7f51' },
  ai: { emoji: '\ud83e\udde0', name: 'AI' }
}

// Recipes: sorted pair key => result key
var RECIPES = {
  'fire+water': 'steam',
  'earth+water': 'mud',
  'earth+fire': 'lava',
  'air+earth': 'dust',
  'air+water': 'rain',
  'fire+stone': 'metal',
  'earth+rain': 'plant',
  'lava+water': 'stone',
  'fire+sand': 'glass',
  'air+steam': 'cloud',
  'cloud+water': 'rain',
  'cloud+cold': 'snow',
  'cold+water': 'ice',
  'earth+plant': 'tree',
  'fire+tree': 'charcoal',
  'tree+tool': 'wood',
  'cloud+energy': 'lightning',
  'fire+lightning': 'energy',
  'life+mud': 'human',
  'energy+mud': 'life',
  'plant+water': 'flower',
  'earth+stone': 'mountain',
  'fire+mountain': 'volcano',
  'rain+water': 'ocean',
  'life+water': 'fish',
  'air+life': 'bird',
  'bird+life': 'egg',
  'fire+mud': 'brick',
  'brick+wood': 'house',
  'fire+metal': 'sword',
  'lava+stone': 'diamond',
  'energy+fire': 'sun',
  'moon+sun': 'star',
  'air+stone': 'sand',
  'dust+sun': 'moon',
  'human+metal': 'tool',
  'metal+stone': 'wheel',
  'plant+wood': 'paper',
  'human+paper': 'book',
  'energy+human': 'idea',
  'air+idea': 'music',
  'human+human': 'love',
  'sand+time': 'time',
  'glass+sand': 'time',
  'bird+fire': 'phoenix',
  'fire+life': 'dragon',
  'human+metal+energy': 'robot',
  'human+tool': 'robot',
  'energy+metal': 'rocket',
  'life+star': 'alien',
  'book+lightning': 'internet',
  'human+idea': 'ai',
  'energy+idea': 'ai'
}

function getRecipeKey(a, b) {
  var arr = [a, b].sort()
  return arr[0] + '+' + arr[1]
}

Page({
  data: {
    phase: 'intro',
    discovered: [],
    discoveredMap: {},
    totalPossible: 0,
    selectedA: null,
    selectedB: null,
    resultElement: null,
    showResult: false,
    isNew: false,
    fadeIn: false,
    bestCount: 0,
    hintText: ''
  },

  onLoad: function () {
    var best = wx.getStorageSync('elementcraft_best') || 0
    // Count unique results in recipes
    var results = {}
    var keys = Object.keys(RECIPES)
    for (var i = 0; i < keys.length; i++) {
      results[RECIPES[keys[i]]] = true
    }
    this.setData({
      bestCount: best,
      totalPossible: Object.keys(results).length + 4 // +4 base elements
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    var base = ['water', 'fire', 'earth', 'air']
    var discovered = []
    var discoveredMap = {}
    for (var i = 0; i < base.length; i++) {
      var el = ELEMENTS[base[i]]
      discovered.push({ key: base[i], emoji: el.emoji, name: el.name })
      discoveredMap[base[i]] = true
    }
    this.setData({
      phase: 'playing',
      discovered: discovered,
      discoveredMap: discoveredMap,
      selectedA: null,
      selectedB: null,
      resultElement: null,
      showResult: false,
      hintText: ''
    })
    wx.vibrateShort({ type: 'light' })
  },

  tapElement: function (e) {
    if (this.data.showResult) return
    var key = e.currentTarget.dataset.key
    var el = ELEMENTS[key]

    if (!this.data.selectedA) {
      this.setData({ selectedA: { key: key, emoji: el.emoji, name: el.name }, hintText: '' })
      return
    }

    if (this.data.selectedA.key === key && !this.data.selectedB) {
      // Same element selected twice
      this.setData({ selectedB: { key: key, emoji: el.emoji, name: el.name } })
    } else if (!this.data.selectedB) {
      this.setData({ selectedB: { key: key, emoji: el.emoji, name: el.name } })
    } else {
      return
    }

    // Try combine
    var self = this
    setTimeout(function () { self._tryCombine() }, 200)
  },

  _tryCombine: function () {
    var a = this.data.selectedA.key
    var b = this.data.selectedB.key
    var recipeKey = getRecipeKey(a, b)
    var resultKey = RECIPES[recipeKey]

    if (resultKey && ELEMENTS[resultKey]) {
      var el = ELEMENTS[resultKey]
      var isNew = !this.data.discoveredMap[resultKey]
      var discovered = this.data.discovered
      var discoveredMap = this.data.discoveredMap

      if (isNew) {
        discovered = discovered.concat([{ key: resultKey, emoji: el.emoji, name: el.name }])
        // Create a new object to avoid mutating data before setData
        var newMap = {}
        var mapKeys = Object.keys(discoveredMap)
        for (var mi = 0; mi < mapKeys.length; mi++) newMap[mapKeys[mi]] = true
        newMap[resultKey] = true
        discoveredMap = newMap

        if (discovered.length > this.data.bestCount) {
          wx.setStorageSync('elementcraft_best', discovered.length)
        }
      }

      this.setData({
        resultElement: { key: resultKey, emoji: el.emoji, name: el.name },
        showResult: true,
        isNew: isNew,
        discovered: discovered,
        discoveredMap: discoveredMap,
        bestCount: Math.max(this.data.bestCount, discovered.length)
      })
      wx.vibrateShort({ type: isNew ? 'heavy' : 'light' })
    } else {
      this.setData({
        resultElement: null,
        showResult: true,
        isNew: false,
        hintText: '\u65e0\u6cd5\u5408\u6210\uff0c\u8bd5\u8bd5\u5176\u4ed6\u7ec4\u5408\u5427'
      })
      wx.vibrateShort({ type: 'heavy' })
    }
  },

  dismissResult: function () {
    this.setData({
      selectedA: null,
      selectedB: null,
      resultElement: null,
      showResult: false,
      hintText: ''
    })
  },

  clearSelection: function () {
    this.setData({
      selectedA: null,
      selectedB: null,
      hintText: ''
    })
  },

  restart: function () {
    this.startGame()
  },

  onShareAppMessage: function () {
    return {
      title: '\u5143\u7d20\u5408\u6210\uff1a\u6211\u53d1\u73b0\u4e86' + this.data.discovered.length + '\u79cd\u5143\u7d20\uff01\u4f60\u80fd\u5408\u6210\u51e0\u79cd\uff1f',
      path: '/pages/element-craft/element-craft'
    }
  },
  onShareTimeline: function () {
    return { title: '\u5143\u7d20\u5408\u6210 - \u667a\u53d8\u7eaa\u8da3\u5473\u5b9e\u9a8c\u5ba4' }
  }
})
