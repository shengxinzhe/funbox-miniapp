var sound = require('../../utils/sound')

var TOTAL = 100000000000 // $100 billion

var ALL_ITEMS = [
  { emoji: '\ud83c\udf54', key: 'burger', name: '\u5927\u6c49\u5821', price: 5 },
  { emoji: '\u2615', key: 'coffee', name: '\u661f\u5df4\u514b\u5496\u5561', price: 6 },
  { emoji: '\ud83c\udf55', key: 'pizza', name: '\u4e00\u6574\u4e2a\u62ab\u8428', price: 15 },
  { emoji: '\ud83c\udf7f', key: 'movie', name: '\u7535\u5f71\u7968+\u7206\u7c73\u82b1', price: 25 },
  { emoji: '\ud83d\udc55', key: 'tshirt', name: '\u4e00\u4ef6T\u6064', price: 35 },
  { emoji: '\ud83d\udcd6', key: 'book', name: '\u4e00\u672c\u7545\u9500\u4e66', price: 25 },
  { emoji: '\ud83c\udfa7', key: 'airpods', name: 'AirPods Pro', price: 249 },
  { emoji: '\ud83d\udc5f', key: 'shoes', name: 'Nike Air Jordan', price: 180 },
  { emoji: '\ud83c\udfae', key: 'console', name: 'PlayStation 5', price: 499 },
  { emoji: '\ud83d\udeb2', key: 'bike', name: '\u5c71\u5730\u81ea\u884c\u8f66', price: 800 },
  { emoji: '\ud83d\udcf1', key: 'phone', name: 'iPhone 16 Pro', price: 1199 },
  { emoji: '\ud83d\udcbb', key: 'laptop', name: 'MacBook Pro M4', price: 2499 },
  { emoji: '\ud83d\udc15', key: 'puppy', name: '\u4e00\u53ea\u91d1\u6bdb\u72ac', price: 2500 },
  { emoji: '\ud83d\udc8e', key: 'diamond', name: '\u94bb\u77f3\u9879\u94fe', price: 8000 },
  { emoji: '\u231a', key: 'watch', name: '\u52b3\u529b\u58eb\u9ed1\u6c34\u9b3c', price: 12000 },
  { emoji: '\ud83c\udfcd\ufe0f', key: 'motorcycle', name: '\u54c8\u96f7\u6234\u7ef4\u68ee', price: 22000 },
  { emoji: '\ud83c\udf93', key: 'tuition', name: '\u54c8\u4f5b\u56db\u5e74\u5b66\u8d39', price: 220000 },
  { emoji: '\ud83d\udc8d', key: 'wedding', name: '\u8c6a\u534e\u5a5a\u793c', price: 100000 },
  { emoji: '\ud83c\udfce\ufe0f', key: 'sportscar', name: '\u5170\u535a\u57fa\u5c3c Huracan', price: 261274 },
  { emoji: '\ud83c\udfe0', key: 'house', name: '\u4e00\u5957\u522b\u5885', price: 800000 },
  { emoji: '\ud83d\ude81', key: 'helicopter', name: '\u79c1\u4eba\u76f4\u5347\u673a', price: 1700000 },
  { emoji: '\ud83d\udea2', key: 'yacht', name: '\u8d85\u7ea7\u6e38\u8247', price: 10000000 },
  { emoji: '\u2708\ufe0f', key: 'jet', name: '\u6e7e\u6d41G700\u79c1\u4eba\u98de\u673a', price: 75000000 },
  { emoji: '\ud83c\udfe2', key: 'building', name: '\u6469\u5929\u5927\u697c', price: 50000000 },
  { emoji: '\ud83d\uddbc\ufe0f', key: 'painting', name: '\u8fbe\u82ac\u5947\u540d\u753b', price: 450000000 },
  { emoji: '\ud83d\ude80', key: 'rocket', name: 'SpaceX\u706b\u7bad\u53d1\u5c04', price: 67000000 },
  { emoji: '\ud83c\udfdf\ufe0f', key: 'stadium', name: 'NFL \u4f53\u80b2\u573a', price: 1500000000 },
  { emoji: '\ud83d\udea2', key: 'cruise', name: '\u7687\u5bb6\u52a0\u52d2\u6bd4\u90ae\u8f6e', price: 1350000000 },
  { emoji: '\u26bd', key: 'team', name: '\u5207\u5c14\u897f\u8db3\u7403\u4ff1\u4e50\u90e8', price: 3000000000 },
  { emoji: '\ud83c\udfdd\ufe0f', key: 'island', name: '\u9a6c\u5c14\u4ee3\u592b\u79c1\u4eba\u5c9b', price: 30000000 },
  { emoji: '\ud83e\uddec', key: 'dna', name: '\u5efa\u4e00\u6240\u57fa\u56e0\u7814\u7a76\u6240', price: 500000000 },
  { emoji: '\ud83d\udef0\ufe0f', key: 'satellite', name: '\u53d1\u5c04\u4e00\u9897\u536b\u661f', price: 300000000 }
]

function fmtMoney(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K'
  return '$' + n.toLocaleString()
}

function fmtBalanceDisplay(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2)
  if (n >= 1e6) return (n / 1e6).toFixed(2)
  if (n >= 1e3) return (n / 1e3).toFixed(2)
  return n.toString()
}

function fmtBalanceUnit(n) {
  if (n >= 1e9) return '十亿美元'
  if (n >= 1e6) return '百万美元'
  if (n >= 1e3) return '千美元'
  return '美元'
}

Page({
  data: {
    balance: TOTAL,
    balanceDisplay: '100.00',
    balanceUnit: '十亿美元',
    totalSpent: 0,
    spentStr: '$0',
    spentPct: '0',
    items: [],
    receipt: [],
    flyItem: null,
    moneyAnim: false,
    gatesImg: './images/gates.jpg'
  },

  cart: {},

  onLoad: function () {
    var items = ALL_ITEMS.map(function (it) {
      return {
        emoji: it.emoji,
        key: it.key,
        name: it.name,
        price: it.price,
        priceStr: fmtMoney(it.price),
        qty: 0
      }
    })
    var cart = {}
    ALL_ITEMS.forEach(function (it) { cart[it.key] = 0 })
    this.cart = cart
    this.setData({ items: items })
  },

  buy: function (e) {
    var key = e.currentTarget.dataset.key
    var item = ALL_ITEMS.find(function (it) { return it.key === key })
    if (this.data.balance < item.price) return

    this.cart[key]++
    sound.play('coin')

    // Trigger money animation
    this.setData({ moneyAnim: true })
    var self = this
    setTimeout(function () {
      self.setData({ moneyAnim: false })
    }, 300)

    this.updateState()
  },

  sell: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.cart[key] <= 0) return

    this.cart[key]--
    sound.play('tap')
    this.updateState()
  },

  updateState: function () {
    var spent = 0
    var cart = this.cart
    var receipt = []

    var items = this.data.items.map(function (it) {
      var qty = cart[it.key]
      var item = ALL_ITEMS.find(function (a) { return a.key === it.key })
      spent += qty * item.price
      if (qty > 0) {
        receipt.push({
          key: it.key,
          emoji: it.emoji,
          name: it.name,
          qty: qty,
          totalStr: fmtMoney(qty * item.price)
        })
      }
      return {
        emoji: it.emoji,
        key: it.key,
        name: it.name,
        price: item.price,
        priceStr: it.priceStr,
        qty: qty
      }
    })

    var balance = TOTAL - spent
    var pct = ((spent / TOTAL) * 100).toFixed(1)

    this.setData({
      balance: balance,
      balanceDisplay: fmtBalanceDisplay(balance),
      balanceUnit: fmtBalanceUnit(balance),
      totalSpent: spent,
      spentStr: fmtMoney(spent),
      spentPct: pct,
      items: items,
      receipt: receipt
    })
  },

  onShareAppMessage: function () {
    var pct = ((this.data.totalSpent / TOTAL) * 100).toFixed(1)
    return {
      title: '我花掉了比尔盖茨 ' + pct + '% 的钱，你能花完吗？',
      path: '/pages/spend/spend'
    }
  },

  onShareTimeline: function () {
    return {
      title: '花光比尔盖茨的1000亿，你试试？'
    }
  }
})
