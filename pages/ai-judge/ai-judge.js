// pages/ai-judge/ai-judge.js
// AI vs 人类：谁画的？

var QUESTIONS = [
  {
    id: 1,
    theme: '星空',
    descA: '浓郁笔触的旋涡状夜空，远处村庄灯火微弱',
    descB: '极度对称的银河全景，每颗星都均匀分布',
    answer: 'B',
    explain: 'AI生成的星空往往过于完美对称，真人画作笔触更具情感表现力'
  },
  {
    id: 2,
    theme: '猫咪肖像',
    descA: '毛发细节极致清晰，眼睛呈现完美的宝石光泽',
    descB: '线条松散的水彩猫，耳朵略有不对称',
    answer: 'A',
    explain: 'AI倾向于生成超真实的毛发质感和过于完美的高光效果'
  },
  {
    id: 3,
    theme: '城市街景',
    descA: '雨后反光的街道，行人撑伞，远处霓虹灯模糊',
    descB: '每块砖石纹理都极为精细，建筑透视完美无误',
    answer: 'B',
    explain: 'AI对建筑细节的渲染往往过于精确，真实绘画更注重氛围感'
  },
  {
    id: 4,
    theme: '花卉静物',
    descA: '花瓣上有真实的枯萎痕迹和虫洞',
    descB: '每朵花都完美绽放，花瓣呈数学般的对称',
    answer: 'B',
    explain: 'AI生成的花朵通常过于完美，缺少自然界的不完美细节'
  },
  {
    id: 5,
    theme: '人物手部',
    descA: '手指关节分明、比例自然，有细微皱纹',
    descB: '手指数量微妙偏差，指甲形状不太一致',
    answer: 'B',
    explain: '手部一直是AI绘画的难点，常出现多余手指或不自然的关节'
  },
  {
    id: 6,
    theme: '水下珊瑚',
    descA: '珊瑚颜色过渡极为平滑，光线散射非常均匀',
    descB: '珊瑚有不规则断裂，附着藻类和沙粒',
    answer: 'A',
    explain: 'AI生成的水下场景光线过于完美，真实珊瑚有自然的瑕疵'
  },
  {
    id: 7,
    theme: '山水画',
    descA: '留白大胆，笔锋干枯处自然飞白',
    descB: '山峦层叠极其细密，每棵松树都精确渲染',
    answer: 'B',
    explain: 'AI难以理解中国画的留白和飞白意境，倾向于填满细节'
  },
  {
    id: 8,
    theme: '日落海面',
    descA: '色彩渐变极为平滑，云层完美对称分布',
    descB: '色块大胆拼贴，笔触可见粗犷的油画质感',
    answer: 'A',
    explain: 'AI生成的日落渐变过于丝滑，人类画作更具有笔触的力度'
  },
  {
    id: 9,
    theme: '复古海报',
    descA: '文字完全清晰可读，字体排版无任何错误',
    descB: '部分文字出现乱码或不存在的字符',
    answer: 'B',
    explain: 'AI在生成包含文字的图像时常出现拼写错误或虚构文字'
  },
  {
    id: 10,
    theme: '森林小径',
    descA: '光影交错自然，落叶随意散布地面',
    descB: '光束以极规则的角度穿透树冠，地面纹理重复模式明显',
    answer: 'B',
    explain: 'AI图像常出现重复纹理模式，尤其是在大面积相似区域'
  },
  {
    id: 11,
    theme: '宇航员',
    descA: '头盔面罩反射出整个环境，连细小螺栓都完美渲染',
    descB: '面罩反射略有变形，肩部补丁有磨损痕迹',
    answer: 'A',
    explain: 'AI倾向于渲染极度精细的反射效果，真实画作细节更随性'
  },
  {
    id: 12,
    theme: '甜点蛋糕',
    descA: '奶油质感极为真实，光泽完美均匀',
    descB: '奶油裱花略不规则，盘子边缘有一点污渍',
    answer: 'A',
    explain: 'AI生成的食物图片往往看起来"太完美"，缺少制作过程的痕迹'
  },
  {
    id: 13,
    theme: '涂鸦墙',
    descA: '喷漆边缘有真实的模糊渐变和滴落痕迹',
    descB: '每个字母的喷漆效果完全一致，色彩过渡极为规律',
    answer: 'B',
    explain: 'AI模拟涂鸦时缺少真实喷漆的不可控随机性'
  },
  {
    id: 14,
    theme: '婴儿肖像',
    descA: '皮肤质感极度真实但光线过于完美',
    descB: '皮肤色调微妙不均匀，耳朵有自然的红晕',
    answer: 'A',
    explain: 'AI人像的皮肤往往呈现一种"蜡像般"的过度光滑质感'
  },
  {
    id: 15,
    theme: '玻璃器皿',
    descA: '折射和反射完美符合物理光学规律',
    descB: '部分折射角度不太合理，光线穿透路径有微妙矛盾',
    answer: 'B',
    explain: 'AI对复杂玻璃折射的理解不完善，常产生光学上的小矛盾'
  },
  {
    id: 16,
    theme: '古代战场',
    descA: '盔甲上有真实的凹痕和锈迹，战场灰尘弥漫',
    descB: '所有士兵盔甲样式高度一致，战场构图过于戏剧化',
    answer: 'B',
    explain: 'AI倾向于"英雄式"构图和统一化的装备渲染'
  },
  {
    id: 17,
    theme: '微距昆虫',
    descA: '翅膀纹路精确到不可思议的程度，背景虚化完美',
    descB: '复眼中有微小的不规则反射，触角有自然弯曲',
    answer: 'A',
    explain: 'AI微距图片的细节精度常超出现实摄影的能力范围'
  },
  {
    id: 18,
    theme: '抽象艺术',
    descA: '色块间有自然的油画媒介混合痕迹和画布纹理',
    descB: '色彩交界极为锐利，整体呈现数学分形般的规律',
    answer: 'B',
    explain: 'AI抽象画虽然好看但往往缺少物理媒介的真实感'
  },
  {
    id: 19,
    theme: '雪山风景',
    descA: '积雪纹理在不同光照区域呈现微妙的蓝紫色调',
    descB: '雪山的纹理在远近景保持相同的精度和细节',
    answer: 'B',
    explain: 'AI常忽略大气透视效应，远景和近景细节程度相同'
  },
  {
    id: 20,
    theme: '科幻飞船',
    descA: '飞船表面有使用磨损痕迹和不对称的改装部件',
    descB: '飞船设计极为对称精美，表面有微妙的不合理拼接',
    answer: 'B',
    explain: 'AI飞船设计虽然华丽但结构上常有不合逻辑的连接方式'
  },
  {
    id: 21,
    theme: '老人皱纹',
    descA: '皮肤每一条皱纹都极为清晰，但整体有"油画滤镜"感',
    descB: '皱纹深浅不一，面部有不对称的老年斑',
    answer: 'A',
    explain: 'AI人像往往带有一种特殊的"艺术增强"感，过度美化细节'
  },
  {
    id: 22,
    theme: '废弃工厂',
    descA: '锈迹分布极为自然，墙上有真实的水渍痕迹',
    descB: '所有破损位置都过于"美学化"，像是设计过的废墟',
    answer: 'B',
    explain: 'AI生成的废墟场景往往过于"精心安排"，缺少真实的随机破败感'
  },
  {
    id: 23,
    theme: '书法作品',
    descA: '笔画有真实的墨色浓淡变化和飞白效果',
    descB: '字形优美但笔画衔接处的墨迹不太自然',
    answer: 'B',
    explain: 'AI难以模拟真实书法的运笔节奏和墨水在宣纸上的自然扩散'
  },
  {
    id: 24,
    theme: '外星景观',
    descA: '地表纹理有明显的重复图案，天空色彩渐变丝滑',
    descB: '岩石风化痕迹独特，地表有不规则的裂缝',
    answer: 'A',
    explain: 'AI在虚构场景中更容易暴露重复纹理的问题'
  },
  {
    id: 25,
    theme: '水墨鱼虾',
    descA: '虾须用极细的线条一笔勾出，浓淡干湿自然变化',
    descB: '虾身结构精确但墨色变化略显机械均匀',
    answer: 'B',
    explain: 'AI模仿水墨画时难以还原真实的用墨技法和运笔气韵'
  },
  {
    id: 26,
    theme: '彩色烟雾',
    descA: '烟雾扩散极为均匀对称，颜色过渡梦幻完美',
    descB: '烟雾形态不规则，有气流扰动产生的随机卷曲',
    answer: 'A',
    explain: 'AI烟雾往往过于"理想化"，真实烟雾受气流影响更加混乱'
  },
  {
    id: 27,
    theme: '动漫角色',
    descA: '五官比例精确，发丝线条极为流畅',
    descB: '角色动作略显僵硬，配饰细节有不一致之处',
    answer: 'B',
    explain: 'AI动漫角色常在手部动作和配饰一致性上出问题'
  },
  {
    id: 28,
    theme: '古典油画',
    descA: '画面有真实的龟裂纹和颜料堆积的肌理',
    descB: '色彩浑厚但画面过于"干净"，缺少时间痕迹',
    answer: 'B',
    explain: 'AI无法自然模拟油画数百年自然老化的龟裂肌理'
  },
  {
    id: 29,
    theme: '热带鹦鹉',
    descA: '羽毛颜色过渡极为平滑，每根羽毛都精确渲染',
    descB: '羽毛有自然的凌乱，喙部有细微的磨损痕迹',
    answer: 'A',
    explain: 'AI鸟类图片的羽毛通常呈现超越真实的完美质感'
  },
  {
    id: 30,
    theme: '赛博朋克城市',
    descA: '霓虹招牌上的文字清晰可读且语法正确',
    descB: '霓虹文字有乱码或不存在的字符混合',
    answer: 'B',
    explain: '赛博朋克场景中的文字是AI的经典弱点，常生成虚构文字'
  }
]

// 每局随机抽取的题目数
var ROUND_COUNT = 10

function shuffle(arr) {
  var result = arr.slice()
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

Page({
  data: {
    phase: 'intro',   // intro | playing | explain | result
    questions: [],
    current: 0,
    total: ROUND_COUNT,
    score: 0,
    chosen: '',
    showExplain: false,
    isCorrect: false,
    currentQ: null,
    combo: 0,
    maxCombo: 0,
    particles: [],
    shakeA: false,
    shakeB: false,
    fadeIn: false,
    scoreAnim: false
  },

  onLoad: function () {
    this.setData({ fadeIn: true })
  },

  startGame: function () {
    var picked = shuffle(QUESTIONS).slice(0, ROUND_COUNT)
    // 随机交换A/B顺序
    var processed = picked.map(function (q) {
      if (Math.random() > 0.5) {
        return {
          id: q.id,
          theme: q.theme,
          descA: q.descB,
          descB: q.descA,
          answer: q.answer === 'A' ? 'B' : 'A',
          explain: q.explain
        }
      }
      return q
    })
    this.setData({
      phase: 'playing',
      questions: processed,
      current: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      chosen: '',
      showExplain: false,
      currentQ: processed[0],
      fadeIn: false
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  choose: function (e) {
    if (this.data.chosen) return
    var choice = e.currentTarget.dataset.choice
    var q = this.data.currentQ
    var correct = choice === q.answer
    var newScore = this.data.score + (correct ? 1 : 0)
    var newCombo = correct ? this.data.combo + 1 : 0
    var maxCombo = Math.max(this.data.maxCombo, newCombo)

    var particles = []
    if (correct) {
      for (var i = 0; i < 6; i++) {
        particles.push({
          id: i,
          x: Math.random() * 600 + 75,
          y: Math.random() * 200 + 300,
          size: Math.random() * 12 + 6,
          delay: Math.random() * 300
        })
      }
    }

    this.setData({
      chosen: choice,
      isCorrect: correct,
      showExplain: true,
      score: newScore,
      combo: newCombo,
      maxCombo: maxCombo,
      scoreAnim: correct,
      particles: particles,
      shakeA: !correct && choice === 'A',
      shakeB: !correct && choice === 'B'
    })

    if (correct) {
      wx.vibrateShort({ type: 'light' })
    } else {
      wx.vibrateShort({ type: 'heavy' })
    }

    var self = this
    setTimeout(function () {
      self.setData({ scoreAnim: false, particles: [], shakeA: false, shakeB: false })
    }, 800)
  },

  nextQuestion: function () {
    var next = this.data.current + 1
    if (next >= this.data.total) {
      this.setData({ phase: 'result', fadeIn: false })
      var self = this
      setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
      return
    }
    this.setData({
      current: next,
      currentQ: this.data.questions[next],
      chosen: '',
      showExplain: false,
      isCorrect: false,
      fadeIn: false
    })
    var self = this
    setTimeout(function () { self.setData({ fadeIn: true }) }, 50)
  },

  getTitle: function () {
    var rate = this.data.score / this.data.total
    if (rate >= 0.9) return 'AI鉴赏大师'
    if (rate >= 0.7) return 'AI观察者'
    if (rate >= 0.5) return 'AI入门学徒'
    return 'AI小白鼠'
  },

  restart: function () {
    this.startGame()
  },

  backToHome: function () {
    wx.navigateBack()
  },

  onShareAppMessage: function () {
    var score = this.data.score
    var total = this.data.total
    return {
      title: '智变纪 | 我在AI鉴别测试中答对了' + score + '/' + total + '题，你能超过我吗？',
      path: '/pages/ai-judge/ai-judge'
    }
  },

  onShareTimeline: function () {
    return {
      title: '智变纪 | AI vs 人类：你能分辨谁画的吗？'
    }
  }
})
