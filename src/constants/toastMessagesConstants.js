/**
 * Toast Messages Constants - Gender-aware app messages
 * Provides personalized toast notifications and loading messages based on user gender
 */

export const TOAST_MESSAGES = {
  participantSelected: {
    male: {
      title: 'Hey brother, let\'s dive in!',
      description: 'Here are your personalized insights ✨'
    },
    female: {
      title: 'Hey girl, let\'s dive in!',
      description: 'Here are your personalized insights ✨'
    },
    neutral: {
      title: 'Let\'s dive in!',
      description: 'Here are your personalized insights ✨'
    }
  },
  processing: {
    male: 'Hang tight king, we\'re reading between the lines...',
    female: 'Hang tight babe, we\'re reading between the lines...',
    neutral: 'Hang tight, we\'re reading between the lines...'
  }
};

/**
 * Get personalized toast message for participant selection
 * @param {string|null} userGender - 'male', 'female', or null (defaults to neutral)
 * @returns {object} Toast configuration with title and description
 */
export const getParticipantToast = (userGender) => {
  const gender = userGender || 'neutral';
  return TOAST_MESSAGES.participantSelected[gender] || TOAST_MESSAGES.participantSelected.neutral;
};

/**
 * Get personalized processing/loading message
 * @param {string|null} userGender - 'male', 'female', or null (defaults to neutral)
 * @returns {string} Loading message text
 */
export const getProcessingMessage = (userGender) => {
  const gender = userGender || 'neutral';
  return TOAST_MESSAGES.processing[gender] || TOAST_MESSAGES.processing.neutral;
};
