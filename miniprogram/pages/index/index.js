Page({
  data: {
    title: '送了莫',
    slogan: '不知道送什么？三步帮你选'
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 三步帮你选礼物',
      path: '/pages/index/index'
    }
  }
})
