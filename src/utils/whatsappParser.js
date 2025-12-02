/**
 * WhatsApp Chat Parser
 * Supports both Android and iOS export formats, and JSON imports
 */

/**
 * Parse JSON chat export (e.g., from Babili Chrome extension)
 * @param {string} jsonContent - JSON string content
 * @returns {Object} Parsed chat data with messages and metadata
 */
export const parseJSONChat = (jsonContent) => {
  try {
    const data = JSON.parse(jsonContent);

    // Extract messages from JSON
    const rawMessages = data.messages || [];

    // First pass: identify actual participants and extract real name
    const senderCounts = {};
    let detectedName = null;

    rawMessages.forEach(msg => {
      if (!msg.text || msg.text.trim().length === 0) return;

      const sender = msg.sender || 'Unknown';

      // Skip system messages like "Message read by..."
      if (sender.includes('Message read by') || sender.includes('message read by')) {
        // Extract the actual name from "Message read by [Name]"
        const nameMatch = sender.match(/Message read by (.+)/i);
        if (nameMatch && nameMatch[1]) {
          detectedName = nameMatch[1].trim();
        }
        return;
      }

      // Count actual message senders
      senderCounts[sender] = (senderCounts[sender] || 0) + 1;
    });

    // Identify the two main participants
    const validSenders = Object.keys(senderCounts).filter(s => s !== 'Unknown');
    const unknownCount = senderCounts['Unknown'] || 0;

    // Determine the name for "Unknown" sender
    let otherParticipantName = detectedName || 'Unknown';

    // If we have exactly one valid sender and Unknown messages, map Unknown to detected name
    if (validSenders.length === 1 && unknownCount > 0 && detectedName) {
      otherParticipantName = detectedName;
    } else if (validSenders.length >= 2) {
      // Use the valid senders as-is
      otherParticipantName = validSenders.find(s => s !== 'You') || validSenders[0];
    }

    // Check if timestamps are missing
    const hasTimestamps = rawMessages.some(msg => msg.timestamp !== null && msg.timestamp !== undefined);

    // Base date for generating sequential timestamps if needed
    const baseDate = data.exportedAt ? new Date(data.exportedAt) : new Date();
    const oneMinute = 60 * 1000; // milliseconds

    // Transform to standard message format
    const messages = rawMessages
      .filter(msg => {
        if (!msg.text || msg.text.trim().length === 0) return false;

        const sender = msg.sender || 'Unknown';

        // Filter out system/metadata messages
        if (sender.includes('Message read by') || sender.includes('message read by')) {
          return false;
        }

        return true;
      })
      .map((msg, index) => {
        let timestamp;

        if (msg.timestamp) {
          // Use actual timestamp if available
          timestamp = new Date(msg.timestamp);
        } else if (hasTimestamps) {
          // Mixed timestamps - use current date for missing ones
          timestamp = new Date();
        } else {
          // No timestamps at all - generate sequential timestamps
          // Spread messages over past 30 days with realistic gaps
          const daysAgo = 30 - Math.floor((index / rawMessages.length) * 30);
          const minutesOffset = index * 5; // 5 minutes between messages on average
          timestamp = new Date(baseDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000) + (minutesOffset * oneMinute));
        }

        // Map sender names
        let senderName = msg.sender || 'Unknown';
        if (senderName === 'Unknown' && otherParticipantName !== 'Unknown') {
          senderName = otherParticipantName;
        }

        return {
          date: timestamp.toLocaleDateString(),
          time: timestamp.toLocaleTimeString(),
          timestamp: timestamp,
          sender: senderName,
          text: msg.text.trim(),
        };
      });

    // Extract unique senders from processed messages
    const participants = [...new Set(messages.map(m => m.sender))];

    // Calculate metadata
    const metadata = {
      totalMessages: messages.length,
      participants: participants,
      startDate: messages[0]?.timestamp,
      endDate: messages[messages.length - 1]?.timestamp,
      dateFormat: 'JSON',
      exportedAt: data.exportedAt,
      originalMessageCount: data.messageCount,
      hasRealTimestamps: hasTimestamps,
    };

    return {
      messages,
      metadata,
    };
  } catch (error) {
    throw new Error(`Failed to parse JSON chat: ${error.message}`);
  }
};

/**
 * Parse Gmail PDF export
 * @param {string} pdfText - Extracted text from Gmail PDF
 * @returns {Object} Parsed chat data with messages and metadata
 */
export const parseGmailPDF = (pdfText) => {
  try {
    console.log('Parsing Gmail PDF, text length:', pdfText.length);

    const messages = [];
    const lines = pdfText.split('\n').map(l => l.trim()).filter(l => l);

    // Gmail message pattern: "Sender Name <email> DATE at TIME"
    const senderPattern = /^(.+?)\s+<([^>]+@[^>]+)>\s+(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+at\s+\d{1,2}:\d{2})/;

    // Patterns to identify message boundaries and content to skip
    const skipPatterns = [
      /^To:\s+/i,
      /^From:\s+/i,
      /^Date:\s+/i,
      /^Subject:\s*$/i,
      /^Fwd:\s*$/i,
      /^-{5,}/,
      /Forwarded message/i,
      /^\d{2}\/\d{2}\/\d{4},\s+\d{2}:\d{2}/,
      /Gmail -/i,
      /^--\s*$/,
      /^\d+\s+messages?$/i,
      /^On .+ wrote:$/i,
      /mail\.google\.com/i,
      /^\d+\/\d+$/,  // Page numbers like "1/2"
      /^\d+K$/,  // File sizes
    ];

    const shouldSkipLine = (line) => {
      return skipPatterns.some(pattern => pattern.test(line));
    };

    let currentMessage = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if this line starts a new message
      const senderMatch = line.match(senderPattern);

      if (senderMatch) {
        // Save previous message if exists
        if (currentMessage && currentMessage.text.trim().length > 0) {
          messages.push({
            date: currentMessage.timestamp.toLocaleDateString(),
            time: currentMessage.timestamp.toLocaleTimeString(),
            timestamp: currentMessage.timestamp,
            sender: currentMessage.sender,
            text: currentMessage.text.trim(),
          });
          console.log('Saved message from', currentMessage.sender, ':', currentMessage.text.substring(0, 50));
        }

        // Start new message
        const senderName = senderMatch[1].trim();
        const email = senderMatch[2].trim();
        const dateTimeStr = senderMatch[3].trim();

        // Parse timestamp (e.g., "30 November 2025 at 15:54")
        const timestamp = new Date(dateTimeStr.replace(' at ', ' '));

        currentMessage = {
          sender: senderName,
          email: email,
          timestamp: timestamp,
          text: '',
        };

        console.log('Found message from:', senderName, 'at', dateTimeStr);
        continue;
      }

      // If we're in a message, collect content
      if (currentMessage) {
        // Skip metadata and quoted content
        if (shouldSkipLine(line)) {
          console.log('Skipping line:', line.substring(0, 50));
          continue;
        }

        // Stop collecting if we hit quoted content
        if (line.startsWith('On ') && line.includes(' wrote:')) {
          console.log('Stopping at quoted content:', line.substring(0, 50));
          continue;
        }

        // Skip signature lines (URLs repeated multiple times)
        if (line.includes('Personal Profile:') || line.includes('https://www.88radium.com')) {
          console.log('Skipping signature:', line.substring(0, 50));
          continue;
        }

        // Add content to current message
        if (line.length > 0) {
          if (currentMessage.text.length > 0) {
            currentMessage.text += ' ';
          }
          currentMessage.text += line;
          console.log('Added content:', line.substring(0, 50));
        }
      }
    }

    // Save last message
    if (currentMessage && currentMessage.text.trim().length > 0) {
      messages.push({
        date: currentMessage.timestamp.toLocaleDateString(),
        time: currentMessage.timestamp.toLocaleTimeString(),
        timestamp: currentMessage.timestamp,
        sender: currentMessage.sender,
        text: currentMessage.text.trim(),
      });
      console.log('Saved final message from', currentMessage.sender);
    }

    console.log('Total messages found:', messages.length);

    if (messages.length === 0) {
      throw new Error('No messages found in Gmail PDF. The file may be empty or in an unexpected format.');
    }

    // Extract unique participants
    const participants = [...new Set(messages.map(m => m.sender))];

    // Calculate metadata
    const metadata = {
      totalMessages: messages.length,
      participants: participants,
      startDate: messages[0]?.timestamp,
      endDate: messages[messages.length - 1]?.timestamp,
      dateFormat: 'Gmail PDF',
    };

    return {
      messages,
      metadata,
    };
  } catch (error) {
    console.error('Gmail PDF parse error:', error);
    throw new Error(`Failed to parse Gmail PDF: ${error.message}`);
  }
};

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
