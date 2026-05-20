Page({
  data: {
    selectedScene: ''
  },

  onLoad(options) {
    this.setData({
      selectedScene: options.scene || ''
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 帮我看看礼物怎么选',
      path: '/pages/index/index'
    }
  }
})
