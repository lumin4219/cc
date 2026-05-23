const recipientGroups = [
  {
    title: '恋人',
    icon: '🌹',
    people: ['男友', '女友', '老公', '老婆']
  },
  {
    title: '长辈',
    icon: '👨‍👩‍👧‍👦',
    people: ['妈妈', '爸爸', '爷爷', '奶奶', '岳父', '岳母']
  },
  {
    title: '朋友',
    icon: '🎁',
    people: ['闺蜜', '兄弟', '同事']
  },
  {
    title: '其他',
    icon: '📚',
    people: ['老师', '领导', '客户', '儿子', '女儿', '侄子', '侄女']
  }
]

const CONTACT_STORAGE_KEY = 'songlemo_common_contacts'

function getCommonContacts() {
  const contacts = wx.getStorageSync(CONTACT_STORAGE_KEY)
  return Array.isArray(contacts) ? contacts.slice(0, 6) : []
}

Page({
  data: {
    selectedScene: '',
    eventName: '',
    eventDate: '',
    eventType: '',
    commonContacts: [],
    recipientGroups
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''
    const eventName = options.eventName ? decodeURIComponent(options.eventName) : selectedScene
    const eventDate = options.eventDate ? decodeURIComponent(options.eventDate) : ''
    const eventType = options.eventType ? decodeURIComponent(options.eventType) : ''

    this.setData({
      selectedScene,
      eventName,
      eventDate,
      eventType,
      commonContacts: getCommonContacts()
    })
  },

  handleRecipientTap(event) {
    const { recipient, name } = event.currentTarget.dataset

    if (!recipient) {
      return
    }

    this.goProfile(recipient, name || '')
  },

  goProfile(recipient, name) {
    const query = [
      `scene=${encodeURIComponent(this.data.selectedScene)}`,
      `eventName=${encodeURIComponent(this.data.eventName)}`,
      `eventDate=${encodeURIComponent(this.data.eventDate)}`,
      `eventType=${encodeURIComponent(this.data.eventType)}`,
      `recipient=${encodeURIComponent(recipient)}`,
      `name=${encodeURIComponent(name)}`
    ].join('&')
    wx.navigateTo({
      url: `/pages/profile/profile?${query}`
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
