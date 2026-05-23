const gifts = require('../../data/gifts.json')
const flowerLanguages = require('../../data/flowerLanguages.json')

function findFlower(scene, id) {
  const guide = flowerLanguages.find((item) => item.scene === scene)
  if (!guide) {
    return null
  }
  return guide.flowers.find((flower) => flower.id === id)
}

Page({
  data: {
    type: '',
    item: null,
    scene: '',
    recipient: '',
    name: '',
    title: '',
    keyword: ''
  },

  onLoad(options) {
    const type = options.type || 'gift'
    const id = options.id ? decodeURIComponent(options.id) : ''
    const scene = options.scene ? decodeURIComponent(options.scene) : ''
    const recipient = options.recipient ? decodeURIComponent(options.recipient) : ''
    const name = options.name ? decodeURIComponent(options.name) : ''
    const item = type === 'flower'
      ? findFlower(scene, id)
      : gifts.find((gift) => gift.id === id)

    this.setData({
      type,
      item,
      scene,
      recipient,
      name,
      title: item ? item.name : '推荐详情',
      keyword: item ? `${item.name} ${scene} 礼物` : ''
    })
  },

  copyKeyword() {
    if (!this.data.keyword) {
      return
    }
    wx.setClipboardData({
      data: this.data.keyword,
      success() {
        wx.showToast({
          title: '已复制关键词',
          icon: 'success'
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: `送了莫推荐：${this.data.title}`,
      path: '/pages/index/index'
    }
  }
})
