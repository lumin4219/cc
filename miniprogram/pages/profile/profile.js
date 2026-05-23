const CONTACT_STORAGE_KEY = 'songlemo_common_contacts'

const preferenceTagNames = ['浪漫', '实用', '高级感', '可爱', '健康', '数码', '家居', '美妆', '仪式感', '不踩雷']
const budgetOptions = [
  { value: '50以下', title: '50元以下' },
  { value: '50-100', title: '50-100元' },
  { value: '100-300', title: '100-300元' },
  { value: '300-500', title: '300-500元' },
  { value: '500-1000', title: '500-1000元' },
  { value: '1000以上', title: '1000元以上' }
]

function getContacts() {
  const contacts = wx.getStorageSync(CONTACT_STORAGE_KEY)
  return Array.isArray(contacts) ? contacts : []
}

function saveContact(profile) {
  if (!profile.name) {
    return
  }
  const contacts = getContacts().filter((item) => item.name !== profile.name || item.recipient !== profile.recipient)
  contacts.unshift({
    id: `${profile.recipient}_${profile.name}`,
    name: profile.name,
    recipient: profile.recipient,
    gender: profile.gender,
    birthday: profile.birthday
  })
  wx.setStorageSync(CONTACT_STORAGE_KEY, contacts.slice(0, 10))
}

Page({
  data: {
    selectedScene: '',
    eventName: '',
    eventDate: '',
    eventType: '',
    recipient: '',
    name: '',
    gender: '女',
    birthday: '',
    selectedPreferences: [],
    budget: '100-300',
    preferenceTags: preferenceTagNames.map((name) => ({ name, selected: false })),
    budgetOptions
  },

  onLoad(options) {
    this.setData({
      selectedScene: options.scene ? decodeURIComponent(options.scene) : '',
      eventName: options.eventName ? decodeURIComponent(options.eventName) : '',
      eventDate: options.eventDate ? decodeURIComponent(options.eventDate) : '',
      eventType: options.eventType ? decodeURIComponent(options.eventType) : '',
      recipient: options.recipient ? decodeURIComponent(options.recipient) : '',
      name: options.name ? decodeURIComponent(options.name) : '',
      birthday: options.eventDate ? decodeURIComponent(options.eventDate) : ''
    })
  },

  handleNameInput(event) {
    this.setData({ name: event.detail.value })
  },

  handleGenderTap(event) {
    this.setData({ gender: event.currentTarget.dataset.gender })
  },

  handleBirthdayChange(event) {
    this.setData({ birthday: event.detail.value })
  },

  handlePreferenceTap(event) {
    const tag = event.currentTarget.dataset.tag
    const selectedPreferences = this.data.selectedPreferences.includes(tag)
      ? this.data.selectedPreferences.filter((item) => item !== tag)
      : this.data.selectedPreferences.concat(tag)
    this.setData({
      selectedPreferences,
      preferenceTags: preferenceTagNames.map((name) => ({
        name,
        selected: selectedPreferences.includes(name)
      }))
    })
  },

  handleBudgetTap(event) {
    this.setData({ budget: event.currentTarget.dataset.budget })
  },

  submitProfile() {
    if (!this.data.name) {
      wx.showToast({ title: '请填写姓名', icon: 'none' })
      return
    }

    saveContact(this.data)
    const query = [
      `scene=${encodeURIComponent(this.data.selectedScene)}`,
      `eventName=${encodeURIComponent(this.data.eventName)}`,
      `eventDate=${encodeURIComponent(this.data.eventDate)}`,
      `recipient=${encodeURIComponent(this.data.recipient)}`,
      `name=${encodeURIComponent(this.data.name)}`,
      `gender=${encodeURIComponent(this.data.gender)}`,
      `birthday=${encodeURIComponent(this.data.birthday)}`,
      `preferences=${encodeURIComponent(this.data.selectedPreferences.join(','))}`,
      `budget=${encodeURIComponent(this.data.budget)}`
    ].join('&')
    wx.navigateTo({ url: `/pages/result/result?${query}` })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 填资料生成个性化礼物推荐',
      path: '/pages/index/index'
    }
  }
})
