Page({
  data: {
    selectedScene: '',
    selectedRecipient: ''
  },

  onLoad(options) {
    this.setData({
      selectedScene: options.scene || '',
      selectedRecipient: options.recipient || ''
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 三步帮你选礼物',
      path: '/pages/index/index'
    }
  }
})
