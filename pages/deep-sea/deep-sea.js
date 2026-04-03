var sound = require('../../utils/sound')

var ZONES = [
  {
    name: '阳光层', from: 0, to: 200, color1: '#0077be', color2: '#005a8e',
    creatures: [
      { depth: 5, name: '海鸥', img: './images/seagull.jpg', bio: '海鸥是海洋表面最常见的鸟类,翼展可达1.5米。它们能在海面俯冲捕食鱼类,适应力极强,分布在全球各个海岸线。', size: 'large' },
      { depth: 15, name: '海豚', img: './images/dolphin.jpg', bio: '宽吻海豚是最聪明的海洋哺乳动物之一,群居生活。游速可达35km/h,能跳出水面3米高,用声纳定位猎物。大脑比人类还大。', size: 'large' },
      { depth: 30, name: '珊瑚礁', img: './images/coral.jpg', bio: '珊瑚礁被称为"海洋的热带雨林",仅占海洋面积不到1%,却养活了25%的海洋生物。珊瑚是动物,由数百万微小珊瑚虫组成。', size: 'medium' },
      { depth: 60, name: '小丑鱼', img: './images/clownfish.jpg', bio: '小丑鱼与海葵共生,身上的黏液可以保护它们不被海葵蛰伤。所有小丑鱼出生时都是雄性,群体中最大的会转变为雌性。', size: 'small' },
      { depth: 80, name: '绿海龟', img: './images/turtle.jpg', bio: '绿海龟是体型最大的硬壳海龟之一,体重可达300kg。它们能屏住呼吸长达5小时,每年迁徙2600公里回到出生的沙滩产卵。', size: 'large' },
      { depth: 120, name: '大白鲨', img: './images/shark.jpg', bio: '大白鲨是海洋顶级掠食者,体长可达6米,游速可达56km/h。拥有300多颗三角形锯齿状牙齿,能感应到十亿分之一浓度的血液。', size: 'large' },
      { depth: 170, name: '章鱼', img: './images/octopus.jpg', bio: '章鱼拥有3颗心脏和蓝色血液,是无脊椎动物中最聪明的。它们能改变身体颜色和纹理进行伪装,还能拧开瓶盖。', size: 'medium' }
    ],
    landmarks: [
      { depth: 40, text: '奥运会泳池深度' },
      { depth: 130, text: '休闲潜水极限' }
    ]
  },
  {
    name: '暮光层', from: 200, to: 1000, color1: '#005a8e', color2: '#001f3f',
    creatures: [
      { depth: 250, name: '狮子鱼', img: './images/lionfish.jpg', bio: '狮子鱼的美丽外表极具欺骗性,它们鳍条上的毒刺可以导致剧烈疼痛。原产于印度洋,如今已入侵大西洋,对当地生态造成严重威胁。', size: 'medium' },
      { depth: 350, name: '巨型鱿鱼', img: './images/squid.jpg', bio: '巨型鱿鱼的眼睛有篮球那么大,是动物界最大的眼球。它们生活在200-1000米深处,是抹香鲸的主要猎物。', size: 'large' },
      { depth: 500, name: '抹香鲸', img: './images/sperm-whale.jpg', bio: '抹香鲸拥有动物界最大的大脑,重达9kg。它们能下潜至2000米深处,屏息长达90分钟,是最深潜的哺乳动物。', size: 'large' },
      { depth: 700, name: '灯笼鱼', img: './images/deep-anglerfish.png', bio: '灯笼鱼(鮟鱇鱼)用头顶的生物发光器官吸引猎物。雄性体型极小,会永久寄生在雌性身上,融为一体,只提供精子。', size: 'medium' },
      { depth: 800, name: '鹦鹉螟', img: './images/nautilus.jpg', bio: '鹦鹉螟是活化石,在5亿年前就已存在,比恐龙还古老。它们用90多条触手捕食,壳内的气室可以调节浮力。', size: 'medium' },
      { depth: 900, name: '管水母', img: './images/siphonophore.jpg', bio: '管水母是世界上最长的动物,最长可达40米,比蓝鲸还长。它其实不是一只动物,而是由数千个微小个体组成的群体。', size: 'large' }
    ],
    landmarks: [
      { depth: 332, text: '人类自由潜水世界纪录' },
      { depth: 500, text: '帝国大厦的高度' },
      { depth: 828, text: '哈利法塔的高度 (世界最高建筑)' }
    ]
  },
  {
    name: '午夜层', from: 1000, to: 4000, color1: '#001f3f', color2: '#080810',
    creatures: [
      { depth: 1200, name: '琵琶鱼', img: './images/anglerfish.jpg', bio: '琵琶鱼(深海鮟鱇)生活在永恒黑暗中,头顶发光诱饵吸引猎物。嘴巴可以张开150度,能吞下比自己大两倍的猎物。', size: 'medium' },
      { depth: 1800, name: '尖牙鱼', img: './images/fangtooth.jpg', bio: '尖牙鱼拥有与身体比例最大的牙齿。它们生活在500-5000米深处,能承受巨大压力,是深海最凶猛的掠食者之一。', size: 'small' },
      { depth: 2200, name: '吞噬鳗', img: './images/gulper-eel.png', bio: '吞噬鳗的嘴巴可以张得比身体还大,能吞下比自己大的猎物。尾巴末端有发光器官,用来吸引猎物。', size: 'medium' },
      { depth: 2500, name: '管虫', img: './images/tubeworm.jpg', bio: '深海热泉管虫不需要阳光,靠体内共生细菌进行化学合成获取能量。它们没有嘴、没有胃、没有消化系统,却能长到2米以上。', size: 'medium' },
      { depth: 3000, name: '海蜘蛛', img: './images/sea-spider.jpg', bio: '深海海蜘蛛的腿展可达70厘米。由于深海高压和低温,它们的体型远大于浅水亲戚,这种现象叫"深海巨大化"。', size: 'medium' },
      { depth: 3500, name: '巨型等足虫', img: './images/isopod.jpg', bio: '巨型等足虫是深海的"西瓜虫",体长可达50厘米。它们是深海食腐动物,可以5年不进食,是极端环境生存的冠军。', size: 'large' },
      { depth: 3800, name: '深海盲虾', img: './images/blind-shrimp.jpg', bio: '深海盲虾的眼睛已经退化,但背部有特殊的感光器官,可以探测热液喷口的微弱光芒,在黑暗中找到食物来源。', size: 'small' }
    ],
    landmarks: [
      { depth: 1000, text: '永恒黑暗从这里开始' },
      { depth: 2250, text: '大西洋中脊深度' },
      { depth: 3800, text: '泰坦尼克号沉没深度' }
    ]
  },
  {
    name: '深渊层', from: 4000, to: 11000, color1: '#080810', color2: '#020204',
    creatures: [
      { depth: 4500, name: '铁甲蜗牛', img: './images/scaly-snail.jpg', bio: '铁甲蜗牛的壳上覆盖着硫化铁,是唯一已知使用铁元素作为外骨骼的动物。生活在印度洋深海热泉附近。', size: 'small' },
      { depth: 5500, name: '僵尸蠕虫', img: './images/zombie-worm.jpg', bio: '僵尸蠕虫(食骨蠕虫)以鲸鱼骨骼为食,没有嘴也没有胃。它们分泌酸性物质溶解骨骼,靠体内共生细菌吸收营养。', size: 'small' },
      { depth: 7000, name: '小飞象章鱼', img: './images/dumbo-octopus.jpg', bio: '小飞象章鱼因耳状鳍像大象耳朵而得名,是最深处的章鱼。它们不喷墨,而是用鳍像翅膀一样缓慢飞行。', size: 'medium' },
      { depth: 8178, name: '马里亚纳狮子鱼', img: './images/snailfish.png', bio: '马里亚纳狮子鱼是已知生活在最深处的鱼类,在8178米被发现。它们的身体像果冻一样透明柔软,以适应极端高压。', size: 'medium' },
      { depth: 8200, name: '深海水母', img: './images/deep-jellyfish.jpg', bio: '深海水母Deepstaria在8000米深处漂浮,伞状身体可以展开到60厘米。它们不需要触手捕食,而是像口袋一样包裹猎物。', size: 'large' },
      { depth: 9800, name: '深渊钩虾', img: './images/amphipod.jpg', bio: '深渊钩虾在接近万米深处仍然活跃,是极端环境下的甲壳动物。它们体内含有特殊酶,可以分解沉到海底的木质碎片。', size: 'small' },
      { depth: 10900, name: '极端微生物', img: './images/microbes.jpg', bio: '在挑战者深渊的海底,仍存在微生物群落。它们在1100个大气压下生存,以沉降的有机碎屑为食,证明了生命的顽强。', size: 'small' }
    ],
    landmarks: [
      { depth: 4267, text: '平均海洋深度' },
      { depth: 8848, text: '把珠穆朗玛峰倒过来放,峰顶在这里' },
      { depth: 10935, text: '挑战者深渊 -- 地球最深点' }
    ]
  }
]

var MAX_DEPTH = 11000
var RPX_PER_METER = 6

Page({
  data: {
    zones: [],
    currentDepth: 0,
    scrollTop: 0,
    showBio: false,
    bioCreature: null,
    bubbles: []
  },

  totalHeight: 0,
  bubbleTimer: null,
  bubbleId: 0,

  onLoad: function () {
    var zones = ZONES.map(function (z) {
      var range = z.to - z.from
      var height = range * RPX_PER_METER
      return {
        name: z.name,
        from: z.from,
        to: z.to,
        color1: z.color1,
        color2: z.color2,
        height: height,
        creatures: z.creatures.map(function (c) {
          return {
            img: c.img,
            name: c.name,
            bio: c.bio,
            depth: c.depth,
            size: c.size,
            offset: Math.floor(((c.depth - z.from) / range) * 100)
          }
        }),
        landmarks: z.landmarks.map(function (lm) {
          return {
            depth: lm.depth,
            text: lm.text,
            offset: Math.floor(((lm.depth - z.from) / range) * 100)
          }
        })
      }
    })
    this.totalHeight = MAX_DEPTH * RPX_PER_METER
    this.setData({ zones: zones })
    this.startBubbles()
  },

  startBubbles: function () {
    var self = this
    this.bubbleTimer = setInterval(function () {
      var id = ++self.bubbleId
      var x = Math.floor(Math.random() * 90) + 5
      var size = Math.floor(Math.random() * 16) + 8
      var duration = Math.floor(Math.random() * 3000) + 2000
      var bubbles = self.data.bubbles.concat([{
        id: id, x: x, size: size, duration: duration
      }])
      if (bubbles.length > 8) bubbles = bubbles.slice(-8)
      self.setData({ bubbles: bubbles })
      setTimeout(function () {
        var b = self.data.bubbles.filter(function (b) { return b.id !== id })
        self.setData({ bubbles: b })
      }, duration)
    }, 800)
  },

  onScroll: function (e) {
    var scrollTop = e.detail.scrollTop
    var ratio = scrollTop / (this.totalHeight * 0.5)
    var depth = Math.min(Math.floor(ratio * MAX_DEPTH), MAX_DEPTH)
    if (Math.abs(depth - this.data.currentDepth) > 3) {
      this.setData({ currentDepth: depth })
    }
  },

  showCreatureBio: function (e) {
    var name = e.currentTarget.dataset.name
    var bio = e.currentTarget.dataset.bio
    var img = e.currentTarget.dataset.img
    var depth = e.currentTarget.dataset.depth
    sound.play('bubble')
    this.setData({
      showBio: true,
      bioCreature: { name: name, bio: bio, img: img, depth: depth }
    })
  },

  closeBio: function () {
    this.setData({ showBio: false, bioCreature: null })
  },

  onShareAppMessage: function () {
    return {
      title: '我已下潜到' + this.data.currentDepth + '米深海，来探索深海世界！',
      path: '/pages/deep-sea/deep-sea'
    }
  },

  onShareTimeline: function () {
    return {
      title: '深海探索 - 从海面一直下潜到11000米'
    }
  },

  onUnload: function () {
    clearInterval(this.bubbleTimer)
  }
})
