const gifts = require('../../data/gifts.json')
const flowerLanguages = require('../../data/flowerLanguages.json')

const MAX_RECOMMENDATIONS = 8
const MIN_RECOMMENDATIONS = 3
const FAVORITES_STORAGE_KEY = 'songlemo_favorite_reminders'
const REMINDER_ADVANCE_DAYS = 7

function getStars(score) {
  const fullStars = Math.max(0, Math.min(score, 5))
  const emptyStars = 5 - fullStars

  return `${'★'.repeat(fullStars)}${'☆'.repeat(emptyStars)}`
}

function sortByScoreDesc(a, b) {
  return b.score - a.score
}

function formatPriceRange(priceRange) {
  if (!priceRange) {
    return ''
  }

  if (priceRange === '50以下') {
    return '50元以下'
  }

  if (priceRange === '1000以上') {
    return '1000元以上'
  }

  return `${priceRange}元`
}

function padNumber(value) {
  return String(value).padStart(2, '0')
}

function formatDate(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`
}

function parseDate(dateText) {
  const parts = dateText.split('-').map(Number)

  return new Date(parts[0], parts[1] - 1, parts[2])
}

function shiftDate(date, offsetDays) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + offsetDays)

  return nextDate
}

function getTodayText() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return formatDate(today)
}

function getDefaultEventDateText() {
  return formatDate(shiftDate(parseDate(getTodayText()), 14))
}

function getReminderDateText(eventDateText) {
  const today = parseDate(getTodayText())
  const reminderDate = shiftDate(parseDate(eventDateText), -REMINDER_ADVANCE_DAYS)

  return formatDate(reminderDate < today ? today : reminderDate)
}

function normalizeGift(gift, matchLabel) {
  return {
    ...gift,
    matchLabel,
    expanded: false,
    priceText: formatPriceRange(gift.price_range),
    starText: getStars(gift.score)
  }
}

function buildGiftRecommendations(scene, recipient, budget) {
  const pickedIds = {}
  const recommendations = []
  const exactMatches = gifts.filter((gift) => (
    gift.scenes.includes(scene)
    && gift.recipients.includes(recipient)
    && gift.price_range === budget
  ))

  function addMatches(predicate, matchLabel) {
    gifts
      .filter(predicate)
      .sort(sortByScoreDesc)
      .forEach((gift) => {
        if (recommendations.length >= MAX_RECOMMENDATIONS || pickedIds[gift.id]) {
          return
        }

        pickedIds[gift.id] = true
        recommendations.push(normalizeGift(gift, matchLabel))
      })
  }

  addMatches((gift) => (
    gift.scenes.includes(scene)
    && gift.recipients.includes(recipient)
    && gift.price_range === budget
  ), '完全匹配')

  addMatches((gift) => (
    gift.scenes.includes(scene)
    && gift.recipients.includes(recipient)
  ), '匹配场景和收礼人')

  addMatches((gift) => (
    gift.scenes.includes(scene)
    && gift.price_range === budget
  ), '匹配场景和预算')

  addMatches((gift) => (
    gift.recipients.includes(recipient)
    && gift.price_range === budget
  ), '匹配收礼人和预算')

  if (recommendations.length < MIN_RECOMMENDATIONS) {
    addMatches((gift) => gift.scenes.includes(scene), '匹配场景')
  }

  if (recommendations.length < MIN_RECOMMENDATIONS) {
    addMatches((gift) => gift.recipients.includes(recipient), '匹配收礼人')
  }

  if (recommendations.length < MIN_RECOMMENDATIONS) {
    addMatches((gift) => gift.price_range === budget, '匹配预算')
  }

  return {
    recommendations,
    exactCount: exactMatches.length
  }
}

function buildMatchNote(exactCount, resultCount) {
  if (resultCount === 0) {
    return '暂时没有找到合适结果，请返回调整场景、收礼人或预算。'
  }

  if (exactCount > 0) {
    return `优先为你展示 ${exactCount} 个完全匹配礼物，并补充相近灵感。`
  }

  return '没有完全匹配的礼物，已按场景、收礼人和预算为你补充相近推荐。'
}

function buildFlowerGuide(scene, recipient) {
  const guide = flowerLanguages.find((item) => item.scene === scene)

  if (!guide) {
    return null
  }

  const sortedFlowers = guide.flowers
    .map((flower) => ({
      ...flower,
      isRecipientMatched: flower.suitable_recipients.includes(recipient)
    }))
    .sort((a, b) => Number(b.isRecipientMatched) - Number(a.isRecipientMatched))
    .slice(0, 3)

  return {
    scene: guide.scene,
    summary: guide.summary,
    flowers: sortedFlowers
  }
}

function buildFavoriteId(scene, recipient, budget) {
  return [scene, recipient, budget].join('|')
}

function getStoredFavorites() {
  try {
    const favorites = wx.getStorageSync(FAVORITES_STORAGE_KEY)

    return Array.isArray(favorites) ? favorites : []
  } catch (error) {
    return []
  }
}

function setStoredFavorites(favorites) {
  wx.setStorageSync(FAVORITES_STORAGE_KEY, favorites)
}

Page({
  data: {
    selectedScene: '',
    selectedRecipient: '',
    selectedBudget: '',
    selectedBudgetText: '',
    recommendations: [],
    recommendationCount: 0,
    matchNote: '',
    flowerGuide: null,
    todayDate: '',
    eventDate: '',
    reminderDate: '',
    favoriteSaved: false,
    favoriteCount: 0
  },

  onLoad(options) {
    const selectedScene = options.scene ? decodeURIComponent(options.scene) : ''
    const selectedRecipient = options.recipient ? decodeURIComponent(options.recipient) : ''
    const selectedBudget = options.budget ? decodeURIComponent(options.budget) : ''
    const giftResult = buildGiftRecommendations(selectedScene, selectedRecipient, selectedBudget)
    const flowerGuide = buildFlowerGuide(selectedScene, selectedRecipient)
    const todayDate = getTodayText()
    const defaultEventDate = getDefaultEventDateText()
    const favoriteId = buildFavoriteId(selectedScene, selectedRecipient, selectedBudget)
    const favorites = getStoredFavorites()
    const savedFavorite = favorites.find((item) => item.id === favoriteId)
    const eventDate = savedFavorite ? savedFavorite.eventDate : defaultEventDate

    this.setData({
      selectedScene,
      selectedRecipient,
      selectedBudget,
      selectedBudgetText: formatPriceRange(selectedBudget),
      recommendations: giftResult.recommendations,
      recommendationCount: giftResult.recommendations.length,
      matchNote: buildMatchNote(giftResult.exactCount, giftResult.recommendations.length),
      flowerGuide,
      todayDate,
      eventDate,
      reminderDate: getReminderDateText(eventDate),
      favoriteSaved: Boolean(savedFavorite),
      favoriteCount: favorites.length
    })
  },

  toggleGiftDetail(event) {
    const { id } = event.currentTarget.dataset
    const recommendations = this.data.recommendations.map((gift) => ({
      ...gift,
      expanded: gift.id === id ? !gift.expanded : gift.expanded
    }))

    this.setData({
      recommendations
    })
  },

  restartSelection() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  handleEventDateChange(event) {
    const eventDate = event.detail.value

    this.setData({
      eventDate,
      reminderDate: getReminderDateText(eventDate),
      favoriteSaved: false
    })
  },

  saveFavoriteReminder() {
    const {
      selectedScene,
      selectedRecipient,
      selectedBudget,
      selectedBudgetText,
      eventDate,
      reminderDate
    } = this.data

    if (!selectedScene || !selectedRecipient || !selectedBudget) {
      wx.showToast({
        title: '请先完成三步选择',
        icon: 'none'
      })
      return
    }

    const favoriteId = buildFavoriteId(selectedScene, selectedRecipient, selectedBudget)
    const favorites = getStoredFavorites()
    const nextFavorite = {
      id: favoriteId,
      scene: selectedScene,
      recipient: selectedRecipient,
      budget: selectedBudget,
      budgetText: selectedBudgetText,
      eventDate,
      reminderDate,
      advanceDays: REMINDER_ADVANCE_DAYS,
      updatedAt: new Date().toISOString()
    }
    const nextFavorites = favorites.filter((item) => item.id !== favoriteId)
    nextFavorites.unshift(nextFavorite)
    setStoredFavorites(nextFavorites)

    this.setData({
      favoriteSaved: true,
      favoriteCount: nextFavorites.length
    })

    wx.showToast({
      title: '已保存提醒',
      icon: 'success'
    })
  },

  removeFavoriteReminder() {
    const { selectedScene, selectedRecipient, selectedBudget } = this.data
    const favoriteId = buildFavoriteId(selectedScene, selectedRecipient, selectedBudget)
    const nextFavorites = getStoredFavorites().filter((item) => item.id !== favoriteId)
    setStoredFavorites(nextFavorites)

    this.setData({
      favoriteSaved: false,
      favoriteCount: nextFavorites.length
    })

    wx.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
  },

  onShareAppMessage() {
    const { selectedScene, selectedRecipient, selectedBudget } = this.data
    const query = [
      `scene=${encodeURIComponent(selectedScene)}`,
      `recipient=${encodeURIComponent(selectedRecipient)}`,
      `budget=${encodeURIComponent(selectedBudget)}`
    ].join('&')

    return {
      title: `送了莫推荐：给${selectedRecipient || 'TA'}的${selectedScene || '礼物'}灵感`,
      path: `/pages/result/result?${query}`
    }
  }
})
