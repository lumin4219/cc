const recipientGroups = [
  {
    title: '恋人伴侣',
    icon: '🌹',
    people: [
      { name: '男友', icon: '🤵' },
      { name: '女友', icon: '👩' },
      { name: '老公', icon: '💍' },
      { name: '老婆', icon: '🎀' }
    ]
  },
  {
    title: '长辈',
    icon: '👨‍👩‍👧‍👦',
    people: [
      { name: '妈妈', icon: '💐' },
      { name: '爸爸', icon: '👔' },
      { name: '爷爷', icon: '🍵' },
      { name: '奶奶', icon: '🧣' },
      { name: '岳父', icon: '📚' },
      { name: '岳母', icon: '🌷' }
    ]
  },
  {
    title: '朋友',
    icon: '🎁',
    people: [
      { name: '闺蜜', icon: '🎀' },
      { name: '兄弟', icon: '🎮' },
      { name: '同事', icon: '☕' }
    ]
  },
  {
    title: '晚辈',
    icon: '👶',
    people: [
      { name: '儿子', icon: '🚗' },
      { name: '女儿', icon: '🧸' },
      { name: '侄子', icon: '🧩' },
      { name: '侄女', icon: '🍭' }
    ]
  },
  {
    title: '其他',
    icon: '📚',
    people: [
      { name: '老师', icon: '🍎' },
      { name: '领导', icon: '💼' },
      { name: '客户', icon: '🤝' }
    ]
  }
]

Page({
  data: {
    selectedScene: '',
    recipientGroups
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''

    this.setData({
      selectedScene
    })
  },

  handleRecipientTap(event) {
    const { recipient } = event.currentTarget.dataset

    if (!recipient) {
      return
    }

    wx.navigateTo({
      url: `/pages/budget/budget?scene=${encodeURIComponent(this.data.selectedScene)}&recipient=${encodeURIComponent(recipient)}`
    })
  },

  goBackToScene() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 帮我看看礼物怎么选',
      path: '/pages/index/index'
    }
  }
})
