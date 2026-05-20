Page({
  data: {
    selectedScene: '',
    selectedRecipient: ''
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''
    const selectedRecipient = options.recipient ? decodeURIComponent(options.recipient) : ''

    this.setData({
      selectedScene,
      selectedRecipient
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 三步帮你选礼物',
      path: '/pages/index/index'
    }
  }
})
