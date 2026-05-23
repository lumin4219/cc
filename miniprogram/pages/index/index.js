const ANNIVERSARY_STORAGE_KEY = 'songlemo_anniversaries'

const fixedEvents = [
  { id: 'festival_valentine', name: '情人节', scene: '情人节', month: 2, day: 14, icon: '🌹', type: 'festival' },
  { id: 'festival_mother', name: '母亲节', scene: '母亲节', month: 5, day: 10, icon: '💐', type: 'festival' },
  { id: 'festival_father', name: '父亲节', scene: '父亲节', month: 6, day: 21, icon: '👔', type: 'festival' },
  { id: 'festival_teacher', name: '教师节', scene: '教师节', month: 9, day: 10, icon: '📚', type: 'festival' },
  { id: 'festival_mid_autumn', name: '中秋', scene: '中秋', month: 9, day: 25, icon: '🥮', type: 'festival' },
  { id: 'festival_christmas', name: '圣诞节', scene: '圣诞节', month: 12, day: 25, icon: '🎄', type: 'festival' },
  { id: 'festival_spring', name: '春节', scene: '春节', month: 2, day: 17, icon: '🧧', type: 'festival' }
]

function pad(value) {
  return String(value).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDate(dateText) {
  const parts = dateText.split('-').map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2])
}

function getStoredAnniversaries() {
  const stored = wx.getStorageSync(ANNIVERSARY_STORAGE_KEY)
  return Array.isArray(stored) ? stored : []
}

function setStoredAnniversaries(items) {
  wx.setStorageSync(ANNIVERSARY_STORAGE_KEY, items)
}

function getAllEvents() {
  const year = new Date().getFullYear()
  const festivals = fixedEvents.map((item) => ({
    ...item,
    date: `${year}-${pad(item.month)}-${pad(item.day)}`
  }))
  return festivals.concat(getStoredAnniversaries())
}

function getUpcomingEvents(events) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return events.map((event) => {
    let date = parseDate(event.date)
    if (date < today) {
      date = new Date(today.getFullYear() + 1, date.getMonth(), date.getDate())
    }
    return {
      ...event,
      dateText: formatDate(date),
      daysLeft: Math.ceil((date - today) / (24 * 60 * 60 * 1000))
    }
  }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5)
}

function buildMonthDays(year, month, events) {
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const prefixCount = firstDay.getDay()
  const eventMap = events.reduce((map, event) => {
    map[event.date] = map[event.date] || []
    map[event.date].push(event)
    return map
  }, {})
  const days = []

  for (let index = 0; index < prefixCount; index += 1) {
    days.push({ key: `empty-${index}`, empty: true })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateText = `${year}-${pad(month)}-${pad(day)}`
    const dayEvents = eventMap[dateText] || []
    days.push({
      key: dateText,
      day,
      date: dateText,
      events: dayEvents,
      hasFestival: dayEvents.some((event) => event.type === 'festival'),
      hasAnniversary: dayEvents.some((event) => event.type === 'anniversary'),
      isToday: dateText === formatDate(new Date())
    })
  }

  return days
}

function getCurrentEventFromDay(day) {
  if (day.events && day.events.length) {
    return day.events[0]
  }
  return {
    name: '生日',
    scene: '生日',
    date: day.date,
    icon: '🎂',
    type: 'anniversary'
  }
}

Page({
  data: {
    title: '送了莫',
    currentYear: 0,
    currentMonth: 0,
    monthTitle: '',
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    monthDays: [],
    upcomingEvents: [],
    selectedEvent: null,
    showAddPanel: false,
    newAnniversaryName: '',
    newAnniversaryDate: '',
    anniversaryCount: 0
  },

  onLoad() {
    const today = new Date()
    this.refreshCalendar(today.getFullYear(), today.getMonth() + 1)
  },

  onShow() {
    if (this.data.currentYear) {
      this.refreshCalendar(this.data.currentYear, this.data.currentMonth)
    }
  },

  refreshCalendar(year, month) {
    const events = getAllEvents()
    this.setData({
      currentYear: year,
      currentMonth: month,
      monthTitle: `${year}年${month}月`,
      monthDays: buildMonthDays(year, month, events),
      upcomingEvents: getUpcomingEvents(events),
      anniversaryCount: getStoredAnniversaries().length
    })
  },

  changeMonth(event) {
    const offset = Number(event.currentTarget.dataset.offset)
    const nextDate = new Date(this.data.currentYear, this.data.currentMonth - 1 + offset, 1)
    this.refreshCalendar(nextDate.getFullYear(), nextDate.getMonth() + 1)
  },

  handleDayTap(event) {
    const { index } = event.currentTarget.dataset
    const day = this.data.monthDays[index]
    if (!day || day.empty) {
      return
    }
    const selectedEvent = getCurrentEventFromDay(day)
    this.setData({ selectedEvent })
    this.goRecipient(selectedEvent)
  },

  handleUpcomingTap(event) {
    const { index } = event.currentTarget.dataset
    const selectedEvent = this.data.upcomingEvents[index]
    this.setData({ selectedEvent })
    this.goRecipient(selectedEvent)
  },

  goRecipient(event) {
    const query = [
      `scene=${encodeURIComponent(event.scene || event.name)}`,
      `eventName=${encodeURIComponent(event.name)}`,
      `eventDate=${encodeURIComponent(event.dateText || event.date)}`,
      `eventType=${encodeURIComponent(event.type)}`
    ].join('&')
    wx.navigateTo({ url: `/pages/recipient/recipient?${query}` })
  },

  toggleAddPanel() {
    const today = formatDate(new Date())
    this.setData({
      showAddPanel: !this.data.showAddPanel,
      newAnniversaryDate: this.data.newAnniversaryDate || today
    })
  },

  handleNameInput(event) {
    this.setData({ newAnniversaryName: event.detail.value })
  },

  handleDateChange(event) {
    this.setData({ newAnniversaryDate: event.detail.value })
  },

  saveAnniversary() {
    const { newAnniversaryName, newAnniversaryDate } = this.data
    if (!newAnniversaryName || !newAnniversaryDate) {
      wx.showToast({ title: '请填写名称和日期', icon: 'none' })
      return
    }
    const anniversaries = getStoredAnniversaries()
    anniversaries.unshift({
      id: `ann_${Date.now()}`,
      name: newAnniversaryName,
      scene: newAnniversaryName.includes('纪念') ? '结婚纪念日' : '生日',
      date: newAnniversaryDate,
      icon: '💜',
      type: 'anniversary'
    })
    setStoredAnniversaries(anniversaries)
    this.setData({
      showAddPanel: false,
      newAnniversaryName: '',
      newAnniversaryDate: ''
    })
    this.refreshCalendar(this.data.currentYear, this.data.currentMonth)
    wx.showToast({ title: '已添加', icon: 'success' })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 记住重要日子，提前准备礼物',
      path: '/pages/index/index'
      }
  }
})
