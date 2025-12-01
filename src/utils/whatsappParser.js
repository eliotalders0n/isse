/**
 * WhatsApp Chat Parser
 * Supports both Android and iOS export formats
 */

/**
 * System messages to filter out (not actual user messages)
 */
const SYSTEM_MESSAGE_PATTERNS = [
  /^Messages and calls are end-to-end encrypted/i,
  /^<Media omitted>/i,
  /^This message was deleted/i,
  /^You deleted this message/i,
  /^Missed voice call/i,
  /^Missed video call/i,
  /^image omitted/i,
  /^video omitted/i,
  /^audio omitted/i,
  /^document omitted/i,
  /^sticker omitted/i,
  /^GIF omitted/i,
  /^Contact card omitted/i,
  /^location:/i,
  /^Live location shared/i,
  /joined using this group's invite link/i,
  /added you/i,
  /added .+/i,
  /left$/i,
  /removed .+/i,
  /changed the subject/i,
  /changed this group's icon/i,
  /changed the group description/i,
  /Security code changed/i,
  /created group/i,
  /changed their phone number/i,
  /Your security code with/i,
];

/**
 * Check if a message is a system message
 * @param {string} text - Message text
 * @returns {boolean} True if it's a system message
 */
const isSystemMessage = (text) => {
  return SYSTEM_MESSAGE_PATTERNS.some(pattern => pattern.test(text));
};

/**
 * Detect date format (DD/MM/YY vs MM/DD/YY) from first valid message
 * @param {string} fileContent - Raw text content
 * @returns {string} 'DMY' or 'MDY'
 */
const detectDateFormat = (fileContent) => {
  const lines = fileContent.split('\n').slice(0, 50); // Check first 50 lines
  const androidPattern = /^(\d{1,2})\/(\d{1,2})\/\d{2,4}/;

  for (const line of lines) {
    const match = line.match(androidPattern);
    if (match) {
      const first = parseInt(match[1], 10);
      const second = parseInt(match[2], 10);

      // If first number is > 12, it must be day (DD/MM format)
      if (first > 12) {
        return 'DMY';
      }
      // If second number is > 12, it must be day (MM/DD format)
      if (second > 12) {
        return 'MDY';
      }
    }
  }

  // Default to international format (DD/MM/YY) if ambiguous
  return 'DMY';
};

/**
 * Parse WhatsApp chat export file
 * @param {string} fileContent - Raw text content from WhatsApp export
 * @returns {Object} Parsed chat data with messages and metadata
 */
export const parseWhatsAppChat = (fileContent) => {
  const lines = fileContent.split('\n');
  const messages = [];
  let currentMessage = null;

  // Detect date format
  const dateFormat = detectDateFormat(fileContent);

  // Regex patterns for different WhatsApp export formats
  // Android: 1/1/23, 12:00 PM - John: Hello
  // iOS: [1/1/23, 12:00:00 PM] John: Hello
  const androidPattern = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\s*[-–]\s*([^:]+?):\s*(.*)$/;
  const iosPattern = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]\s*([^:]+?):\s*(.*)$/;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Try to match Android format
    let match = trimmedLine.match(androidPattern);

    // If no match, try iOS format
    if (!match) {
      match = trimmedLine.match(iosPattern);
    }

    if (match) {
      // Save previous message if exists and it's not a system message
      if (currentMessage && !isSystemMessage(currentMessage.text)) {
        messages.push(currentMessage);
      }

      // Create new message
      const [, date, time, sender, text] = match;
      currentMessage = {
        date,
        time,
        timestamp: parseTimestamp(date, time, dateFormat),
        sender: sender.trim(),
        text: text.trim(),
      };
    } else if (currentMessage) {
      // Multi-line message continuation
      currentMessage.text += '\n' + trimmedLine;
    }
  });

  // Don't forget the last message (if it's not a system message)
  if (currentMessage && !isSystemMessage(currentMessage.text)) {
    messages.push(currentMessage);
  }

  // Extract unique senders
  const senders = [...new Set(messages.map(m => m.sender))];

  // Calculate metadata
  const metadata = {
    totalMessages: messages.length,
    participants: senders,
    startDate: messages[0]?.timestamp,
    endDate: messages[messages.length - 1]?.timestamp,
    dateFormat: dateFormat,
  };

  return {
    messages,
    metadata,
  };
};

/**
 * Parse timestamp from WhatsApp date and time strings
 * @param {string} dateStr - Date string (e.g., "1/1/23" or "01/01/2023")
 * @param {string} timeStr - Time string (e.g., "12:00 PM")
 * @param {string} format - Date format ('DMY' or 'MDY')
 * @returns {Date} JavaScript Date object
 */
const parseTimestamp = (dateStr, timeStr, format = 'DMY') => {
  try {
    // Parse date parts
    const dateParts = dateStr.split('/');
    let month, day, year;

    if (format === 'DMY') {
      // International format: DD/MM/YY or DD/MM/YYYY
      day = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10);
      year = parseInt(dateParts[2], 10);
    } else {
      // US format: MM/DD/YY or MM/DD/YYYY
      month = parseInt(dateParts[0], 10);
      day = parseInt(dateParts[1], 10);
      year = parseInt(dateParts[2], 10);
    }

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    // Parse time
    let time = timeStr.trim();
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Handle AM/PM
    const isPM = /pm/i.test(time);
    const isAM = /am/i.test(time);

    // Remove AM/PM
    time = time.replace(/\s*(AM|PM|am|pm)/g, '').trim();

    const timeParts = time.split(':');
    hours = parseInt(timeParts[0], 10);
    minutes = parseInt(timeParts[1], 10);
    if (timeParts[2]) {
      seconds = parseInt(timeParts[2], 10);
    }

    // Convert to 24-hour format
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (error) {
    console.error('Error parsing timestamp:', dateStr, timeStr, error);
    return new Date();
  }
};

/**
 * Get messages grouped by date
 * @param {Array} messages - Array of parsed messages
 * @returns {Object} Messages grouped by date
 */
export const groupMessagesByDate = (messages) => {
  const grouped = {};

  messages.forEach((message) => {
    const dateKey = message.timestamp.toLocaleDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
};

/**
 * Get messages per day timeline
 * @param {Array} messages - Array of parsed messages
 * @returns {Array} Timeline data with date and message count
 */
export const getMessagesPerDay = (messages) => {
  const grouped = groupMessagesByDate(messages);
  return Object.keys(grouped)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => ({
      date,
      count: grouped[date].length,
    }));
};

/**
 * Get message statistics per sender
 * @param {Array} messages - Array of parsed messages
 * @returns {Object} Statistics per sender
 */
export const getStatsPerSender = (messages) => {
  const stats = {};

  messages.forEach((message) => {
    if (!stats[message.sender]) {
      stats[message.sender] = {
        messageCount: 0,
        totalCharacters: 0,
        avgMessageLength: 0,
        wordCount: 0,
      };
    }

    const sender = stats[message.sender];
    sender.messageCount++;
    sender.totalCharacters += message.text.length;
    sender.wordCount += message.text.split(/\s+/).filter(w => w.length > 0).length;
  });

  // Calculate averages
  Object.keys(stats).forEach(sender => {
    const senderStats = stats[sender];
    senderStats.avgMessageLength = Math.round(
      senderStats.totalCharacters / senderStats.messageCount
    );
    senderStats.avgWordsPerMessage = Math.round(
      senderStats.wordCount / senderStats.messageCount
    );
  });

  return stats;
};
