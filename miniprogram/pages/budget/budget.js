const budgetOptions = [
  {
    value: '50以下',
    title: '50元以下',
    icon: '🌱',
    desc: '轻量心意',
    examples: '卡片、小礼物、绿植'
  },
  {
    value: '50-100',
    title: '50-100元',
    icon: '🎀',
    desc: '日常小惊喜',
    examples: '护手霜、杯子、零食'
  },
  {
    value: '100-300',
    title: '100-300元',
    icon: '🎁',
    desc: '稳妥实用',
    examples: '香薰、文具、绘本'
  },
  {
    value: '300-500',
    title: '300-500元',
    icon: '💐',
    desc: '体面有质感',
    examples: '茶礼、个护、配饰'
  },
  {
    value: '500-1000',
    title: '500-1000元',
    icon: '✨',
    desc: '重要节点',
    examples: '耳机、对戒、护肤'
  },
  {
    value: '1000以上',
    title: '1000元以上',
    icon: '💎',
    desc: '重磅表达',
    examples: '家电、投影、旅行用品'
  }
]

Page({
  data: {
    selectedScene: '',
    selectedRecipient: '',
    budgetOptions
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''
    const selectedRecipient = options.recipient ? decodeURIComponent(options.recipient) : ''

    this.setData({
      selectedScene,
      selectedRecipient
    })
  },

  handleBudgetTap(event) {
    const { budget } = event.currentTarget.dataset

    if (!budget) {
      return
    }

    const query = [
      `scene=${encodeURIComponent(this.data.selectedScene)}`,
      `recipient=${encodeURIComponent(this.data.selectedRecipient)}`,
      `budget=${encodeURIComponent(budget)}`
    ].join('&')

    wx.navigateTo({
      url: `/pages/result/result?${query}`
    })
  },

  goBackToRecipient() {
    const scene = encodeURIComponent(this.data.selectedScene)

    wx.redirectTo({
      url: `/pages/recipient/recipient?scene=${scene}`
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 三步帮你选礼物',
      path: '/pages/index/index'
    }
  }
})
