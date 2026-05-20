Page({
  data: {
    selectedScene: '',
    selectedRecipient: '',
    selectedBudget: ''
  },

  onLoad(options) {
    this.setData({
      selectedScene: options.scene || '',
      selectedRecipient: options.recipient || '',
      selectedBudget: options.budget || ''
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 帮我看看这份礼物推荐',
      path: '/pages/index/index'
    }
  }
})
