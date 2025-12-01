/**
 * Analytics utilities for chat analysis
 */

/**
 * Calculate word frequency from messages
 * @param {Array} messages - Array of parsed messages
 * @param {number} topN - Number of top words to return
 * @returns {Array} Array of {word, count} objects
 */
export const calculateWordFrequency = (messages, topN = 20) => {
  const wordCount = {};

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
    'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
    'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
    'were', 'said', 'did', 'having', 'may', 'should', 'am', 'very', 'much',
  ]);

  messages.forEach((message) => {
    const words = message.text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

/**
 * Calculate word frequency per sender
 * @param {Array} messages - Array of parsed messages
 * @param {number} topN - Number of top words per sender
 * @returns {Object} Object with sender names as keys and word frequency arrays as values
 */
export const calculateWordFrequencyPerSender = (messages, topN = 10) => {
  const senderMessages = {};

  messages.forEach(message => {
    if (!senderMessages[message.sender]) {
      senderMessages[message.sender] = [];
    }
    senderMessages[message.sender].push(message);
  });

  const result = {};
  Object.keys(senderMessages).forEach(sender => {
    result[sender] = calculateWordFrequency(senderMessages[sender], topN);
  });

  return result;
};

/**
 * Find conversation streaks (consecutive days with messages)
 * @param {Array} messages - Array of parsed messages
 * @returns {Array} Array of streak objects {startDate, endDate, days}
 */
export const findConversationStreaks = (messages) => {
  if (messages.length === 0) return [];

  const dates = [...new Set(messages.map(m => m.timestamp.toDateString()))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const streaks = [];
  let currentStreak = {
    startDate: dates[0],
    endDate: dates[0],
    days: 1,
  };

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const dayDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak.endDate = dates[i];
      currentStreak.days++;
    } else {
      streaks.push({ ...currentStreak });
      currentStreak = {
        startDate: dates[i],
        endDate: dates[i],
        days: 1,
      };
    }
  }

  streaks.push(currentStreak);

  return streaks.sort((a, b) => b.days - a.days);
};

/**
 * Find silence periods (gaps in conversation)
 * @param {Array} messages - Array of parsed messages
 * @param {number} minDays - Minimum days to consider a silence
 * @returns {Array} Array of silence periods {startDate, endDate, days}
 */
export const findSilencePeriods = (messages, minDays = 3) => {
  if (messages.length === 0) return [];

  const dates = [...new Set(messages.map(m => m.timestamp.toDateString()))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const silences = [];

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const dayDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (dayDiff >= minDays) {
      silences.push({
        startDate: dates[i - 1],
        endDate: dates[i],
        days: dayDiff,
      });
    }
  }

  return silences.sort((a, b) => b.days - a.days);
};

/**
 * Calculate response time patterns
 * @param {Array} messages - Array of parsed messages
 * @returns {Object} Response time statistics per sender
 */
export const calculateResponseTimes = (messages) => {
  const responseTimes = {};

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currMsg = messages[i];

    if (prevMsg.sender !== currMsg.sender) {
      const timeDiff = (currMsg.timestamp - prevMsg.timestamp) / (1000 * 60);

      if (!responseTimes[currMsg.sender]) {
        responseTimes[currMsg.sender] = [];
      }

      if (timeDiff < 1440) {
        responseTimes[currMsg.sender].push(timeDiff);
      }
    }
  }

  const stats = {};
  Object.keys(responseTimes).forEach(sender => {
    const times = responseTimes[sender];
    if (times.length > 0) {
      const sorted = [...times].sort((a, b) => a - b);
      stats[sender] = {
        avgMinutes: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        medianMinutes: Math.round(sorted[Math.floor(sorted.length / 2)]),
        count: times.length,
      };
    }
  });

  return stats;
};

/**
 * Detect peak activity hours
 * @param {Array} messages - Array of parsed messages
 * @returns {Array} Hour-by-hour message count
 */
export const detectPeakHours = (messages) => {
  const hourCounts = Array(24).fill(0);

  messages.forEach(message => {
    const hour = message.timestamp.getHours();
    hourCounts[hour]++;
  });

  return hourCounts.map((count, hour) => ({
    hour,
    count,
    label: `${hour}:00`,
  }));
};

/**
 * Calculate engagement score over time
 * @param {Array} messages - Array of parsed messages
 * @param {string} period - 'day' or 'week'
 * @returns {Array} Engagement scores over time
 */
export const calculateEngagementScore = (messages, period = 'week') => {
  const grouped = {};

  messages.forEach(message => {
    const date = message.timestamp;
    let key;

    if (period === 'day') {
      key = date.toLocaleDateString();
    } else {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toLocaleDateString();
    }

    if (!grouped[key]) {
      grouped[key] = {
        messageCount: 0,
        totalLength: 0,
        uniqueSenders: new Set(),
      };
    }

    grouped[key].messageCount++;
    grouped[key].totalLength += message.text.length;
    grouped[key].uniqueSenders.add(message.sender);
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      score: Math.round(
        (data.messageCount * 0.4) +
        (data.totalLength / 10 * 0.3) +
        (data.uniqueSenders.size * 10 * 0.3)
      ),
      messageCount: data.messageCount,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Calculate message frequency score (0-10)
 * Used for gamification relationship level calculation
 * @param {Array} messages - Array of parsed messages
 * @param {number} totalDays - Total days of conversation
 * @returns {number} Score from 0-10 based on daily message frequency
 */
export const calculateMessageFrequencyScore = (messages, totalDays) => {
  if (!messages || messages.length === 0 || totalDays === 0) return 0;

  const avgPerDay = messages.length / totalDays;

  // Scoring curve:
  // 0-5 msgs/day: Linear 0-5
  // 6-10 msgs/day: 5-8
  // 11-20 msgs/day: 8-9
  // 21+ msgs/day: 10
  if (avgPerDay <= 5) return avgPerDay;
  if (avgPerDay <= 10) return 5 + ((avgPerDay - 5) / 5) * 3;
  if (avgPerDay <= 20) return 8 + ((avgPerDay - 10) / 10);
  return 10;
};

/**
 * Calculate communication balance score (0-10)
 * Measures how evenly participants contribute to the conversation
 * @param {Object} stats - Stats object with senderStats
 * @returns {number} Balance score from 0-10 (10 = perfect balance)
 */
export const calculateCommunicationBalance = (stats) => {
  if (!stats || !stats.senderStats) return 5;

  const senders = Object.keys(stats.senderStats);
  if (senders.length < 2) return 5; // Can't measure balance with 1 person

  const counts = senders.map(s => stats.senderStats[s].messageCount);
  const total = counts.reduce((a, b) => a + b, 0);

  if (total === 0) return 5;

  const balance = Math.min(...counts) / total;

  // Perfect balance (50/50) = 10 points
  // 45/55 or better = 10 points
  // Decreases linearly as imbalance grows
  return balance >= 0.45 ? 10 : (balance / 0.45) * 10;
};
