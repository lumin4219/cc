const scenes = [
  { name: '生日', icon: '🎂', desc: '生日惊喜' },
  { name: '情人节', icon: '🌹', desc: '浪漫心意' },
  { name: '结婚纪念日', icon: '💍', desc: '纪念陪伴' },
  { name: '母亲节', icon: '💐', desc: '感谢妈妈' },
  { name: '父亲节', icon: '👔', desc: '关心爸爸' },
  { name: '教师节', icon: '📚', desc: '感恩教诲' },
  { name: '圣诞节', icon: '🎄', desc: '冬日祝福' },
  { name: '春节', icon: '🧧', desc: '新年心意' },
  { name: '中秋', icon: '🥮', desc: '团圆祝福' },
  { name: '毕业季', icon: '🎓', desc: '新的开始' },
  { name: '乔迁新居', icon: '🏠', desc: '新家祝福' },
  { name: '宝宝满月', icon: '👶', desc: '成长祝愿' },
  { name: '道歉', icon: '🤝', desc: '真诚修复' },
  { name: '感谢', icon: '🎁', desc: '表达谢意' },
  { name: '更多场景', icon: '✨', desc: '灵感备选' }
]

const festivals = [
  { name: '春节', type: 'lunar', key: 'springFestival', icon: '🧧' },
  { name: '情人节', month: 2, day: 14, icon: '🌹' },
  { name: '母亲节', type: 'weekday', month: 5, weekday: 0, week: 2, icon: '💐' },
  { name: '父亲节', type: 'weekday', month: 6, weekday: 0, week: 3, icon: '👔' },
  { name: '教师节', month: 9, day: 10, icon: '📚' },
  { name: '中秋', type: 'lunar', key: 'midAutumn', icon: '🥮' },
  { name: '圣诞节', month: 12, day: 25, icon: '🎄' }
]

const lunarFestivalDates = {
  springFestival: {
    2026: { month: 2, day: 17 },
    2027: { month: 2, day: 6 },
    2028: { month: 1, day: 26 },
    2029: { month: 2, day: 13 },
    2030: { month: 2, day: 3 }
  },
  midAutumn: {
    2026: { month: 9, day: 25 },
    2027: { month: 9, day: 15 },
    2028: { month: 10, day: 3 },
    2029: { month: 9, day: 22 },
    2030: { month: 9, day: 12 }
  }
}

function getNthWeekdayOfMonth(year, month, weekday, week) {
  const firstDay = new Date(year, month - 1, 1)
  const offset = (weekday - firstDay.getDay() + 7) % 7

  return new Date(year, month - 1, 1 + offset + (week - 1) * 7)
}

function getFestivalDateInYear(festival, year) {
  if (festival.type === 'weekday') {
    return getNthWeekdayOfMonth(year, festival.month, festival.weekday, festival.week)
  }

  if (festival.type === 'lunar') {
    const dateInfo = lunarFestivalDates[festival.key] && lunarFestivalDates[festival.key][year]

    if (!dateInfo) {
      return null
    }

    return new Date(year, dateInfo.month - 1, dateInfo.day)
  }

  return new Date(year, festival.month - 1, festival.day)
}

function getNextFestivalDate(festival, today) {
  const year = today.getFullYear()
  const currentYearDate = getFestivalDateInYear(festival, year)

  if (currentYearDate && currentYearDate >= today) {
    return currentYearDate
  }

  return getFestivalDateInYear(festival, year + 1)
}

function getUpcomingFestivals() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return festivals
    .map((festival) => {
      const date = getNextFestivalDate(festival, today)
      if (!date) {
        return null
      }

      const daysLeft = Math.ceil((date - today) / (24 * 60 * 60 * 1000))

      return {
        ...festival,
        daysLeft
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3)
}

Page({
  data: {
    title: '送了莫',
    slogan: '不知道送什么？三步帮你选',
    scenes,
    upcomingFestivals: []
  },

  onLoad() {
    this.setData({
      upcomingFestivals: getUpcomingFestivals()
    })
  },

  handleSceneTap(event) {
    const { scene } = event.currentTarget.dataset

    if (!scene) {
      return
    }

    wx.navigateTo({
      url: `/pages/recipient/recipient?scene=${encodeURIComponent(scene)}`
    })
  },

  onShareAppMessage() {
    return {
      title: '送了莫 - 三步帮你选礼物',
      path: '/pages/index/index'
    }
  }
})
