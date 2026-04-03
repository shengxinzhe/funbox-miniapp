Page({
  data: {
    games: [
      {
        id: 'reaction',
        icon: '\u26a1',
        title: '\u53cd\u5e94\u901f\u5ea6\u6d4b\u8bd5',
        desc: '\u6d4b\u8bd5\u4f60\u7684\u53cd\u5e94\u6709\u591a\u5feb\uff0c\u548c\u670b\u53cb PK',
        color: '#e74c3c',
        page: '/pages/reaction/reaction'
      },
      {
        id: 'memory',
        icon: '\ud83e\udde0',
        title: '\u8bb0\u5fc6\u77e9\u9635',
        desc: '\u8003\u9a8c\u77ac\u65f6\u8bb0\u5fc6\uff0c\u4ece 4x4 \u6311\u6218\u5230 6x6',
        color: '#6c63ff',
        page: '/pages/memory/memory'
      },
      {
        id: 'spend',
        icon: '\ud83d\udcb0',
        title: '\u82b1\u5149\u6bd4\u5c14\u76d6\u8328\u7684\u94b1',
        desc: '1000\u4ebf\u7f8e\u5143\u4f60\u80fd\u82b1\u5b8c\u5417\uff1f',
        color: '#27ae60',
        page: '/pages/spend/spend'
      },
      {
        id: 'deep-sea',
        icon: '\ud83c\udf0a',
        title: '\u6df1\u6d77\u63a2\u7d22',
        desc: '\u4ece\u6d77\u9762\u4e00\u76f4\u4e0b\u6f5c\u5230 11000 \u7c73\u6df1\u5904',
        color: '#0077be',
        page: '/pages/deep-sea/deep-sea'
      }
    ]
  },

  openGame: function (e) {
    var page = e.currentTarget.dataset.page
    wx.navigateTo({ url: page })
  },

  onShareAppMessage: function () {
    return {
      title: 'FunBox - \u6709\u8da3\u7684\u5c0f\u6e38\u620f\u5408\u96c6',
      path: '/pages/index/index'
    }
  },

  onShareTimeline: function () {
    return {
      title: 'FunBox - \u7528\u5c0f\u6e38\u620f\u6253\u53d1\u65e0\u804a\u65f6\u5149'
    }
  }
})
