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
        id: 'stroop',
        icon: '\ud83c\udfa8',
        title: '\u65af\u7279\u9c81\u666e\u6548\u5e94',
        desc: '\u4f60\u7684\u5927\u8111\u80fd\u6218\u80dc\u8ba4\u77e5\u51b2\u7a81\u5417\uff1f',
        color: '#ef4444',
        page: '/pages/stroop/stroop'
      },
      {
        id: 'nback',
        icon: '\ud83e\udde9',
        title: '\u53cc\u91cdN-Back\u8bb0\u5fc6\u6311\u6218',
        desc: '\u5de5\u4f5c\u8bb0\u5fc6\u6781\u9650\u6d4b\u8bd5\uff0c\u4f60\u80fd\u8fbe\u5230\u51e0Back\uff1f',
        color: '#6c63ff',
        page: '/pages/nback/nback'
      },
      {
        id: 'brain-daily',
        icon: '\ud83e\udde0',
        title: '\u6bcf\u65e5\u8ba4\u77e5\u8bad\u7ec3',
        desc: '4\u9879\u6d4b\u8bd5\u7efc\u5408\u8bc4\u5206\uff0c\u8ffd\u8e2a\u4f60\u7684\u5927\u8111\u72b6\u6001',
        color: '#22c55e',
        page: '/pages/brain-daily/brain-daily'
      },
      {
        id: 'circle',
        icon: '\u2b55',
        title: '\u753b\u4e2a\u5b8c\u7f8e\u5706',
        desc: '\u7528\u624b\u6307\u753b\u5706\uff0cAI\u8bc4\u5206\u4f60\u7684\u5706\u5ea6 0-100%',
        color: '#22c55e',
        page: '/pages/circle/circle'
      },
      {
        id: 'time-lab',
        icon: '\u23f1',
        title: '\u65f6\u95f4\u611f\u77e5\u5b9e\u9a8c\u5ba4',
        desc: '\u4e0d\u770b\u65f6\u949f\uff0c\u4f60\u80fd\u51c6\u786e\u4f30\u8ba1\u65f6\u95f4\u5417\uff1f',
        color: '#818cf8',
        page: '/pages/time-lab/time-lab'
      },
      {
        id: 'password-game',
        icon: '\ud83d\udd10',
        title: '\u5bc6\u7801\u6311\u6218',
        desc: '\u89c4\u5219\u8d8a\u6765\u8d8a\u8352\u8c2c\uff0c\u4f60\u80fd\u901a\u8fc7\u51e0\u5173\uff1f',
        color: '#f39c12',
        page: '/pages/password-game/password-game'
      },
      {
        id: 'dodge',
        icon: '\ud83c\udfaf',
        title: '\u8eb2\u907f\u5c0f\u7403',
        desc: '\u624b\u6307\u63a7\u5236\u8eb2\u907f\u5f69\u8272\u5f39\u5e55\uff0c\u4f60\u80fd\u6d3b\u591a\u4e45\uff1f',
        color: '#22c55e',
        page: '/pages/dodge/dodge'
      },
      {
        id: 'color-iq',
        icon: '\ud83c\udfa8',
        title: '\u8272\u89c9\u8fa8\u522b\u6311\u6218',
        desc: '\u627e\u51fa\u989c\u8272\u4e0d\u540c\u7684\u65b9\u5757\uff0c\u8003\u9a8c\u4f60\u7684\u8272\u89c9\u654f\u9510\u5ea6',
        color: '#a78bfa',
        page: '/pages/color-iq/color-iq'
      },
      {
        id: 'fact-or-fiction',
        icon: '\u2753',
        title: '\u771f\u5047\u51b7\u77e5\u8bc6',
        desc: '\u8fa8\u522b\u51b7\u77e5\u8bc6\u771f\u5047\uff0c\u770b\u4f60\u80fd\u7b54\u5bf9\u51e0\u9898',
        color: '#f59e0b',
        page: '/pages/fact-or-fiction/fact-or-fiction'
      },
      {
        id: 'flag-quiz',
        icon: '\ud83c\uddf0\ud83c\uddf7',
        title: '\u56fd\u65d7\u731c\u56fd\u5bb6',
        desc: '\u770b\u56fd\u65d7\u731c\u56fd\u5bb6\uff0c\u6d4b\u8bd5\u4f60\u7684\u5730\u7406\u77e5\u8bc6',
        color: '#3b82f6',
        page: '/pages/flag-quiz/flag-quiz'
      },
      {
        id: 'element-craft',
        icon: '\u2697\ufe0f',
        title: '\u5143\u7d20\u5408\u6210',
        desc: '\u4ece\u56db\u5927\u5143\u7d20\u5f00\u59cb\uff0c\u5408\u6210\u521b\u9020\u65b0\u7269\u8d28',
        color: '#8b5cf6',
        page: '/pages/element-craft/element-craft'
      }
    ]
  },

  openGame: function (e) {
    var page = e.currentTarget.dataset.page
    wx.navigateTo({ url: page })
  },

  onShareAppMessage: function () {
    return {
      title: '\u667a\u53d8\u7eaa\u8da3\u5473\u5b9e\u9a8c\u5ba4 - AI\u65f6\u4ee3\u7684\u8da3\u5473\u5c0f\u5b9e\u9a8c',
      path: '/pages/index/index'
    }
  },

  onShareTimeline: function () {
    return {
      title: '\u667a\u53d8\u7eaa\u8da3\u5473\u5b9e\u9a8c\u5ba4 - \u6765\u8bd5\u8bd5\u8fd9\u4e9b\u6709\u8da3\u7684\u5c0f\u5b9e\u9a8c'
    }
  }
})
