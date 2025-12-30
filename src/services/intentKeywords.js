/**
 * Intent-Based Keywords - Semantic Engine Layer 2
 * LUSAKA ROMANTIC RELATIONSHIPS & DRAMA EDITION
 *
 * Maps keywords to relationship-specific intents for analyzing romantic conversations.
 * Optimized for Lusaka, Zambia cultural context with multilingual patterns.
 *
 * Intent categories:
 * - affection: Love, care, romance, flirting, sweet talk
 * - conflict: Arguments, fights, drama, jealousy, anger
 * - urgency: Relationship pressure, need for attention, "where are you"
 * - commitment: Promises, future plans, relationship milestones
 * - reconciliation: Making up, apologies, forgiveness, peace-making
 * - uncertainty: Trust issues, suspicion, insecurity, questioning
 * - drama: Gossip, third-party interference, side chicks/guys, triangulation
 * - passion: Intense emotions, desire, longing, missing someone
 *
 * Version: 2.0.0 - Lusaka Edition
 */

// =====================================================
// CORE INTENT KEYWORDS
// =====================================================

export const INTENT_KEYWORDS = {
  /**
   * AFFECTION - Love, care, romance, flirting, sweet talk
   * Signals: Expressing love, care, attraction, romance
   */
  affection: [
    // Direct love expressions
    'love you', 'love u', 'i love you', 'luv u', 'luv you', 'love',
    'adore', 'adore you', 'crazy about you', 'in love', 'falling for you',
    'my everything', 'my world', 'my life', 'ninakonda', 'nakukonda',

    // Terms of endearment (English)
    'babe', 'baby', 'bae', 'honey', 'sweetheart', 'sweetie', 'darling',
    'dear', 'my love', 'my heart', 'my queen', 'my king', 'my prince',
    'my princess', 'handsome', 'beautiful', 'gorgeous', 'stunning',

    // Zambian terms of endearment
    'boo', 'my boo', 'my person', 'wangu', 'chabe chabe', 'chabe',
    'mukwai wangu', 'sthandwa', 'mwandi', 'chipuba', 'mwana wangu',
    'nkhuku yanga', 'kababy', 'ka sweetie', 'chikondi', 'chikondi changa',

    // Flirting & attraction
    'cute', 'hot', 'sexy', 'fine', 'looking good', 'you look good',
    'handsome boy', 'pretty girl', 'fine boy', 'fine girl', 'crush',
    'crushing on you', 'feeling you', 'vibing with you', 'into you',
    'attracted to you', 'cant stop thinking', "can't stop thinking",

    // Sweet talk
    'miss you', 'miss u', 'missing you', 'thinking of you', 'thinking about you',
    'cant wait to see you', "can't wait to see you", 'wanna see you',
    'need to see you', 'dreaming of you', 'dream about you',
    'you make me happy', 'you complete me', 'meant to be', 'soulmate',

    // Care & support
    'here for you', 'got you', 'got your back', 'always here', 'support you',
    'proud of you', 'believe in you', 'care about you', 'worry about you',
    'thinking of you', 'praying for you', 'you matter', 'you mean everything',

    // Romantic gestures
    'sending kisses', 'kisses', 'hugs', 'cuddle', 'hold you', 'hold me',
    'kiss you', 'make love', 'be with you', 'together forever',
    'forever yours', 'only you', 'one and only', 'my one',

    // Zambian romantic slang
    'mwaishibukwa', 'mwashibukeni', 'ninshi', 'nabakonda sana',
    'you sweet', 'ka sweetness', 'ka babe', 'wandi weka',
    'ndiwe chabe', 'iwe weka', 'only iwe', 'iwe alone',

    // Compliments
    'amazing', 'incredible', 'wonderful', 'perfect', 'special',
    'unique', 'one of a kind', 'blessing', 'gift', 'lucky to have you',
    'best thing', 'best ever', 'no one like you',

    // Emojis (hearts, love)
    '❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💓', '💋', '😍', '🥰', '😘',
    '♥️', '💑', '💏', '👫', '🌹', '💐',
  ],

  /**
   * CONFLICT - Arguments, fights, drama, jealousy, anger
   * Signals: Fighting, arguing, expressing anger, jealousy, hurt
   */
  conflict: [
    // Direct anger
    'angry', 'mad', 'furious', 'pissed', 'pissed off', 'livid', 'upset',
    'annoyed', 'irritated', 'frustrated', 'fed up', 'sick of', 'tired of',
    'had enough', 'done with you', 'done', 'finished', 'sick and tired',

    // Fighting words
    'fuck you', 'screw you', 'to hell', 'go to hell', 'fuck off',
    'piss off', 'shut up', 'leave me alone', 'hate you', 'hate',
    'cant stand you', "can't stand you", 'disgusting', 'pathetic',

    // Zambian insults & anger
    'mbuzi', 'chamba', 'dull', 'stupid', 'foolish', 'useless',
    'iwe mbuzi', 'iwe chamba', 'nonsense', 'rubbish', 'chi nonsense',
    'ati what', 'ati ati', 'mxm', 'sies', 'eish',

    // Jealousy & suspicion
    'who is she', 'who is he', 'whos that', "who's that", 'who were you with',
    'where were you', 'why didnt you', "why didn't you", 'lying', 'liar',
    'cheating', 'cheater', 'unfaithful', 'betrayed', 'betrayal',
    'side chick', 'side guy', 'small house', 'mpango wa kando',

    // Zambian drama language
    'ka side chick', 'ka small house', 'ma side', 'ma boyfriend',
    'ma girlfriend', 'ba ex', 'ex yako', 'ba drama', 'chi drama',
    'drama queen', 'drama king', 'kulova', 'ukwati weka',

    // Accusations
    'you lied', 'you cheated', 'you promised', 'you said', 'you never',
    'you always', 'typical', 'as usual', 'same old', 'here we go again',
    'playing games', 'using me', 'taking advantage', 'disrespecting',
    'disrespect', 'no respect', 'treating me like', 'taking me for granted',

    // Hurt & pain
    'hurt me', 'hurting me', 'broke my heart', 'heartbroken', 'pain',
    'painful', 'crying', 'tears', 'you hurt me', 'wounded', 'damaged',
    'traumatized', 'suffering', 'aching', 'broke me',

    // Breakup threats
    'its over', "it's over", 'we are done', "we're done", 'breaking up',
    'break up', 'leave you', 'leaving you', 'moving on', 'done with this',
    'end this', 'ending this', 'cant do this', "can't do this anymore",
    'relationship over', 'finished with you',

    // Defensive & blame
    'your fault', 'you caused this', 'because of you', 'you ruined',
    'you destroyed', 'you started', 'not my fault', 'you made me',
    'forced me', 'pushed me', 'drove me', 'what about you',
    'but you', 'but what about', 'and you', 'look at yourself',

    // Passive aggression
    'whatever', 'fine', 'okay then', 'if you say so', 'cool', 'nice',
    'good for you', 'happy now', 'satisfied', 'congrats', 'wow',
    'amazing', 'interesting', 'uh huh', 'sure sure', 'mkay',

    // Emotional manipulation
    'you dont love me', "you don't love me", 'never loved me',
    'dont care about me', "don't care about me", 'nobody loves me',
    'all men are', 'all women are', 'men are trash', 'women are drama',
    'typical man', 'typical woman', 'just like the rest',

    // Zambian conflict expressions
    'ayi iwe', 'mwapanga', 'yasila', 'endapo', 'chaipa',
    'kulibe', 'twalila', 'mwalilatu', 'ba problem',
    'chi problem', 'ka nonsense', 'ka rubbish',

    // Emojis (anger, fighting)
    '😡', '😤', '🤬', '👿', '💔', '🙄', '😒', '😠', '💢', '🔥',
  ],

  /**
   * URGENCY - Relationship pressure, need for attention, "where are you"
   * Signals: Need for immediate response, attention-seeking, anxiety
   */
  urgency: [
    // Location questions (classic "where are you")
    'where are you', 'where r u', 'where u at', 'uli kuti', 'where',
    'where were you', 'where have you been', 'muli kuti', 'kuti',
    'you at', 'still there', 'are you there', 'uko kuti',

    // Response demands
    'answer me', 'answer your phone', 'pick up', 'call me back',
    'text me back', 'reply', 'respond', 'why arent you', "why aren't you",
    'why no reply', 'ignoring me', 'reading and not replying',
    'seen my message', 'left on read', 'blue ticks', 'double ticks',

    // Immediate attention needed
    'now', 'right now', 'asap', 'immediately', 'urgent', 'emergency',
    'need you now', 'come now', 'need to talk', 'we need to talk',
    'serious', 'important', 'cant wait', "can't wait",

    // Waiting & frustration
    'waiting', 'been waiting', 'still waiting', 'how long', 'waiting for you',
    'kept me waiting', 'making me wait', 'waiting on you', 'ive been waiting',
    "i've been waiting", 'waiting for your call', 'waiting for your text',

    // Anxiety & worry
    'worried', 'worry', 'worrying', 'anxious', 'stressed', 'scared',
    'panicking', 'panic', 'freaking out', 'going crazy', 'losing my mind',
    'cant sleep', "can't sleep", 'cant eat', "can't eat", 'thinking too much',

    // Zambian urgency
    'manje', 'manje manje', 'pa ground', 'real time', 'now now',
    'lelo', 'lelo lelo', 'quick quick', 'bwanji', 'uli bwanji',
    'twalila', 'ninshi', 'kanshi', 'bantu',

    // Missed connections
    'missed call', 'called you', 'tried calling', 'tried to reach you',
    'been calling', 'not picking up', 'phone off', 'switched off',
    'unreachable', 'cant reach you', "can't reach you", 'unavailable',

    // Time pressure
    'hurry', 'quick', 'quickly', 'fast', 'rushing', 'in a rush',
    'no time', 'running late', 'almost there', 'on my way',
    'coming', 'be there soon', 'wait for me', 'dont leave', "don't leave",

    // Possessive urgency
    'need you', 'want you', 'missing you so much', 'need to see you',
    'have to see you', 'dying to see you', 'come over', 'come see me',
    'meet me', 'pick me up', 'come get me', 'fetch me',

    // Crisis language
    'help', 'help me', 'need help', 'trouble', 'problem', 'emergency',
    'something happened', 'bad news', 'serious issue', 'crisis',
    'danger', 'unsafe', 'not okay', 'something wrong',

    // Zambian attention-seeking
    'babe', 'baby', 'hello', 'helo', 'heloooo', 'babe babe', 'baby baby',
    'eya', 'eeya', 'eh', 'iwe', 'iwe iwe', 'ati',

    // Multiple messages indicator
    'hello', 'hello?', '???', '????', 'babe?', 'baby?',
    'you there', 'still alive', 'what happened', 'whats going on',

    // Emojis (urgent, worried)
    '⏰', '⌚', '🆘', '❗', '‼️', '⚠️', '😰', '😟', '😧', '😨', '😱',
  ],

  /**
   * COMMITMENT - Promises, future plans, relationship milestones
   * Signals: Making promises, planning future, commitment to relationship
   */
  commitment: [
    // Direct commitment
    'marry you', 'marry me', 'marriage', 'wedding', 'wife', 'husband',
    'propose', 'proposal', 'engagement', 'engaged', 'fiance', 'fiancee',
    'forever', 'always', 'forever and always', 'til death', 'till the end',
    'rest of my life', 'spend my life', 'grow old together',

    // Promises
    'promise', 'i promise', 'promised', 'i swear', 'swear to god',
    'on my life', 'cross my heart', 'give you my word', 'word',
    'vow', 'commitment', 'committed', 'dedicated', 'devoted',

    // Future planning
    'our future', 'future together', 'plan for us', 'our plans',
    'build together', 'build a life', 'build a future', 'our home',
    'move in together', 'live together', 'house together',
    'family together', 'start a family', 'have kids', 'babies',

    // Relationship milestones
    'anniversary', 'first date', 'first kiss', 'first time',
    'meeting parents', 'meet my family', 'meet my friends',
    'official', 'make it official', 'boyfriend', 'girlfriend',
    'relationship', 'together', 'couple', 'us', 'we',

    // Loyalty & faithfulness
    'loyal', 'faithful', 'faithful to you', 'only you', 'one and only',
    'no one else', 'just you', 'yours', 'all yours', 'belong to you',
    'nobody but you', 'you alone', 'only iwe', 'iwe chabe',

    // Long-term vision
    'forever yours', 'never leave', 'wont leave', "won't leave",
    'always be here', 'not going anywhere', 'staying', 'stick with you',
    'ride or die', 'through thick and thin', 'good and bad',
    'no matter what', 'unconditional', 'unconditionally',

    // Financial commitment (Zambian context)
    'lobola', 'bride price', 'dowry', 'kitchen party', 'introduction',
    'chingalume', 'traditional', 'traditional marriage', 'white wedding',
    'pay lobola', 'ku banja', 'ukwati',

    // Moving in together
    'move in', 'come stay', 'live with me', 'our place', 'our house',
    'get a place', 'find a place', 'settle down', 'settle together',

    // Children & family
    'baby', 'babies', 'kids', 'children', 'pregnant', 'pregnancy',
    'father of my children', 'mother of my children', 'family',
    'our baby', 'our child', 'start a family', 'raise kids together',

    // Exclusive commitment
    'delete your apps', 'delete tinder', 'delete dating apps',
    'stop talking to', 'cut off', 'block them', 'only me',
    'exclusive', 'exclusively', 'just us', 'no one else',

    // Zambian commitment language
    'nakweba', 'ndiwe wandi', 'wangu chabe', 'tili pamodzi',
    'tizakwatana', 'ukwati wandi', 'mukwai wangu weka',
    'tizafika', 'tizakwanisa', 'ndine nawe', 'pamodzi',

    // Trust & security
    'trust you', 'trust me', 'safe with you', 'secure', 'stability',
    'reliable', 'depend on you', 'count on you', 'there for me',
    'support me', 'got my back', 'team', 'partnership', 'partners',

    // Religious commitment
    'god brought us together', 'blessed', 'blessing', 'pray for us',
    'gods plan', "god's plan", 'destined', 'meant to be', 'soulmate',
    'answered prayer', 'gift from god', 'church wedding',

    // Emojis (commitment, rings, family)
    '💍', '💒', '👶', '🤰', '👪', '❤️', '🏠', '🔐', '🤝', '⛪',
  ],

  /**
   * RECONCILIATION - Making up, apologies, forgiveness, peace-making
   * Signals: Apologizing, seeking forgiveness, making amends, moving forward
   */
  reconciliation: [
    // Direct apologies
    'sorry', 'im sorry', "i'm sorry", 'so sorry', 'really sorry',
    'truly sorry', 'deeply sorry', 'apologize', 'apologies', 'my apologies',
    'forgive me', 'please forgive', 'i was wrong', 'my bad', 'my fault',

    // Seeking forgiveness
    'forgive', 'forgiveness', 'pardon', 'excuse me', 'can we talk',
    'let me explain', 'hear me out', 'give me a chance', 'second chance',
    'one more chance', 'another chance', 'start over', 'try again',

    // Admitting fault
    'my mistake', 'i messed up', 'i screwed up', 'i was wrong',
    'shouldnt have', "shouldn't have", 'regret', 'regret it', 'wish i hadnt',
    "wish I hadn't", 'take it back', 'didnt mean it', "didn't mean it",

    // Making amends
    'make it up to you', 'make it right', 'fix this', 'fix us',
    'work on it', 'do better', 'be better', 'change', 'ill change',
    "i'll change", 'promise to change', 'wont happen again', "won't happen again",

    // Peace-making
    'lets talk', "let's talk", 'can we talk', 'talk it out', 'work it out',
    'figure this out', 'solve this', 'fix this', 'move past this',
    'get through this', 'move forward', 'move on', 'past this',

    // Reconciliation signals
    'miss us', 'miss what we had', 'remember when', 'good times',
    'what we had', 'worth fighting for', 'fight for us', 'save us',
    'save this', 'dont give up', "don't give up", 'give us a chance',

    // Vulnerability & accountability
    'hurt you', 'i hurt you', 'caused pain', 'made you cry',
    'broke your heart', 'let you down', 'disappointed you', 'failed you',
    'take responsibility', 'my responsibility', 'accountable', 'own it',

    // Zambian reconciliation
    'pepani', 'ndalakwa', 'mwandi pepani', 'ndikhalape', 'ninshi kulakwa',
    'twalila', 'bantu', 'shem', 'ba sorry', 'ka sorry', 'iwe pepani',
    'kulibe matata', 'no hard feelings', 'tizakwanisa',

    // Requesting peace
    'peace', 'make peace', 'call a truce', 'truce', 'stop fighting',
    'no more fighting', 'tired of fighting', 'hate fighting', 'calm down',
    'lets calm down', "let's calm down", 'relax', 'chill', 'take it easy',

    // Expressing love after fight
    'still love you', 'never stopped loving', 'love you too much',
    'cant lose you', "can't lose you", 'dont want to lose', "don't want to lose",
    'need you', 'want you back', 'come back', 'take me back',

    // Understanding & empathy
    'understand', 'i understand', 'i get it', 'see your point',
    'see where youre coming from', "see where you're coming from",
    'should have listened', 'my bad for', 'you were right', 'youre right',
    "you're right", 'i was wrong',

    // Compromise language
    'compromise', 'meet halfway', 'work together', 'together', 'team',
    'us against the problem', 'not you vs me', 'find a solution',
    'middle ground', 'agree to disagree', 'both try',

    // Healing & growth
    'heal', 'healing', 'grow from this', 'learn from this', 'lesson',
    'make us stronger', 'stronger together', 'better together',
    'work through this', 'get past this', 'overcome this',

    // Time requests
    'give me time', 'need time', 'space', 'need space', 'cool off',
    'think about it', 'sleep on it', 'talk later', 'tomorrow',
    'not right now', 'when youre ready', "when you're ready",

    // Zambian peace-making
    'tizalanga', 'tizakwanisa bwino', 'kulibe drama', 'tizayamba kabili',
    'fresh start', 'tili bwino', 'no problem', 'kulibe problem',

    // Emojis (apology, peace, hearts)
    '🙏', '😔', '😞', '🥺', '💔➡️❤️', '🕊️', '☮️', '🤝', '💕', '🙇',
  ],

  /**
   * UNCERTAINTY - Trust issues, suspicion, insecurity, questioning
   * Signals: Doubting loyalty, seeking reassurance, jealousy, insecurity
   */
  uncertainty: [
    // Trust questions
    'do you love me', 'do you still love me', 'still love me',
    'am i enough', 'good enough', 'enough for you', 'what am i to you',
    'where do we stand', 'what are we', 'are we together',
    'are you happy', 'happy with me', 'sure about us', 'sure about me',

    // Suspicion & jealousy
    'who is that', 'who was that', 'whos calling', "who's calling",
    'who texted', 'who you talking to', 'talking to who', 'who is she',
    'who is he', 'see someone else', 'someone else', 'talking to someone',
    'seeing someone', 'another girl', 'another guy', 'other people',

    // Trust issues
    'trust you', 'can i trust you', 'dont trust', "don't trust",
    'hard to trust', 'trust issues', 'been hurt before', 'scared',
    'scared of getting hurt', 'worried', 'worried about us',
    'something feels off', 'feels wrong', 'gut feeling', 'intuition',

    // Insecurity
    'insecure', 'not good enough', 'not pretty enough', 'not handsome enough',
    'better than me', 'prettier than me', 'compare me', 'comparing',
    'what does she have', 'what does he have', 'why her', 'why him',
    'am i special', 'what makes me special', 'why me', 'why did you choose me',

    // Seeking reassurance
    'promise me', 'swear to me', 'tell me', 'reassure me',
    'need to hear', 'need to know', 'prove it', 'show me',
    'how do i know', 'how can i be sure', 'convince me',
    'make me believe', 'give me a reason', 'why should i believe',

    // Questioning commitment
    'serious about this', 'serious about us', 'in this for real',
    'just playing', 'playing games', 'just for fun', 'waste my time',
    'wasting my time', 'leading me on', 'using me', 'what do you want',
    'where is this going', 'future together', 'see a future',

    // Relationship status anxiety
    'are we official', 'make it official', 'boyfriend girlfriend',
    'labels', 'define us', 'what are we doing', 'exclusive',
    'just us', 'only me', 'only you', 'others', 'talking to others',

    // Fear of loss
    'losing you', 'am i losing you', 'slipping away', 'distant',
    'pulling away', 'changed', 'different', 'not the same',
    'something changed', 'feelings changed', 'still want this',
    'still want me', 'done with me', 'tired of me', 'over me',

    // Zambian insecurity expressions
    'kanshi', 'ninshi', 'shem', 'ba', 'ehe', 'eish',
    'sure sure', 'iwe serious', 'for real', 'ati sure',
    'muli serious', 'mwandi sure', 'iwe certain',

    // Past relationship baggage
    'ex', 'your ex', 'ex girlfriend', 'ex boyfriend', 'past',
    'history', 'still talk to ex', 'over your ex', 'moved on',
    'past relationships', 'baggage', 'unfinished business',

    // Communication anxiety
    'ignoring me', 'avoiding me', 'not talking', 'distant',
    'cold', 'acting weird', 'acting strange', 'whats wrong',
    "what's wrong", 'something wrong', 'mad at me', 'upset with me',
    'did i do something', 'what did i do', 'my fault',

    // Social media jealousy
    'who liked', 'who commented', 'posting about who', 'story',
    'instagram', 'facebook', 'tiktok', 'following who', 'liking photos',
    'commenting on', 'dm', 'dms', 'messages', 'snapchat', 'whatsapp status',

    // Money & kulova concerns (transactional relationships)
    'just for money', 'using me for money', 'gold digger', 'kulova',
    'what about her money', 'what about his money', 'sponsor',
    'ben 10', 'sugar daddy', 'sugar mummy', 'ka blesser',

    // Doubt expressions
    'doubt', 'doubting', 'second thoughts', 'second guessing',
    'not sure', 'unsure', 'uncertain', 'confused', 'mixed feelings',
    'dont know', "don't know", 'no idea', 'questioning', 'hesitant',

    // Zambian uncertainty/suspicion
    'ati what', 'ati iwe', 'sure sure', 'manje iwe',
    'honestly', 'for real for real', 'serious serious',
    'cross your heart', 'ba truth', 'chi truth',

    // Emojis (questioning, suspicious, worried)
    '🤔', '😕', '😟', '😥', '🧐', '👀', '❓', '❔', '😬', '😰', '🙁',
  ],

  /**
   * DRAMA - Gossip, third-party interference, side chicks/guys, triangulation
   * Signals: Drama from others, gossiping, interference, multiple partners
   */
  drama: [
    // Side chicks/side guys
    'side chick', 'side guy', 'side piece', 'small house', 'second wife',
    'mpango wa kando', 'ka side', 'ma side', 'bae number two',
    'main chick', 'main guy', 'main bae', 'first wife', 'second option',

    // Multiple partners
    'other women', 'other men', 'other girls', 'other guys',
    'seeing others', 'multiple', 'player', 'playing', 'playing around',
    'man whore', 'hoe', 'community dick', 'for the streets',
    'belongs to the streets', 'sleeping around', 'cheating on me',

    // Gossip & third parties
    'people are saying', 'heard from', 'someone told me', 'told me that',
    'they said', 'everyone knows', 'whole town knows', 'friends told me',
    'saw you', 'caught you', 'spotted', 'busted', 'exposed',

    // Zambian gossip language
    'ba drama', 'chi drama', 'ba gossip', 'ma rumors', 'chi news',
    'ba news', 'chi talk', 'ba talk', 'people talking', 'bantu balekamba',
    'ba situation', 'chi situation', 'manje drama',

    // Ex interference
    'your ex', 'ex calling', 'ex texting', 'still with ex', 'ex drama',
    'baby mama', 'baby daddy', 'baby mama drama', 'baby daddy drama',
    'ex wife', 'ex husband', 'divorce', 'separated', 'still married',

    // Family/friends interference
    'your mom', 'your dad', 'your family', 'your friends', 'they dont like me',
    "they don't like me", 'they said', 'your sister', 'your brother',
    'friends dont approve', "friends don't approve", 'parents hate me',
    'family against us', 'disapprove', 'not good enough for them',

    // Social media drama
    'posting about', 'subtweet', 'subtweeting', 'vague posting',
    'instagram story', 'whatsapp status', 'facebook drama',
    'tiktok drama', 'screenshot', 'receipts', 'exposed you',
    'saw on social media', 'posted about me', 'public embarrassment',

    // Triangulation
    'comparing me', 'her vs me', 'him vs me', 'better than me',
    'upgrade', 'downgrade', 'trade up', 'trade down', 'replacement',
    'rebound', 'interim', 'placeholder', 'option', 'backup',

    // Cheating evidence
    'saw the messages', 'read the texts', 'checked your phone',
    'went through phone', 'found out', 'discovered', 'evidence',
    'proof', 'caught red handed', 'lipstick', 'perfume', 'cologne',
    'hickey', 'love bite', 'scratch marks',

    // Club/nightlife drama
    'at the club', 'nightclub', 'bar', 'party', 'dancing with',
    'grinding on', 'saw you with', 'drunk', 'alcohol', 'drinking',
    'came home late', 'out till morning', 'where were you last night',

    // Zambian drama specifics
    'kulova drama', 'ukwati drama', 'banja drama', 'ma ex',
    'ka drama queen', 'chi player', 'ma player', 'ba player',
    'mbuzi behavior', 'nonsense behavior', 'ati iwe player',

    // Money drama (transactional)
    'spending money on her', 'spending money on him', 'buying her',
    'buying him', 'gifts for who', 'ka blesser', 'sponsor',
    'sugar arrangements', 'financial support', 'kulova situation',
    'using you', 'using me', 'gold digging',

    // Public confrontation
    'confront', 'confrontation', 'scene', 'made a scene',
    'public fight', 'embarrassed me', 'humiliated', 'disrespected publicly',
    'front of people', 'everyone saw', 'witnesses',

    // Zambian compound drama
    'neighbors talking', 'compound gossip', 'watchman saw', 'landlord knows',
    'whole compound knows', 'ba neighbor', 'ma neighbors',

    // Friends drama
    'your boys', 'your girls', 'your crew', 'squad', 'clique',
    'bad influence', 'friends are toxic', 'hanging with wrong people',
    'boys trip', 'girls trip', 'boys night', 'girls night',

    // Emojis (drama, gossip, mess)
    '🍵', '👀', '🗣️', '💅', '🙄', '😏', '🤷', '🤦', '🎭', '💀', '🔥',
  ],

  /**
   * PASSION - Intense emotions, desire, longing, missing someone
   * Signals: Sexual desire, intense longing, emotional intensity
   */
  passion: [
    // Intense longing
    'crave you', 'craving you', 'need you so bad', 'want you so bad',
    'dying to see you', 'cant stop thinking', "can't stop thinking",
    'drive me crazy', 'driving me crazy', 'going crazy', 'obsessed',
    'addicted', 'addicted to you', 'cant get enough', "can't get enough",

    // Sexual desire
    'want you', 'need you', 'desire', 'turned on', 'horny', 'aroused',
    'make love', 'sex', 'fuck', 'sleep together', 'intimate', 'intimacy',
    'touch you', 'feel you', 'taste you', 'body', 'sexy', 'hot',

    // Physical attraction
    'beautiful', 'gorgeous', 'stunning', 'sexy', 'hot', 'fine',
    'attractive', 'irresistible', 'cant resist', "can't resist",
    'curves', 'muscles', 'body', 'lips', 'eyes', 'smile',
    'perfume', 'cologne', 'scent', 'smell',

    // Intense emotion
    'burn for you', 'fire', 'burning', 'flames', 'heat', 'chemistry',
    'electric', 'spark', 'sparks flying', 'connection', 'magnetic',
    'drawn to you', 'pull', 'attraction', 'gravity', 'intense',

    // Missing someone intensely
    'miss you so much', 'missing you like crazy', 'miss you bad',
    'aching for you', 'yearning', 'longing', 'pine for you',
    'cant breathe without', "can't breathe without", 'incomplete',
    'empty without you', 'void', 'lost without you',

    // Romantic passion
    'butterflies', 'heart racing', 'racing heart', 'pounding heart',
    'weak in the knees', 'melt', 'melting', 'swoon', 'swooning',
    'breathtaking', 'take my breath away', 'speechless',

    // Zambian passion expressions
    'mwaishibukwa', 'ninshi kupusa', 'mwabomba', 'ka hotness',
    'ka sexy', 'iwe fine', 'fine sana', 'mwandi sweetness',
    'sweet like sugar', 'nakukonda sana sana',

    // Night time/romantic settings
    'tonight', 'come over tonight', 'alone together', 'privacy',
    'bedroom', 'bed', 'cuddle', 'snuggle', 'hold you tight',
    'in my arms', 'close to you', 'next to you',

    // Desire language
    'thirsty', 'hungry for you', 'appetite', 'lust', 'temptation',
    'tempted', 'seduce', 'seduction', 'tease', 'teasing',
    'flirt', 'flirting', 'provocative', 'naughty', 'wild',

    // Compliments (passionate)
    'goddess', 'angel', 'queen', 'king', 'prince', 'princess',
    'perfection', 'perfect', 'flawless', 'divine', 'heaven',
    'masterpiece', 'work of art', 'beautiful creation',

    // Possessive passion
    'mine', 'all mine', 'belong to me', 'my man', 'my woman',
    'claim you', 'possess you', 'own you', 'yours', 'all yours',
    'only yours', 'body and soul', 'completely yours',

    // Romantic gestures
    'flowers', 'roses', 'candlelight', 'candles', 'romantic',
    'romance', 'date night', 'special night', 'surprise',
    'gift', 'chocolate', 'wine', 'champagne',

    // Morning/waking up together
    'wake up next to you', 'good morning beautiful', 'good morning handsome',
    'first thing i see', 'morning kisses', 'breakfast in bed',
    'lazy morning', 'stay in bed', 'all day in bed',

    // Travel/getaway passion
    'run away together', 'escape', 'getaway', 'vacation', 'weekend away',
    'beach', 'sunset', 'sunrise', 'stars', 'moonlight',
    'romantic getaway', 'honeymoon', 'paradise',

    // Zambian romantic spots/activities
    'levy', 'mall', 'arcades', 'chez ntemba', 'rhapsodys',
    'manda hill date', 'east park date', 'ka date', 'ka outing',

    // Emotional intensity
    'overwhelmed', 'overwhelming', 'consumed', 'all i think about',
    'all i want', 'everything', 'whole world', 'universe',
    'stars align', 'destiny', 'fate', 'meant to be',

    // Emojis (passion, desire, romance)
    '🔥', '😍', '😘', '😏', '💋', '👅', '🍑', '🍆', '💦', '😈',
    '🌹', '💐', '🌙', '⭐', '✨', '💫', '🦋', '❤️‍🔥',
  ],
};

// =====================================================
// LINGUISTIC PATTERN KEYWORDS
// =====================================================

export const PATTERN_KEYWORDS = {
  /**
   * Question patterns (relationship-focused)
   */
  questions: [
    '?', 'what', 'when', 'where', 'who', 'why', 'how', 'which',
    'do you love me', 'do you still', 'are you', 'have you',
    'where are you', 'who is that', 'what are we', 'are we',
  ],

  /**
   * Affectionate greetings
   */
  greetings: [
    'good morning', 'morning babe', 'morning baby', 'gm', 'good night',
    'goodnight', 'sweet dreams', 'sleep well', 'hi babe', 'hey baby',
    'hello love', 'hey handsome', 'hi beautiful', 'hey gorgeous',
  ],

  /**
   * Acknowledgment patterns
   */
  acknowledgments: [
    'ok', 'okay', 'alright', 'got it', 'understood', 'noted', 'kk',
    'k', 'cool', 'fine', 'sure', 'yep', 'yeah', 'yes',
    'eeya', 'eya', 'ndiyo', 'sawa', 'oki', 'okie',
  ],

  /**
   * Time-sensitive patterns (relationship context)
   */
  timeSensitive: [
    'now', 'right now', 'immediately', 'urgent', 'asap', 'today',
    'tonight', 'tomorrow', 'hurry', 'quick', 'quickly', 'fast',
    'waiting', 'come now', 'need you now', 'manje', 'lelo',
  ],

  /**
   * Negation patterns
   */
  negation: [
    'not', 'no', 'dont', "don't", 'doesnt', "doesn't", 'didnt', "didn't",
    'wont', "won't", 'cant', "can't", 'couldnt', "couldn't", 'wouldnt',
    "wouldn't", 'shouldnt', "shouldn't", 'never', 'nothing', 'nobody',
    'nowhere', 'neither', 'nor', 'none', 'ayi', 'kulibe',
  ],

  /**
   * Hedging patterns (uncertainty markers)
   */
  hedging: [
    'maybe', 'perhaps', 'possibly', 'probably', 'might', 'could', 'may',
    'i think', 'i guess', 'i suppose', 'kind of', 'sort of', 'kinda',
    'sorta', 'somewhat', 'kanshi', 'ninshi', 'shem',
  ],

  /**
   * Conditional patterns
   */
  conditional: [
    'if', 'unless', 'when', 'while', 'provided', 'assuming', 'suppose',
    'depends', 'depending', 'in case', 'otherwise', 'else', 'or',
    'either', 'whether', 'should', 'would', 'could',
  ],

  /**
   * Emphasis patterns
   */
  emphasis: [
    '!', '!!', '!!!', 'very', 'really', 'so', 'extremely', 'absolutely',
    'definitely', 'totally', 'completely', 'entirely', 'utterly',
    'highly', 'super', 'mega', 'ultra', 'literally', 'actually',
    'sana', 'sana sana', 'so much', 'too much',
  ],

  /**
   * Terms of endearment used frequently
   */
  endearment: [
    'babe', 'baby', 'bae', 'honey', 'sweetheart', 'sweetie', 'darling',
    'love', 'my love', 'dear', 'wangu', 'mwandi', 'chikondi',
  ],
};

// =====================================================
// TOXICITY KEYWORDS (for safety)
// =====================================================

export const TOXICITY_KEYWORDS = {
  /**
   * Insults (relationship-specific)
   */
  insults: [
    'idiot', 'stupid', 'dumb', 'fool', 'moron', 'dummy', 'bitch', 'bastard',
    'trash', 'garbage', 'pathetic', 'worthless', 'useless', 'loser',
    'slut', 'whore', 'hoe', 'thot', 'slag', 'ugly', 'fat', 'disgusting',

    // Zambian insults
    'mbuzi', 'chamba', 'dull', 'slow', 'iwe mbuzi', 'iwe chamba',
    'nonsense', 'rubbish', 'chi nonsense', 'ka rubbish',
  ],

  /**
   * Aggression & threats
   */
  aggression: [
    'hate you', 'hate', 'kill', 'die', 'destroy', 'attack', 'fight', 'beat',
    'fuck you', 'screw you', 'fuck off', 'shut up', 'piss off', 'get lost',
    'threatening', 'threaten', 'hurt you', 'harm', 'violence', 'violent',
    'slap', 'hit', 'punch', 'beat you up', 'beat you', 'regret',
    'ill kill you', "i'll kill you", 'kill yourself', 'wish you were dead',
  ],

  /**
   * Dismissive & contempt
   */
  dismissive: [
    'whatever', 'dont care', "don't care", 'who cares', 'so what',
    'good for you', 'cool story', 'nobody asked', 'didnt ask', "didn't ask",
    'and', 'your point', 'moving on', 'next', 'boring', 'pathetic',
    'waste of time', 'waste my time', 'not worth it', 'beneath me',
  ],

  /**
   * Manipulation & gaslighting
   */
  manipulation: [
    'you always', 'you never', 'everyone thinks', 'nobody likes you',
    'typical', 'predictable', 'as usual', 'same old', 'here we go again',
    'guilt trip', 'playing victim', 'making this about you', 'dramatic',
    'overreacting', 'too sensitive', 'crazy', 'youre crazy', "you're crazy",
    'insane', 'psycho', 'mental', 'paranoid', 'imagining things',
    'never happened', 'you made that up', 'didnt say that', "didn't say that",
    'twisting my words', 'putting words in my mouth',
  ],

  /**
   * Blame & control
   */
  blame: [
    'your fault', 'you caused', 'because of you', 'you ruined',
    'you screwed up', 'you messed up', 'you failed', "you're responsible",
    'this is on you', 'you did this', 'you made me', 'forced me',
    'look what you made me do', 'drove me to this', 'pushed me',
  ],

  /**
   * Emotional abuse
   */
  emotionalAbuse: [
    'nobody will love you', 'nobody wants you', 'lucky to have me',
    'nobody else will want you', 'cant do better', "can't do better",
    'nothing without me', 'worthless without me', 'need me', 'depend on me',
    'control you', 'own you', 'property', 'belong to me', 'mine',
    'cant leave', "can't leave", 'wont survive', "won't survive",
    'destroy you', 'ruin you', 'embarrass you', 'expose you',
  ],

  /**
   * Sexual coercion & pressure
   */
  sexualPressure: [
    'owe me', 'you owe me sex', 'not a real man', 'not a real woman',
    'prove it', 'prove you love me', 'if you loved me', 'real relationship',
    'everyone does it', 'what are you afraid of', 'dont you want me',
    "don't you want me", 'tease', 'leading me on', 'blue balls',
  ],

  /**
   * Financial abuse
   */
  financialAbuse: [
    'i pay for everything', 'i support you', 'my money', 'my house',
    'living off me', 'using my money', 'gold digger', 'expensive',
    'cost me', 'owe me', 'debt', 'paid for', 'bought you',
  ],

  /**
   * Isolation tactics
   */
  isolation: [
    'your friends are bad', 'family is toxic', 'they dont like me',
    "they don't like me", 'choose me or them', 'me or your friends',
    'stop talking to', 'cut them off', 'shouldnt see', "shouldn't see",
    'spending too much time', 'always with them', 'they control you',
  ],

  /**
   * Zambian toxic expressions
   */
  zambianToxic: [
    'mxm', 'sies', 'ati what', 'ati ati', 'iwe nonsense',
    'chi drama chobe', 'ka rubbish kobe', 'mbuzi behavior',
    'ayi iwe', 'yasila', 'chaipa', 'twalila',
  ],
};

// =====================================================
// CULTURAL VARIANTS
// =====================================================

/**
 * Zambian/Lusaka language patterns
 * Preserves cultural context for accurate relationship intent detection
 * Languages: English, Nyanja, Bemba, and code-switching patterns
 */
export const CULTURAL_VARIANTS = {
  zambian: {
    // Affection variations
    affection: [
      'nakukonda', 'ninakonda', 'chikondi changa', 'wangu', 'mwandi',
      'mukwai wangu', 'ndiwe wandi', 'iwe weka', 'chabe chabe',
      'mwaishibukwa', 'mwabomba', 'ka sweetness', 'ka babe',
      'chipuba', 'mwana wangu', 'nkhuku yanga',
    ],

    // Conflict variations
    conflict: [
      'ayi iwe', 'mbuzi', 'chamba', 'chi nonsense', 'ka rubbish',
      'mxm', 'sies', 'ati what', 'ati ati', 'yasila', 'chaipa',
      'kulibe', 'twalila', 'mwalilatu', 'ba drama', 'chi drama',
      'iwe mbuzi', 'iwe chamba', 'nonsense behavior',
    ],

    // Urgency variations
    urgency: [
      'manje', 'manje manje', 'pa ground', 'real time', 'now now',
      'lelo', 'lelo lelo', 'uli kuti', 'muli kuti', 'uko kuti',
      'bwanji', 'uli bwanji', 'twalila', 'ninshi', 'kanshi',
    ],

    // Commitment variations
    commitment: [
      'lobola', 'ukwati', 'banja', 'tizakwatana', 'nakweba',
      'tili pamodzi', 'pamodzi', 'tizafika', 'tizakwanisa',
      'ndine nawe', 'ku banja', 'chingalume', 'kitchen party',
      'traditional marriage', 'tizayamba kabili', 'mukwai wangu weka',
    ],

    // Reconciliation variations
    reconciliation: [
      'pepani', 'ndalakwa', 'mwandi pepani', 'ndikhalape', 'ninshi kulakwa',
      'twalila', 'bantu', 'shem', 'ba sorry', 'ka sorry', 'iwe pepani',
      'kulibe matata', 'no hard feelings', 'tizakwanisa', 'tizalanga',
      'tizakwanisa bwino', 'kulibe drama', 'fresh start', 'tili bwino',
      'kulibe problem',
    ],

    // Uncertainty variations
    uncertainty: [
      'kanshi', 'ninshi', 'shem', 'shame', 'ba', 'ehe', 'eish',
      'sure sure', 'iwe serious', 'for real', 'ati sure',
      'muli serious', 'mwandi sure', 'iwe certain', 'ati iwe',
      'manje iwe', 'ba truth', 'chi truth',
    ],

    // Drama variations
    drama: [
      'ba drama', 'chi drama', 'ba gossip', 'ma rumors', 'chi news',
      'ba news', 'chi talk', 'ba talk', 'bantu balekamba',
      'ba situation', 'chi situation', 'manje drama', 'kulova drama',
      'ukwati drama', 'banja drama', 'ma ex', 'ka drama queen',
      'chi player', 'ma player', 'ba player', 'ka side chick',
      'ka small house', 'ma side', 'kulova situation',
    ],

    // Passion variations
    passion: [
      'mwaishibukwa', 'mwashibukeni', 'ninshi kupusa', 'mwabomba',
      'ka hotness', 'ka sexy', 'iwe fine', 'fine sana',
      'mwandi sweetness', 'sweet like sugar', 'nakukonda sana sana',
      'levy', 'manda hill', 'east park', 'arcades', 'ka date',
      'ka outing', 'chez ntemba', 'rhapsodys',
    ],

    // Lusaka-specific slang
    lusakaSlang: [
      'we move', 'bantu', 'ba situation', 'chi situation', 'ka',
      'ma', 'ba', 'chi', 'iwe', 'uko', 'pa ground', 'real time',
      'sana', 'sana sana', 'chabe', 'weka', 'pamodzi',
    ],

    // Mixed language patterns (code-switching)
    codeSwitching: [
      'iwe baby', 'mwandi babe', 'iwe serious', 'ati iwe',
      'ba ex yako', 'ma boyfriend', 'ma girlfriend', 'chi nonsense',
      'ka drama', 'ba problem', 'chi problem', 'kulibe giving up',
      'ati what', 'manje drama', 'sure sure', 'for real for real',
    ],
  },

  /**
   * Nyanja-specific (most common in Lusaka)
   */
  nyanja: {
    love: ['nakukonda', 'chikondi', 'chikondi changa', 'mukwai wangu'],
    mine: ['wangu', 'wangu chabe', 'ndiwe wandi', 'iwe weka'],
    together: ['pamodzi', 'tili pamodzi', 'tizafika pamodzi'],
    sorry: ['pepani', 'ndalakwa', 'mwandi pepani'],
    where: ['kuti', 'uli kuti', 'muli kuti', 'uko kuti'],
    now: ['manje', 'lelo', 'manje manje', 'lelo lelo'],
  },

  /**
   * Bemba-specific
   */
  bemba: {
    love: ['ninakonda', 'ninshi', 'mwaishibukwa'],
    mine: ['wandi', 'mwandi', 'iwe alone'],
    yes: ['eeya', 'eya', 'ndipo'],
    no: ['ayi', 'kulibe', 'chaipa'],
    sorry: ['ndikhalape', 'ninshi kulakwa'],
  },
};

// =====================================================
// CONFIGURATION
// =====================================================

/**
 * Keyword configuration metadata
 */
export const KEYWORD_CONFIG = {
  version: '2.0.0 - Lusaka Romantic Relationships Edition',
  lastUpdated: '2025-12-30',
  focus: 'Romantic relationships in Lusaka, Zambia - Drama & chaos analysis',
  intentCategories: [
    'affection',      // Love, romance, flirting
    'conflict',       // Arguments, fights, jealousy
    'urgency',        // "Where are you", need for attention
    'commitment',     // Promises, future plans, marriage
    'reconciliation', // Apologies, making up
    'uncertainty',    // Trust issues, insecurity
    'drama',          // Gossip, side chicks/guys, interference
    'passion',        // Desire, intense longing
  ],
  totalKeywords: {
    affection: INTENT_KEYWORDS.affection.length,
    conflict: INTENT_KEYWORDS.conflict.length,
    urgency: INTENT_KEYWORDS.urgency.length,
    commitment: INTENT_KEYWORDS.commitment.length,
    reconciliation: INTENT_KEYWORDS.reconciliation.length,
    uncertainty: INTENT_KEYWORDS.uncertainty.length,
    drama: INTENT_KEYWORDS.drama.length,
    passion: INTENT_KEYWORDS.passion.length,
  },
  supportedLanguages: ['English', 'Nyanja', 'Bemba', 'Code-switching'],
  supportedCultures: ['zambian', 'nyanja', 'bemba'],
  culturalContext: 'Lusaka, Zambia',
  relationshipTypes: [
    'romantic',
    'dating',
    'committed relationship',
    'marriage',
    'complicated/drama',
  ],
};

/**
 * Export all keyword sets
 */
export default {
  intents: INTENT_KEYWORDS,
  patterns: PATTERN_KEYWORDS,
  toxicity: TOXICITY_KEYWORDS,
  cultural: CULTURAL_VARIANTS,
  config: KEYWORD_CONFIG,
};
