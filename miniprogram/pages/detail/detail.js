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
    displayName: '',
    title: '',
    keyword: '',
    detailTypeLabel: '',
    primaryTitle: '',
    primaryText: '',
    sceneChips: [],
    recipientChips: [],
    pairingText: '',
    cautionText: ''
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
    const isFlower = type === 'flower'

    this.setData({
      type,
      item,
      scene,
      recipient,
      name,
      displayName: name || recipient,
      title: item ? item.name : '推荐详情',
      keyword: item ? `${item.name} ${scene} 礼物` : '',
      detailTypeLabel: isFlower ? '花束详情' : '礼物详情',
      primaryTitle: isFlower ? '花语' : '推荐理由',
      primaryText: item ? (isFlower ? item.language : item.reason) : '',
      sceneChips: item ? (isFlower ? [scene] : item.scenes) : [],
      recipientChips: item ? (isFlower ? item.suitable_recipients : item.recipients) : [],
      pairingText: item ? item.tips : '',
      cautionText: item ? item.taboo : ''
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
