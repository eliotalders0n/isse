/**
 * Badge Definitions
 * All available badges with unlock criteria, icons, and metadata
 */

export const BADGE_CATEGORIES = {
  POSITIVE: 'positive',
  FUNNY: 'funny',
  SPICY: 'spicy',
  MILESTONE: 'milestone',
  ENGAGEMENT: 'engagement'
};

export const BADGE_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

/**
 * All available badges
 * Each badge has:
 * - id: unique identifier
 * - name: display name
 * - category: badge category
 * - description: what it means
 * - icon: React Icons component name
 * - rarity: how rare it is
 * - unlockCriteria: function that returns true if unlocked
 * - shareText: text for sharing
 * - colorScheme: Chakra UI color scheme
 */
export const ALL_BADGES = [
  // ==================== POSITIVE BADGES ====================
  {
    id: 'sunshine',
    name: 'Sunshine',
    category: BADGE_CATEGORIES.POSITIVE,
    description: '80% or more positive messages',
    icon: 'FiSun',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => chatData.sentiment.positivePercent >= 80,
    shareText: 'I spread sunshine in my conversations!',
    colorScheme: 'yellow'
  },
  {
    id: 'cheerleader',
    name: 'Cheerleader',
    category: BADGE_CATEGORIES.POSITIVE,
    description: 'High encouragement and support',
    icon: 'FiVolume2',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const supportKeywords = ['you can', 'believe in you', 'proud of you', 'amazing', 'great job'];
      const supportCount = chatData.messages.filter(m =>
        supportKeywords.some(keyword => m.text.toLowerCase().includes(keyword))
      ).length;
      return supportCount >= 20;
    },
    shareText: 'I\'m a Cheerleader in my conversations!',
    colorScheme: 'orange'
  },
  {
    id: 'glass_half_full',
    name: 'Glass Half Full',
    category: BADGE_CATEGORIES.POSITIVE,
    description: 'Consistently optimistic outlook',
    icon: 'FiCoffee',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const positiveWords = ['great', 'awesome', 'amazing', 'wonderful', 'fantastic'];
      const positiveCount = chatData.messages.filter(m =>
        positiveWords.some(word => m.text.toLowerCase().includes(word))
      ).length;
      return positiveCount >= 50;
    },
    shareText: 'My glass is always half full!',
    colorScheme: 'teal'
  },
  {
    id: 'gratitude_guru',
    name: 'Gratitude Guru',
    category: BADGE_CATEGORIES.POSITIVE,
    description: 'Expresses thanks frequently',
    icon: 'FiThumbsUp',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      const gratitudeCount = chatData.messages.filter(m => {
        const emotions = m.emotions || [];
        return emotions.includes('gratitude');
      }).length;
      return gratitudeCount >= 30;
    },
    shareText: 'I\'m grateful for great conversations! 🙏',
    colorScheme: 'purple'
  },

  // ==================== FUNNY BADGES ====================
  {
    id: 'lol_legend',
    name: 'LOL Legend',
    category: BADGE_CATEGORIES.FUNNY,
    description: 'Uses LOL, LMAO, ROFL frequently',
    icon: 'FiSmile',
    rarity: BADGE_RARITY.COMMON,
    unlockCriteria: (chatData) => {
      const laughKeywords = ['lol', 'lmao', 'rofl', 'haha', 'lmfao'];
      const laughCount = chatData.messages.filter(m =>
        laughKeywords.some(keyword => m.text.toLowerCase().includes(keyword))
      ).length;
      return laughCount >= 100;
    },
    shareText: 'I\'m a LOL Legend! 😂',
    colorScheme: 'pink'
  },
  {
    id: 'meme_master',
    name: 'Meme Master',
    category: BADGE_CATEGORIES.FUNNY,
    description: 'References memes and internet culture',
    icon: 'FiActivity',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const memeKeywords = ['meme', 'vibe', 'sus', 'bruh', 'fr fr', 'no cap'];
      const memeCount = chatData.messages.filter(m =>
        memeKeywords.some(keyword => m.text.toLowerCase().includes(keyword))
      ).length;
      return memeCount >= 25;
    },
    shareText: 'I\'m a certified Meme Master! 🎭',
    colorScheme: 'cyan'
  },
  {
    id: 'emoji_enthusiast',
    name: 'Emoji Enthusiast',
    category: BADGE_CATEGORIES.FUNNY,
    description: 'Uses 500+ emojis',
    icon: 'FiSmile',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojiCount = chatData.messages.reduce((count, m) => {
        const matches = m.text.match(emojiRegex);
        return count + (matches ? matches.length : 0);
      }, 0);
      return emojiCount >= 500;
    },
    shareText: 'Emoji Enthusiast right here! 😎',
    colorScheme: 'yellow'
  },
  {
    id: 'comedy_gold',
    name: 'Comedy Gold',
    category: BADGE_CATEGORIES.FUNNY,
    description: 'High joy emotion detection',
    icon: 'FiStar',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      const joyCount = chatData.messages.filter(m => {
        const emotions = m.emotions || [];
        return emotions.includes('joy');
      }).length;
      return joyCount >= 200;
    },
    shareText: 'My conversations are Comedy Gold! 🎪',
    colorScheme: 'orange'
  },

  // ==================== SPICY BADGES ====================
  {
    id: 'debate_champion',
    name: 'Debate Champion',
    category: BADGE_CATEGORIES.SPICY,
    description: 'Engages in healthy debates',
    icon: 'FiTarget',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const debateKeywords = ['but', 'however', 'actually', 'disagree', 'think differently'];
      const debateCount = chatData.messages.filter(m =>
        debateKeywords.some(keyword => m.text.toLowerCase().includes(keyword))
      ).length;
      return debateCount >= 50;
    },
    shareText: 'Debate Champion in the house! 🎯',
    colorScheme: 'red'
  },
  {
    id: 'truth_teller',
    name: 'Truth Teller',
    category: BADGE_CATEGORIES.SPICY,
    description: 'Keeps it real and honest',
    icon: 'FiCheckCircle',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      const honestyKeywords = ['honestly', 'truth is', 'real talk', 'not gonna lie', 'tbh'];
      const honestyCount = chatData.messages.filter(m =>
        honestyKeywords.some(keyword => m.text.toLowerCase().includes(keyword))
      ).length;
      return honestyCount >= 30;
    },
    shareText: 'I keep it 100! Truth Teller 💯',
    colorScheme: 'blue'
  },
  {
    id: 'passion_project',
    name: 'Passion Project',
    category: BADGE_CATEGORIES.SPICY,
    description: 'Expresses strong emotions',
    icon: 'FiTrendingUp',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const passionIndicators = ['!', 'love', 'hate', 'amazing', 'terrible'];
      const passionCount = chatData.messages.filter(m => {
        const hasExclamation = (m.text.match(/!/g) || []).length >= 2;
        const hasPassionWord = passionIndicators.some(word => m.text.toLowerCase().includes(word));
        return hasExclamation || hasPassionWord;
      }).length;
      return passionCount >= 100;
    },
    shareText: 'I\'m passionate about everything! 🔥',
    colorScheme: 'orange'
  },
  {
    id: 'lowkey_toxic',
    name: 'Lowkey Toxic',
    category: BADGE_CATEGORIES.SPICY,
    description: 'Occasional sassy moments',
    icon: 'FiMeh',
    rarity: BADGE_RARITY.EPIC,
    unlockCriteria: (chatData) => {
      const sassyKeywords = ['whatever', 'sure', 'fine', 'ok', 'k'];
      const oneWordMessages = chatData.messages.filter(m =>
        m.text.trim().split(/\s+/).length === 1 &&
        sassyKeywords.some(keyword => m.text.toLowerCase() === keyword)
      ).length;
      return oneWordMessages >= 20;
    },
    shareText: 'A little toxic, a lot of fun 😏',
    colorScheme: 'purple'
  },

  // ==================== MILESTONE BADGES ====================
  {
    id: 'first_100',
    name: 'Century',
    category: BADGE_CATEGORIES.MILESTONE,
    description: 'Sent 100 messages',
    icon: 'FiMessageCircle',
    rarity: BADGE_RARITY.COMMON,
    unlockCriteria: (chatData) => chatData.messages.length >= 100,
    shareText: 'We hit 100 messages! 💬',
    colorScheme: 'teal'
  },
  {
    id: 'first_1000',
    name: 'Chatterbox',
    category: BADGE_CATEGORIES.MILESTONE,
    description: 'Sent 1,000 messages',
    icon: 'FiMessageSquare',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => chatData.messages.length >= 1000,
    shareText: 'We hit 1,000 messages! 💭',
    colorScheme: 'blue'
  },
  {
    id: 'first_10000',
    name: 'Message Marathon',
    category: BADGE_CATEGORIES.MILESTONE,
    description: 'Sent 10,000 messages',
    icon: 'FiAward',
    rarity: BADGE_RARITY.LEGENDARY,
    unlockCriteria: (chatData) => chatData.messages.length >= 10000,
    shareText: 'We hit 10,000 messages! 🏆',
    colorScheme: 'gold'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    category: BADGE_CATEGORIES.MILESTONE,
    description: 'Frequently chats late at night',
    icon: 'FiMoon',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const lateNightMessages = chatData.messages.filter(m => {
        const hour = new Date(m.timestamp).getHours();
        return hour >= 23 || hour <= 4;
      }).length;
      return lateNightMessages >= 50;
    },
    shareText: 'Night Owl checking in! 🦉',
    colorScheme: 'purple'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    category: BADGE_CATEGORIES.MILESTONE,
    description: 'Frequently chats early in the morning',
    icon: 'FiSunrise',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const earlyMessages = chatData.messages.filter(m => {
        const hour = new Date(m.timestamp).getHours();
        return hour >= 5 && hour <= 7;
      }).length;
      return earlyMessages >= 50;
    },
    shareText: 'Early Bird gets the conversation! 🐦',
    colorScheme: 'yellow'
  },

  // ==================== ENGAGEMENT BADGES ====================
  {
    id: 'instant_reply',
    name: 'Instant Reply',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Average response time under 5 minutes',
    icon: 'FiZap',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      if (!chatData.analytics.responseTimes || chatData.analytics.responseTimes.length === 0) return false;
      const avgResponseTime = chatData.analytics.responseTimes.reduce((sum, rt) => sum + rt.minutes, 0) /
                              chatData.analytics.responseTimes.length;
      return avgResponseTime <= 5;
    },
    shareText: 'I reply instantly! ⚡',
    colorScheme: 'yellow'
  },
  {
    id: 'conversation_starter',
    name: 'Conversation Starter',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Initiates conversations frequently',
    icon: 'FiPlay',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      if (!chatData.analytics.streaks || chatData.analytics.streaks.length === 0) return false;
      return chatData.analytics.streaks.length >= 10;
    },
    shareText: 'I\'m a Conversation Starter! 🎬',
    colorScheme: 'green'
  },
  {
    id: 'balanced_duo',
    name: 'Balanced Duo',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Both participants contribute equally',
    icon: 'FiSliders',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      if (!chatData.stats.senderStats) return false;
      const senders = Object.keys(chatData.stats.senderStats);
      if (senders.length !== 2) return false;

      const counts = senders.map(s => chatData.stats.senderStats[s].messageCount);
      const total = counts.reduce((a, b) => a + b, 0);
      const balance = Math.min(...counts) / total;

      return balance >= 0.45; // Within 45-55% balance
    },
    shareText: 'We\'re a Balanced Duo! ⚖️',
    colorScheme: 'teal'
  },
  {
    id: 'week_streak',
    name: '7-Day Streak',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Chatted for 7 consecutive days',
    icon: 'FiTrendingUp',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      if (!chatData.analytics.streaks || chatData.analytics.streaks.length === 0) return false;
      return chatData.analytics.streaks[0].days >= 7;
    },
    shareText: 'We have a 7-day streak! 🔥',
    colorScheme: 'orange'
  },
  {
    id: 'month_streak',
    name: '30-Day Streak',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Chatted for 30 consecutive days',
    icon: 'FiActivity',
    rarity: BADGE_RARITY.RARE,
    unlockCriteria: (chatData) => {
      if (!chatData.analytics.streaks || chatData.analytics.streaks.length === 0) return false;
      return chatData.analytics.streaks[0].days >= 30;
    },
    shareText: 'We have a 30-day streak! 💪',
    colorScheme: 'red'
  },
  {
    id: 'hundred_day_streak',
    name: '100-Day Streak',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Chatted for 100 consecutive days',
    icon: 'FiStar',
    rarity: BADGE_RARITY.LEGENDARY,
    unlockCriteria: (chatData) => {
      if (!chatData.analytics.streaks || chatData.analytics.streaks.length === 0) return false;
      return chatData.analytics.streaks[0].days >= 100;
    },
    shareText: 'We have a 100-day streak! 👑',
    colorScheme: 'purple'
  },
  {
    id: 'deep_talker',
    name: 'Deep Talker',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Sends long, thoughtful messages',
    icon: 'FiFileText',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const longMessages = chatData.messages.filter(m => m.text.length >= 200).length;
      return longMessages >= 50;
    },
    shareText: 'I\'m a Deep Talker! 📝',
    colorScheme: 'blue'
  },
  {
    id: 'voice_note_addict',
    name: 'Voice Note Addict',
    category: BADGE_CATEGORIES.ENGAGEMENT,
    description: 'Mentions voice notes frequently',
    icon: 'FiMic',
    rarity: BADGE_RARITY.UNCOMMON,
    unlockCriteria: (chatData) => {
      const voiceNoteRefs = chatData.messages.filter(m =>
        m.text.toLowerCase().includes('voice note') ||
        m.text.toLowerCase().includes('vn') ||
        m.text.includes('🎤')
      ).length;
      return voiceNoteRefs >= 20;
    },
    shareText: 'Voice Note Addict! 🎤',
    colorScheme: 'pink'
  }
];

/**
 * Get badges by category
 */
export const getBadgesByCategory = (category) => {
  return ALL_BADGES.filter(badge => badge.category === category);
};

/**
 * Get badges by rarity
 */
export const getBadgesByRarity = (rarity) => {
  return ALL_BADGES.filter(badge => badge.rarity === rarity);
};

/**
 * Get badge by ID
 */
export const getBadgeById = (id) => {
  return ALL_BADGES.find(badge => badge.id === id);
};

/**
 * Check if a specific badge is unlocked
 */
export const checkBadgeUnlock = (badgeId, chatData) => {
  const badge = getBadgeById(badgeId);
  if (!badge) return false;

  try {
    return badge.unlockCriteria(chatData);
  } catch (error) {
    console.error(`Error checking badge ${badgeId}:`, error);
    return false;
  }
};
