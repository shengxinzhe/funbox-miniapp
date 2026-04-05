var ALL_FACTS = [
  { text: '蜂蜜永远不会变质，考古学家曾发现3000年前的蜂蜜仍可食用', real: true, explain: '蜂蜜的低含水量和酸性环境使细菌无法生存' },
  { text: '人一生中会吞下大约8只蜘蛛', real: false, explain: '这是1993年的网络谣言，蜘蛛会主动远离人类的震动和气息' },
  { text: '章鱼有三颗心脏', real: true, explain: '两颗鳃心脏负责把血液泵到鳃部，一颗主心脏负责全身血液循环' },
  { text: '金鱼的记忆只有7秒', real: false, explain: '金鱼的记忆可以持续数月，它们能学会走迷宫和辨识主人' },
  { text: '闪电永远不会击中同一个地方两次', real: false, explain: '帝国大厦每年被闪电击中约20-25次' },
  { text: '人的胃酸可以溶解金属', real: true, explain: '胃酸（盐酸）的pH值约为1-2，可以溶解锌等金属' },
  { text: '长城是太空中唯一能看到的人造建筑', real: false, explain: '从太空中用肉眼看不到长城，但能看到高速公路和城市' },
  { text: '香蕉其实是一种浆果，而草莓不是', real: true, explain: '植物学上浆果由单个子房发育，香蕉符合但草莓是聚合果' },
  { text: '水母是地球上出现最早的多细胞动物之一，存在已超过5亿年', real: true, explain: '水母化石可追溯到5亿多年前的寒武纪时期' },
  { text: '人类只使用了大脑的10%', real: false, explain: '脑成像研究表明人类使用了大脑的几乎所有区域' },
  { text: '维纳斯捕蝇草只生长在南北卡罗来纳州方圆120公里范围内', real: true, explain: '它是极少数自然分布范围如此狭小的植物之一' },
  { text: '一群火烈鸟被称为"flamboyance"（华丽）', real: true, explain: '这个集体名词来源于火烈鸟鲜艳的外观' },
  { text: '牛奶浇在植物上可以帮助它们生长', real: true, explain: '稀释的牛奶可以为植物提供钙等营养，也能预防某些真菌病' },
  { text: '在太空中，宇航员会变高2-5厘米', real: true, explain: '失重环境下脊柱不受压力，椎间盘膨胀导致身高增加' },
  { text: '鸵鸟遇到危险会把头埋进沙子', real: false, explain: '鸵鸟遇到危险会跑或用强力的腿踢击，从不把头埋进沙子' },
  { text: '热水比冷水结冰更快', real: true, explain: '这叫姆潘巴效应，在特定条件下确实会发生，但机理仍在研究中' },
  { text: 'WiFi是"Wireless Fidelity"的缩写', real: false, explain: 'WiFi并不代表任何东西，它只是一个品牌名称' },
  { text: '树懒每周只排便一次，并且会冒着生命危险爬下树来排便', real: true, explain: '科学家认为这可能与维护毛发上的共生藻类生态有关' },
  { text: '人的指纹在一生中会不断变化', real: false, explain: '指纹在胎儿时期形成后终身不变，除非深层皮肤受损' },
  { text: '地球上蚂蚁的总重量大约等于人类的总重量', real: true, explain: '据估计地球有约20万亿只蚂蚁，总生物量约8000万吨' },
  { text: '北极熊的毛其实是透明的，不是白色的', real: true, explain: '每根毛发是空心透明的，因散射光线而呈现白色' },
  { text: '吃胡萝卜能改善夜视能力', real: false, explain: '这是二战英国为隐藏雷达技术而编造的宣传故事' },
  { text: '一天其实不是精确的24小时', real: true, explain: '地球自转一圈约23小时56分4秒，我们用的24小时是太阳日' },
  { text: '所有的北极熊都是左撇子', real: false, explain: '没有科学证据支持这一说法，研究表明它们两只爪都使用' },
  { text: '猫每天花约70%的时间在睡觉', real: true, explain: '猫平均每天睡12-16小时，老年猫睡得更多' },
  { text: '钻石是由煤炭形成的', real: false, explain: '钻石主要由地幔深处的碳在高温高压下形成，远早于煤炭出现' },
  { text: '世界上最短的战争只持续了38分钟', real: true, explain: '1896年英桑战争，桑给巴尔苏丹国在38分钟后投降' },
  { text: '打喷嚏时心脏会短暂停止跳动', real: false, explain: '打喷嚏可能改变心律但心脏不会停跳' },
  { text: '海马是地球上唯一由雄性怀孕和分娩的动物', real: true, explain: '雌海马将卵产在雄海马的育儿袋中，由雄性孵化' },
  { text: '巧克力对狗来说是有毒的', real: true, explain: '巧克力中的可可碱对狗的心脏和神经系统有毒性' }
]

function shuffle(arr) {
  var a = arr.slice()
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}

Page({
  data: {
    phase: 'intro',
    current: 0,
    total: 15,
    fact: null,
    answered: false,
    wasCorrect: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    fadeIn: false,
    cardAnim: '',
    bestScore: 0
  },

  onLoad: function () {
    var best = wx.getStorageSync('factfiction_best') || 0
    this.setData({ bestScore: best })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this._facts = shuffle(ALL_FACTS).slice(0, 15)
    this.setData({
      phase: 'playing',
      current: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      fact: this._facts[0],
      answered: false,
      cardAnim: 'card-enter'
    })
    wx.vibrateShort({ type: 'light' })
  },

  answer: function (e) {
    if (this.data.answered) return
    var choice = e.currentTarget.dataset.choice === 'true'
    var correct = choice === this.data.fact.real
    var combo = correct ? this.data.combo + 1 : 0
    var score = this.data.score + (correct ? 10 + Math.min(combo, 5) * 2 : 0)

    this.setData({
      answered: true,
      wasCorrect: correct,
      score: score,
      combo: combo,
      maxCombo: Math.max(this.data.maxCombo, combo),
      correctCount: this.data.correctCount + (correct ? 1 : 0)
    })
    wx.vibrateShort({ type: correct ? 'light' : 'heavy' })
  },

  nextFact: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      if (this.data.score > this.data.bestScore) {
        wx.setStorageSync('factfiction_best', this.data.score)
      }
      this.setData({
        phase: 'result',
        bestScore: Math.max(this.data.bestScore, this.data.score)
      })
      wx.vibrateShort({ type: 'heavy' })
      return
    }
    this.setData({
      current: next,
      fact: this._facts[next],
      answered: false,
      cardAnim: ''
    })
    var self = this
    setTimeout(function () { self.setData({ cardAnim: 'card-enter' }) }, 30)
  },

  restart: function () { this.startGame() },

  onShareAppMessage: function () {
    return {
      title: '真假冷知识：我答对了' + this.data.correctCount + '/15！你能辨别真假吗？',
      path: '/pages/fact-or-fiction/fact-or-fiction'
    }
  },
  onShareTimeline: function () {
    return { title: '真假冷知识 - 智变纪趣味实验室' }
  }
})