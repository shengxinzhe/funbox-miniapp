var problems = [
  {
    scene: '一辆电车即将撞向5个人',
    optionA: '拉下拉杆，电车转向撞死1个人',
    optionB: '什么都不做，电车撞死5个人',
    emoji: '🚃'
  },
  {
    scene: '一辆电车即将撞向5个陌生人',
    optionA: '把身边的胖子推下桥挡住电车',
    optionB: '什么都不做，5个人被撞',
    emoji: '🌉'
  },
  {
    scene: '电车即将撞向世界上最后一只大熊猫',
    optionA: '转向，撞倒一座空的博物馆',
    optionB: '什么都不做，大熊猫没了',
    emoji: '🐼'
  },
  {
    scene: '电车即将撞向一台存有全人类知识的超级电脑',
    optionA: '转向，撞毁一个装满猫咪视频的服务器',
    optionB: '什么都不做，人类知识消失',
    emoji: '💻'
  },
  {
    scene: '电车即将撞向你未来的自己',
    optionA: '转向，撞向你过去的自己',
    optionB: '什么都不做，未来的你消失',
    emoji: '⏳'
  },
  {
    scene: '电车即将撞向制造这辆电车的工程师',
    optionA: '转向，撞向设计电车轨道的规划师',
    optionB: '什么都不做',
    emoji: '🔧'
  },
  {
    scene: '电车即将撞向一群正在看手机的人（他们完全没注意到）',
    optionA: '按喇叭（但喇叭声是抖音神曲）',
    optionB: '什么都不做（反正他们也没在看路）',
    emoji: '📱'
  },
  {
    scene: '电车即将撞向5个哲学家，他们正在讨论电车难题',
    optionA: '转向，让他们亲身体验自己的研究课题',
    optionB: '什么都不做，但大喊"这是实践检验！"',
    emoji: '🤔'
  },
  {
    scene: '电车即将撞向一个正在画完美圆的人',
    optionA: '转向，但会撞毁他99.9%的完美圆',
    optionB: '什么都不做，让他带着完美圆离开',
    emoji: '⭕'
  },
  {
    scene: '电车轨道分成两条，每条上都有5个人',
    optionA: '往左（那5个人穿红色衣服）',
    optionB: '往右（那5个人穿蓝色衣服）',
    emoji: '🔴🔵'
  },
  {
    scene: '电车即将撞向一群在排队买奶茶的人',
    optionA: '转向，撞毁奶茶店',
    optionB: '什么都不做（至少他们手里还有奶茶）',
    emoji: '🧋'
  },
  {
    scene: '电车即将撞向一个时间旅行者，他声称来阻止更大的灾难',
    optionA: '转向（万一他说的是真的呢）',
    optionB: '什么都不做（时间旅行者应该能自己搞定）',
    emoji: '🕰️'
  },
  {
    scene: '电车即将撞向正在写代码的程序员，他的代码还没保存',
    optionA: '转向（给他3秒按Ctrl+S）',
    optionB: '什么都不做（他应该开了自动保存吧？）',
    emoji: '⌨️'
  },
  {
    scene: '电车即将撞向1只狗和3只猫',
    optionA: '转向，撞向3只狗和1只猫',
    optionB: '什么都不做',
    emoji: '🐕🐈'
  },
  {
    scene: '你自己被绑在轨道上，只有你能拉杆',
    optionA: '拉杆，电车撞向一面墙（但你明天不用上班了）',
    optionB: '不拉（你明天还有个重要会议...）',
    emoji: '😰'
  },
  {
    scene: '电车即将撞向一群正在自拍的网红',
    optionA: '转向（但你会出现在他们的短视频里）',
    optionB: '什么都不做（这条视频会爆火）',
    emoji: '🤳'
  },
  {
    scene: '电车上坐满了乘客，前方轨道断了',
    optionA: '紧急刹车（乘客会摔倒受伤）',
    optionB: '加速（也许能飞过去？物理学可能站在你这边）',
    emoji: '🎢'
  },
  {
    scene: '电车即将撞向一个复制人，他和你长得一模一样',
    optionA: '转向（不能让"自己"出事）',
    optionB: '什么都不做（世界上不需要两个你）',
    emoji: '👥'
  },
  {
    scene: 'AI控制的电车出了故障，它问你该怎么办',
    optionA: '告诉AI"优先保护人类"',
    optionB: '告诉AI"按概率最优解处理"',
    emoji: '🤖'
  },
  {
    scene: '电车即将撞向正在讨论AI是否有意识的两个专家',
    optionA: '让AI自己决定是否转向（测试它有没有道德意识）',
    optionB: '人类做决定（不能把道德交给AI）',
    emoji: '🧠'
  }
]

// Shuffle helper
function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t
  }
  return arr
}

Page({
  data: {
    phase: 'intro',       // intro, playing, result
    current: 0,
    total: 10,
    problem: null,
    choices: [],           // {idx, choice}
    fadeIn: false,
    cardAnim: '',
    chosen: '',            // 'A' or 'B' for animation
    pctA: 0,
    pctB: 0,
    showPct: false,
    streak: 0
  },

  onLoad: function () {
    var streak = wx.getStorageSync('trolley_streak') || 0
    this.setData({ streak: streak })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  startGame: function () {
    this._problems = shuffle(problems.slice()).slice(0, 10)
    this.setData({
      phase: 'playing',
      current: 0,
      choices: [],
      problem: this._problems[0],
      cardAnim: 'card-enter',
      chosen: '',
      showPct: false
    })
    wx.vibrateShort({ type: 'light' })
  },

  choose: function (e) {
    if (this.data.chosen) return
    var choice = e.currentTarget.dataset.choice
    var choices = this.data.choices.concat([{
      idx: this.data.current,
      choice: choice
    }])

    // Simulate global vote percentages (deterministic per problem index)
    var seed = this._problems[this.data.current].scene.length
    var baseA = 30 + (seed * 7) % 40
    var pctA = choice === 'A' ? Math.min(baseA + 3, 97) : Math.max(baseA - 3, 3)

    this.setData({
      chosen: choice,
      choices: choices,
      pctA: pctA,
      pctB: 100 - pctA,
      showPct: true
    })
    wx.vibrateShort({ type: 'medium' })
  },

  nextProblem: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      var streak = this.data.streak + 1
      wx.setStorageSync('trolley_streak', streak)
      wx.setStorageSync('trolley_total', (wx.getStorageSync('trolley_total') || 0) + this.data.total)
      this.setData({ phase: 'result', streak: streak })
      wx.vibrateShort({ type: 'heavy' })
      return
    }
    this.setData({
      current: next,
      problem: this._problems[next],
      cardAnim: '',
      chosen: '',
      showPct: false
    })
    var self = this
    setTimeout(function () {
      self.setData({ cardAnim: 'card-enter' })
    }, 30)
  },

  restart: function () {
    this.startGame()
  },

  onShareAppMessage: function () {
    return {
      title: '这些电车难题太荒诞了！你会怎么选？',
      path: '/pages/trolley/trolley'
    }
  },

  onShareTimeline: function () {
    return { title: '荒诞电车难题 - 智变纪趣味实验室' }
  }
})