Page({
  data: {
    selectedScene: ''
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''

    this.setData({
      selectedScene
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 帮我看看礼物怎么选',
      path: '/pages/index/index'
    }
  }
})
