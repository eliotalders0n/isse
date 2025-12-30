/**
 * Feeling Map Constants - Gender-aware relationship insights
 * Centralized mapping of relationship intents to descriptions with gendered pronouns
 */

// Pronoun mappings for each gender
export const GENDER_PRONOUNS = {
  male: { he: 'he', his: 'his', him: 'him', is: 'is' },
  female: { he: 'she', his: 'her', him: 'her', is: 'is' },
  neutral: { he: 'they', his: 'their', him: 'them', is: 'are' }
};

// Interpolate pronouns into text templates
export const interpolatePronouns = (text, gender = 'neutral') => {
  const pronouns = GENDER_PRONOUNS[gender] || GENDER_PRONOUNS.neutral;
  return text
    .replace(/\{he\}/g, pronouns.he)
    .replace(/\{He\}/g, pronouns.he.charAt(0).toUpperCase() + pronouns.he.slice(1))
    .replace(/\{his\}/g, pronouns.his)
    .replace(/\{His\}/g, pronouns.his.charAt(0).toUpperCase() + pronouns.his.slice(1))
    .replace(/\{him\}/g, pronouns.him)
    .replace(/\{Him\}/g, pronouns.him.charAt(0).toUpperCase() + pronouns.him.slice(1))
    .replace(/\{is\}/g, pronouns.is);
};

/**
 * Feeling Map - Intent-based relationship insights
 * Each intent category has 10 levels based on REALISTIC score thresholds from semantic engine
 * Thresholds: 0.4, 0.3, 0.25, 0.2, 0.15, 0.12, 0.09, 0.06, 0.03, 0
 * Uses template variables {he}, {his}, {him}, {is} for gender-aware pronouns
 */
export const FEELING_MAP = {
  affection: [
    {
      threshold: 0.4,
      word: 'All In',
      intensity: 'Extreme',
      color: 'pink.700',
      bgGradient: 'linear(to-r, pink.600, rose.700)',
      punchline: '{He}\'s pouring everything into you — the love is undeniable.',
      signals: ['Constant affection', 'Deep reassurance', 'Overwhelming care']
    },
    {
      threshold: 0.3,
      word: 'Completely Gone',
      intensity: 'Very High',
      color: 'pink.600',
      bgGradient: 'linear(to-r, pink.500, rose.600)',
      punchline: 'This one is drowning in feelings for you — {he} can\'t hide it.',
      signals: ['Heavy affection', 'Consistent sweetness', 'Pure devotion']
    },
    {
      threshold: 0.25,
      word: 'Head Over Heels',
      intensity: 'High',
      color: 'pink.600',
      bgGradient: 'linear(to-r, pink.500, rose.500)',
      punchline: 'The care is loud, even when {he}\'s quiet — {he}\'s deeply soft with you.',
      signals: ['Sweet words', 'Consistent reassurance', 'Gentle tone']
    },
    {
      threshold: 0.2,
      word: 'Really Into You',
      intensity: 'Medium-High',
      color: 'rose.600',
      bgGradient: 'linear(to-r, rose.500, pink.500)',
      punchline: '{He}\'s showing you real care — not performative, just genuine.',
      signals: ['Strong affection', 'Protective language', 'Warm consistency']
    },
    {
      threshold: 0.15,
      word: 'Tender Heart',
      intensity: 'Medium',
      color: 'rose.500',
      bgGradient: 'linear(to-r, rose.400, pink.400)',
      punchline: '{He}\'s emotionally invested — you can feel {him} choosing you.',
      signals: ['Caring language', 'Emotional presence', 'Thoughtful replies']
    },
    {
      threshold: 0.12,
      word: 'Soft for You',
      intensity: 'Medium-Low',
      color: 'rose.500',
      bgGradient: 'linear(to-r, rose.400, orange.400)',
      punchline: '{He}\'s emotionally present — not perfect, but {he}\'s trying to show you.',
      signals: ['Affection cues', 'Supportive replies', 'Good reciprocity']
    },
    {
      threshold: 0.09,
      word: 'Growing Fond',
      intensity: 'Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, pink.400)',
      punchline: 'The warmth is building — {he}\'s starting to let {his} guard down.',
      signals: ['Emerging affection', 'Occasional sweetness', 'Gentle moments']
    },
    {
      threshold: 0.06,
      word: 'Fond & Comfortable',
      intensity: 'Very Low',
      color: 'orange.500',
      bgGradient: 'linear(to-r, orange.400, pink.400)',
      punchline: 'The vibe is steady — like "I\'m here" without the fireworks.',
      signals: ['Friendly warmth', 'Light caring language', 'Stable engagement']
    },
    {
      threshold: 0.03,
      word: 'Mildly Caring',
      intensity: 'Minimal',
      color: 'orange.400',
      bgGradient: 'linear(to-r, orange.300, pink.300)',
      punchline: '{He}\'s not cold, just reserved — the care is subtle.',
      signals: ['Small gestures', 'Occasional warmth', 'Polite concern']
    },
    {
      threshold: 0,
      word: 'Low-Key Caring',
      intensity: 'Trace',
      color: 'orange.300',
      bgGradient: 'linear(to-r, orange.200, pink.200)',
      punchline: '{He} cares, but {he}\'s not expressing it strongly in text — yet.',
      signals: ['Barely visible cues', 'Few affection tokens']
    }
  ],

  passion: [
    {
      threshold: 0.4,
      word: 'On Fire',
      intensity: 'Extreme',
      color: 'red.700',
      bgGradient: 'linear(to-r, red.600, pink.600)',
      punchline: '{He}\'s burning for you — the desire is consuming {him}.',
      signals: ['Intense longing', 'Constant craving', 'Raw passion']
    },
    {
      threshold: 0.3,
      word: 'Obsessed',
      intensity: 'Very High',
      color: 'red.700',
      bgGradient: 'linear(to-r, red.600, pink.500)',
      punchline: '{He} can\'t stop thinking about you — it\'s written all over {his} messages.',
      signals: ['Heavy desire', 'Persistent pull', 'Overwhelming attraction']
    },
    {
      threshold: 0.25,
      word: 'Can\'t Get Enough',
      intensity: 'High',
      color: 'red.600',
      bgGradient: 'linear(to-r, red.500, pink.500)',
      punchline: '{He}\'s pulled to you — the desire is obvious in how {he} writes.',
      signals: ['Flirty language', 'Chasing your attention', 'Strong pull']
    },
    {
      threshold: 0.2,
      word: 'Deeply Attracted',
      intensity: 'Medium-High',
      color: 'red.600',
      bgGradient: 'linear(to-r, red.500, orange.500)',
      punchline: '{He}\'s not hiding the want — you can feel the heat.',
      signals: ['Direct desire', 'Consistent flirting', 'Physical cues']
    },
    {
      threshold: 0.15,
      word: 'Craving You',
      intensity: 'Medium',
      color: 'red.500',
      bgGradient: 'linear(to-r, red.400, orange.500)',
      punchline: '{He} misses you. Even small gaps feel like too long for {him}.',
      signals: ['"Miss you" cues', 'Checking in', 'High emotional heat']
    },
    {
      threshold: 0.12,
      word: 'Wanting More',
      intensity: 'Medium-Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, red.500)',
      punchline: 'The attraction is clear — {he}\'s leaning in, not pulling back.',
      signals: ['Suggestive language', 'Playful desire', 'Building tension']
    },
    {
      threshold: 0.09,
      word: 'Drawn to You',
      intensity: 'Low',
      color: 'orange.500',
      bgGradient: 'linear(to-r, orange.400, red.400)',
      punchline: '{He}\'s feeling the pull — the chemistry is starting to show.',
      signals: ['Emerging attraction', 'Light flirting', 'Curious energy']
    },
    {
      threshold: 0.06,
      word: 'Feeling You',
      intensity: 'Very Low',
      color: 'orange.500',
      bgGradient: 'linear(to-r, orange.400, pink.400)',
      punchline: 'There\'s chemistry — just not fully expressed in words.',
      signals: ['Suggestive tone', 'Playful teasing']
    },
    {
      threshold: 0.03,
      word: 'Low-Key Interested',
      intensity: 'Minimal',
      color: 'orange.400',
      bgGradient: 'linear(to-r, orange.300, pink.300)',
      punchline: '{He}\'s curious, but keeping it subtle for now.',
      signals: ['Mild attraction', 'Careful flirting', 'Testing waters']
    },
    {
      threshold: 0,
      word: 'Quiet Attraction',
      intensity: 'Trace',
      color: 'orange.300',
      bgGradient: 'linear(to-r, orange.200, pink.200)',
      punchline: '{He}\'s interested, but {he}\'s not turning it up in text.',
      signals: ['Barely visible cues', 'Light pull']
    }
  ],

  commitment: [
    {
      threshold: 0.4,
      word: 'All Yours',
      intensity: 'Extreme',
      color: 'blue.800',
      bgGradient: 'linear(to-r, blue.700, purple.700)',
      punchline: '{He}\'s fully committed — no hesitation, no holding back.',
      signals: ['Total certainty', 'Long-term planning', 'Absolute dedication']
    },
    {
      threshold: 0.3,
      word: 'Building Forever',
      intensity: 'Very High',
      color: 'blue.700',
      bgGradient: 'linear(to-r, blue.600, purple.600)',
      punchline: '{He}\'s planning a future with you — the commitment is rock solid.',
      signals: ['Future-focused', 'Strong "we" language', 'Partnership energy']
    },
    {
      threshold: 0.25,
      word: 'Locked In',
      intensity: 'High',
      color: 'blue.700',
      bgGradient: 'linear(to-r, blue.600, indigo.600)',
      punchline: '{He}\'s serious about you — you can feel the "we" energy.',
      signals: ['Future talk', 'Consistency', 'Protective language']
    },
    {
      threshold: 0.2,
      word: 'Ready for Real',
      intensity: 'Medium-High',
      color: 'blue.600',
      bgGradient: 'linear(to-r, blue.500, purple.500)',
      punchline: '{He}\'s not playing games — {he}\'s showing up with intention.',
      signals: ['Clear direction', 'Reliable presence', 'Steady investment']
    },
    {
      threshold: 0.15,
      word: 'Serious Intentions',
      intensity: 'Medium',
      color: 'blue.600',
      bgGradient: 'linear(to-r, blue.500, indigo.500)',
      punchline: '{He}\'s investing. Not just vibes — {he}\'s showing direction.',
      signals: ['Plans', 'Follow-through', 'Stable presence']
    },
    {
      threshold: 0.12,
      word: 'Getting Serious',
      intensity: 'Medium-Low',
      color: 'indigo.600',
      bgGradient: 'linear(to-r, indigo.500, blue.500)',
      punchline: '{He}\'s moving past casual — you can see the shift happening.',
      signals: ['Growing investment', 'More consistency', 'Future hints']
    },
    {
      threshold: 0.09,
      word: 'Considering It',
      intensity: 'Low',
      color: 'indigo.500',
      bgGradient: 'linear(to-r, indigo.400, blue.400)',
      punchline: '{He}\'s thinking about the long game — still figuring it out.',
      signals: ['Some future talk', 'Cautious optimism', 'Weighing options']
    },
    {
      threshold: 0.06,
      word: 'Testing the Waters',
      intensity: 'Very Low',
      color: 'indigo.500',
      bgGradient: 'linear(to-r, indigo.400, cyan.400)',
      punchline: '{He} likes you, but {he}\'s still cautious about "where this is going."',
      signals: ['Occasional future cues', 'Some hesitation']
    },
    {
      threshold: 0.03,
      word: 'Vaguely Interested',
      intensity: 'Minimal',
      color: 'blue.400',
      bgGradient: 'linear(to-r, blue.300, cyan.300)',
      punchline: '{He}\'s open to possibilities, but not making promises yet.',
      signals: ['Very light future talk', 'Non-committal', 'Wait-and-see']
    },
    {
      threshold: 0,
      word: 'Interested… But Not Yet Clear',
      intensity: 'Trace',
      color: 'cyan.400',
      bgGradient: 'linear(to-r, cyan.300, blue.200)',
      punchline: 'The interest is there, but {he} hasn\'t made it definite.',
      signals: ['No future signals', 'Unclear intentions']
    }
  ],

  conflict: [
    {
      threshold: 0.4,
      word: 'Explosive',
      intensity: 'Extreme',
      color: 'red.800',
      bgGradient: 'linear(to-r, red.700, orange.700)',
      punchline: '{He}\'s past the breaking point — the anger is uncontained.',
      signals: ['Harsh language', 'Blame-shifting', 'Emotional outbursts']
    },
    {
      threshold: 0.3,
      word: 'Furious',
      intensity: 'Very High',
      color: 'red.700',
      bgGradient: 'linear(to-r, red.600, orange.600)',
      punchline: '{He}\'s deeply upset — the frustration is boiling over.',
      signals: ['Very sharp tone', 'Heavy defensiveness', 'Hostile energy']
    },
    {
      threshold: 0.25,
      word: 'Fed Up',
      intensity: 'High',
      color: 'red.700',
      bgGradient: 'linear(to-r, red.600, orange.500)',
      punchline: '{He}\'s on edge — and it\'s spilling into the way {he} speaks to you.',
      signals: ['Sharp tone', 'Defensiveness', 'Repeated pushback']
    },
    {
      threshold: 0.2,
      word: 'Really Annoyed',
      intensity: 'Medium-High',
      color: 'orange.700',
      bgGradient: 'linear(to-r, orange.600, red.500)',
      punchline: '{He}\'s triggered and it shows — the patience is wearing thin.',
      signals: ['Clipped responses', 'Clear frustration', 'Tension building']
    },
    {
      threshold: 0.15,
      word: 'Pressed',
      intensity: 'Medium',
      color: 'orange.700',
      bgGradient: 'linear(to-r, orange.600, yellow.500)',
      punchline: 'Something is bothering {him} — {he}\'s reacting, not connecting.',
      signals: ['Tension markers', 'Short replies', 'Resistance cues']
    },
    {
      threshold: 0.12,
      word: 'Frustrated',
      intensity: 'Medium-Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, yellow.500)',
      punchline: '{He}\'s losing composure — you can feel the irritation creeping in.',
      signals: ['Impatient tone', 'Defensive moments', 'Visible tension']
    },
    {
      threshold: 0.09,
      word: 'Irritated',
      intensity: 'Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, yellow.400)',
      punchline: '{He}\'s not fully calm — small things are triggering {him}.',
      signals: ['Annoyance cues', 'Dry tone', 'Dismissive moments']
    },
    {
      threshold: 0.06,
      word: 'Slightly Annoyed',
      intensity: 'Very Low',
      color: 'yellow.600',
      bgGradient: 'linear(to-r, yellow.500, orange.400)',
      punchline: 'There\'s a bit of edge — not full conflict, just friction.',
      signals: ['Minor tension', 'Subtle pushback', 'Cool tone']
    },
    {
      threshold: 0.03,
      word: 'A Bit Off',
      intensity: 'Minimal',
      color: 'yellow.500',
      bgGradient: 'linear(to-r, yellow.400, orange.300)',
      punchline: 'The mood is slightly tense, but not out of control.',
      signals: ['Occasional friction', 'Minor pushback']
    },
    {
      threshold: 0,
      word: 'Barely Tense',
      intensity: 'Trace',
      color: 'yellow.400',
      bgGradient: 'linear(to-r, yellow.300, orange.200)',
      punchline: 'There\'s a hint of disagreement, but it\'s manageable.',
      signals: ['Minimal conflict', 'Rare friction']
    }
  ],

  reconciliation: [
    {
      threshold: 0.4,
      word: 'Deeply Apologetic',
      intensity: 'Extreme',
      color: 'green.800',
      bgGradient: 'linear(to-r, green.700, teal.700)',
      punchline: '{He}\'s doing everything to make it right — the remorse is heavy.',
      signals: ['Sincere apologies', 'Accountability', 'Active repair work']
    },
    {
      threshold: 0.3,
      word: 'Fighting for You',
      intensity: 'Very High',
      color: 'green.700',
      bgGradient: 'linear(to-r, green.600, teal.600)',
      punchline: '{He}\'s not giving up — {he}\'s actively working to save this.',
      signals: ['Strong repair attempts', 'Vulnerability', 'Clear remorse']
    },
    {
      threshold: 0.25,
      word: 'Trying to Fix It',
      intensity: 'High',
      color: 'green.700',
      bgGradient: 'linear(to-r, green.600, teal.500)',
      punchline: '{He}\'s choosing the relationship — {he} wants peace with you.',
      signals: ['Apology language', 'Repair attempts', 'Softening tone']
    },
    {
      threshold: 0.2,
      word: 'Working on It',
      intensity: 'Medium-High',
      color: 'green.600',
      bgGradient: 'linear(to-r, green.500, teal.500)',
      punchline: '{He}\'s putting in effort to heal the rift — you can see {him} trying.',
      signals: ['Reconciliation cues', 'Olive branches', 'Gentle approach']
    },
    {
      threshold: 0.15,
      word: 'Regretful',
      intensity: 'Medium',
      color: 'teal.700',
      bgGradient: 'linear(to-r, teal.600, green.600)',
      punchline: '{He} knows {he} crossed a line and {he}\'s trying to come back.',
      signals: ['Backtracking', 'Clarifying', 'Restoring calm']
    },
    {
      threshold: 0.12,
      word: 'Attempting Peace',
      intensity: 'Medium-Low',
      color: 'teal.600',
      bgGradient: 'linear(to-r, teal.500, green.500)',
      punchline: '{He}\'s reaching out to smooth things over — the effort is there.',
      signals: ['Softening language', 'Compromise signals', 'Calming down']
    },
    {
      threshold: 0.09,
      word: 'Cooling Down',
      intensity: 'Low',
      color: 'green.600',
      bgGradient: 'linear(to-r, green.500, teal.400)',
      punchline: 'The tension is dropping — the conversation is stabilising.',
      signals: ['Calmer tone', 'Fewer conflict markers']
    },
    {
      threshold: 0.06,
      word: 'De-escalating',
      intensity: 'Very Low',
      color: 'teal.500',
      bgGradient: 'linear(to-r, teal.400, green.400)',
      punchline: '{He}\'s stepping back from the heat — trying to find balance.',
      signals: ['Reduced tension', 'Neutral tone', 'Backing off']
    },
    {
      threshold: 0.03,
      word: 'Peace-Seeking',
      intensity: 'Minimal',
      color: 'teal.400',
      bgGradient: 'linear(to-r, teal.300, green.300)',
      punchline: '{He} wants less drama — {he}\'s leaning toward calm.',
      signals: ['Minor de-escalation', 'Slight softening']
    },
    {
      threshold: 0,
      word: 'Barely Reconciling',
      intensity: 'Trace',
      color: 'teal.300',
      bgGradient: 'linear(to-r, teal.200, green.200)',
      punchline: 'There\'s a tiny hint of peace-making, but it\'s subtle.',
      signals: ['Minimal repair cues']
    }
  ],

  uncertainty: [
    {
      threshold: 0.4,
      word: 'All Over the Place',
      intensity: 'Extreme',
      color: 'purple.800',
      bgGradient: 'linear(to-r, purple.700, gray.700)',
      punchline: '{He}\'s completely confused — the mixed signals are constant.',
      signals: ['Extreme contradictions', 'No clear direction', 'Total ambiguity']
    },
    {
      threshold: 0.3,
      word: 'Totally Confused',
      intensity: 'Very High',
      color: 'purple.700',
      bgGradient: 'linear(to-r, purple.600, gray.600)',
      punchline: '{He}\'s lost in {his} own head — clarity is nowhere in sight.',
      signals: ['Heavy confusion', 'Many contradictions', 'Flip-flopping']
    },
    {
      threshold: 0.25,
      word: 'Hot & Cold',
      intensity: 'High',
      color: 'purple.700',
      bgGradient: 'linear(to-r, purple.600, gray.500)',
      punchline: 'The signals are not stable — today yes, tomorrow maybe.',
      signals: ['Contradicting cues', 'Many questions', 'Low clarity']
    },
    {
      threshold: 0.2,
      word: 'Very Unsure',
      intensity: 'Medium-High',
      color: 'gray.700',
      bgGradient: 'linear(to-r, gray.600, purple.500)',
      punchline: '{He}\'s second-guessing everything — the doubt is obvious.',
      signals: ['Frequent uncertainty', 'Wavering', 'Indecisive']
    },
    {
      threshold: 0.15,
      word: 'Not Sure Yet',
      intensity: 'Medium',
      color: 'gray.700',
      bgGradient: 'linear(to-r, gray.600, purple.400)',
      punchline: '{He}\'s undecided — {he}\'s still weighing how deep to go.',
      signals: ['Hesitation', 'Non-committal replies']
    },
    {
      threshold: 0.12,
      word: 'Confused',
      intensity: 'Medium-Low',
      color: 'purple.600',
      bgGradient: 'linear(to-r, purple.500, gray.500)',
      punchline: '{He}\'s sending mixed messages — {he} doesn\'t seem clear either.',
      signals: ['Some contradictions', 'Unclear intent', 'Questions']
    },
    {
      threshold: 0.09,
      word: 'In His Head',
      intensity: 'Low',
      color: 'purple.600',
      bgGradient: 'linear(to-r, purple.500, indigo.500)',
      punchline: '{He}\'s thinking a lot — but not saying enough.',
      signals: ['Low certainty', 'Indirect answers']
    },
    {
      threshold: 0.06,
      word: 'A Bit Unclear',
      intensity: 'Very Low',
      color: 'indigo.500',
      bgGradient: 'linear(to-r, indigo.400, purple.400)',
      punchline: '{He}\'s not fully transparent — some ambiguity is there.',
      signals: ['Vague responses', 'Mild confusion', 'Some hesitation']
    },
    {
      threshold: 0.03,
      word: 'Reading the Room',
      intensity: 'Minimal',
      color: 'indigo.400',
      bgGradient: 'linear(to-r, indigo.300, purple.300)',
      punchline: '{He}\'s watching how things go before {he} shows {his} full hand.',
      signals: ['Careful tone', 'Slow clarity']
    },
    {
      threshold: 0,
      word: 'Slightly Uncertain',
      intensity: 'Trace',
      color: 'indigo.300',
      bgGradient: 'linear(to-r, indigo.200, purple.200)',
      punchline: 'There\'s a hint of uncertainty, but it\'s minor.',
      signals: ['Minimal ambiguity']
    }
  ],

  urgency: [
    {
      threshold: 0.4,
      word: 'Desperate',
      intensity: 'Extreme',
      color: 'orange.800',
      bgGradient: 'linear(to-r, orange.700, yellow.700)',
      punchline: '{He}\'s in panic mode — needs your response immediately.',
      signals: ['Frantic messaging', 'Extreme pressure', 'Overwhelming urgency']
    },
    {
      threshold: 0.3,
      word: 'Extremely Impatient',
      intensity: 'Very High',
      color: 'orange.700',
      bgGradient: 'linear(to-r, orange.600, yellow.600)',
      punchline: '{He} can\'t wait — the urgency is consuming {him}.',
      signals: ['Constant follow-ups', 'High pressure', 'Demanding tone']
    },
    {
      threshold: 0.25,
      word: 'Chasing Your Attention',
      intensity: 'High',
      color: 'orange.700',
      bgGradient: 'linear(to-r, orange.600, red.500)',
      punchline: '{He} wants a response now-now — {he}\'s emotionally activated.',
      signals: ['Quick follow-ups', 'Pressure cues', 'High urgency']
    },
    {
      threshold: 0.2,
      word: 'Very Impatient',
      intensity: 'Medium-High',
      color: 'yellow.700',
      bgGradient: 'linear(to-r, yellow.600, orange.600)',
      punchline: 'Waiting is not an option for {him} — {he} needs answers now.',
      signals: ['Time-sensitive language', 'Multiple pings', 'Clear urgency']
    },
    {
      threshold: 0.15,
      word: 'Restless',
      intensity: 'Medium',
      color: 'yellow.700',
      bgGradient: 'linear(to-r, yellow.600, orange.500)',
      punchline: '{He} doesn\'t like waiting — {he} wants reassurance or action.',
      signals: ['Time pressure', 'Repeated pings']
    },
    {
      threshold: 0.12,
      word: 'Eager for Response',
      intensity: 'Medium-Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, yellow.500)',
      punchline: '{He}\'s waiting on you — the anticipation is building.',
      signals: ['Follow-ups', 'Check-ins', 'Expectant tone']
    },
    {
      threshold: 0.09,
      word: 'On Your Case',
      intensity: 'Low',
      color: 'orange.600',
      bgGradient: 'linear(to-r, orange.500, red.400)',
      punchline: '{He}\'s pushing for an answer, but it\'s not too intense.',
      signals: ['Follow-ups', 'Immediacy language']
    },
    {
      threshold: 0.06,
      word: 'Somewhat Urgent',
      intensity: 'Very Low',
      color: 'yellow.600',
      bgGradient: 'linear(to-r, yellow.500, orange.400)',
      punchline: '{He}\'s hoping for a reply soon — not desperate, just eager.',
      signals: ['Light pressure', 'Gentle reminders']
    },
    {
      threshold: 0.03,
      word: 'Anticipating',
      intensity: 'Minimal',
      color: 'yellow.500',
      bgGradient: 'linear(to-r, yellow.400, orange.300)',
      punchline: '{He}\'s expecting something — a plan, a reply, or clarity.',
      signals: ['Deadline language', 'Check-ins']
    },
    {
      threshold: 0,
      word: 'Slightly Expectant',
      intensity: 'Trace',
      color: 'yellow.400',
      bgGradient: 'linear(to-r, yellow.300, orange.200)',
      punchline: 'There\'s a hint of expectation, but it\'s relaxed.',
      signals: ['Minimal urgency']
    }
  ],

  drama: [
    {
      threshold: 0.4,
      word: 'Total Chaos',
      intensity: 'Extreme',
      color: 'pink.800',
      bgGradient: 'linear(to-r, red.600, pink.700)',
      punchline: 'This is a full-on emotional rollercoaster — nothing is stable.',
      signals: ['Extreme swings', 'Constant drama', 'Overwhelming emotion']
    },
    {
      threshold: 0.3,
      word: 'Highly Dramatic',
      intensity: 'Very High',
      color: 'pink.700',
      bgGradient: 'linear(to-r, red.500, pink.600)',
      punchline: '{He}\'s bringing all the intensity — the energy is exhausting.',
      signals: ['Major emotional swings', 'Intense reactions', 'Heavy drama']
    },
    {
      threshold: 0.25,
      word: 'Chaotic Energy',
      intensity: 'High',
      color: 'pink.700',
      bgGradient: 'linear(to-r, red.500, pink.500)',
      punchline: 'The chat is emotionally loud — more heat than direction.',
      signals: ['High swings', 'High urgency + resistance', 'Storylines']
    },
    {
      threshold: 0.2,
      word: 'Intense Vibes',
      intensity: 'Medium-High',
      color: 'purple.700',
      bgGradient: 'linear(to-r, purple.600, pink.600)',
      punchline: '{He}\'s all over the emotional spectrum — it\'s a lot.',
      signals: ['Big emotions', 'Shifting moods', 'High intensity']
    },
    {
      threshold: 0.15,
      word: 'Complicated Vibes',
      intensity: 'Medium',
      color: 'purple.700',
      bgGradient: 'linear(to-r, purple.600, pink.500)',
      punchline: 'There\'s too much going on — feelings are real, but messy.',
      signals: ['Mixed tone', 'Tension + pull']
    },
    {
      threshold: 0.12,
      word: 'Emotionally Messy',
      intensity: 'Medium-Low',
      color: 'purple.600',
      bgGradient: 'linear(to-r, purple.500, pink.500)',
      punchline: '{He}\'s feeling a lot and showing all of it — it\'s complicated.',
      signals: ['Emotional variety', 'Unclear patterns', 'Some drama']
    },
    {
      threshold: 0.09,
      word: 'Extra',
      intensity: 'Low',
      color: 'pink.600',
      bgGradient: 'linear(to-r, pink.500, purple.400)',
      punchline: '{He}\'s expressive — but not always clear.',
      signals: ['Emotional emphasis', 'Over-explaining']
    },
    {
      threshold: 0.06,
      word: 'A Bit Much',
      intensity: 'Very Low',
      color: 'pink.500',
      bgGradient: 'linear(to-r, pink.400, purple.400)',
      punchline: '{He}\'s bringing some drama, but it\'s not overwhelming.',
      signals: ['Some intensity', 'Emotional moments', 'Varied energy']
    },
    {
      threshold: 0.03,
      word: 'Expressive',
      intensity: 'Minimal',
      color: 'pink.500',
      bgGradient: 'linear(to-r, pink.400, purple.300)',
      punchline: '{He} feels things strongly and it shows in {his} messaging style.',
      signals: ['High emotion cues']
    },
    {
      threshold: 0,
      word: 'Mildly Emotional',
      intensity: 'Trace',
      color: 'pink.400',
      bgGradient: 'linear(to-r, pink.300, purple.200)',
      punchline: 'There\'s some emotional expression, but it\'s pretty calm.',
      signals: ['Light emotion', 'Minimal drama']
    }
  ]
};

// Default fallback feeling for cases with no messages
export const getDefaultFeeling = (gender = 'neutral') => ({
  intent: 'uncertainty',
  word: 'Reading the Room',
  intensity: 'Low',
  color: 'purple.500',
  bgGradient: 'linear(to-r, purple.500, pink.500)',
  punchline: interpolatePronouns('{He}\'s there… but {he}\'s not giving you clarity yet.', gender),
  signals: ['Mixed signals', 'Low emotional clarity'],
  disclaimer: 'Based on message patterns, not mind-reading.'
});

// Helper to get feeling with interpolated pronouns
export const getFeelingWithPronouns = (intentType, score, gender = 'neutral') => {
  const options = FEELING_MAP[intentType] || FEELING_MAP.affection;
  const feeling = options.find(opt => score >= opt.threshold) || options[options.length - 1];

  return {
    ...feeling,
    punchline: interpolatePronouns(feeling.punchline, gender),
    signals: feeling.signals // signals are already gender-neutral
  };
};
