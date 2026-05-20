Page({
  data: {
    selectedScene: '',
    selectedRecipient: '',
    selectedBudget: ''
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''
    const selectedRecipient = options.recipient ? decodeURIComponent(options.recipient) : ''
    const selectedBudget = options.budget ? decodeURIComponent(options.budget) : ''

    this.setData({
      selectedScene,
      selectedRecipient,
      selectedBudget
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 帮我看看这份礼物推荐',
      path: '/pages/index/index'
    }
  }
})
