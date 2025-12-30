/**
 * Sentiment Analysis Keywords and Patterns
 * Comprehensive keyword dictionaries for emotion detection and context analysis
 */

// Core emotional keywords
export const sentimentKeywords = {
  joy: [
    'happy', 'love', 'great', 'amazing', 'wonderful', 'awesome', 'fantastic',
    'excited', 'perfect', 'beautiful', 'thank', 'thanks', 'haha', 'lol', 'lmao',
    'yay', 'nice', 'good', 'best', 'excellent', 'lovely', 'fun', 'enjoy',
    'celebration', 'celebrate', 'congratulations', 'proud', 'delighted', 'thrilled',
    'blessed', 'grateful', 'joyful', 'cheerful', 'pleased', 'satisfied', 'content',
    // Casual variations
    'cool', 'sweet', 'neat', 'rad', 'dope', 'lit', 'fire', 'bet', 'epic',
    'vibes', 'vibe', 'mood', 'yes', 'yess', 'yesss', 'yeah', 'ok', 'okay',
    'sure', 'sounds good', 'works', 'glad', 'happiness', 'joy', 'smile', 'smiling',
    'hehe', 'hihi', 'ha', 'lmfao', 'rofl', 'omg', 'yasss', 'yaaas',
    // WhatsApp slang & abbreviations
    'lolz', 'lulz', 'kk', 'kkk', 'okk', 'okkk', 'alright', 'alrighty', 'aight',
    'fab', 'fabulous', 'brilliant', 'superb', 'splendid', 'marvelous', 'peachy',
    'gr8', 'gr9', 'grt', 'gud', 'goood', 'goooood', 'niceee', 'nicee',
    'coool', 'cooool', 'sweeet', 'yaaay', 'yayyy', 'wohoo', 'woohoo',
    'aww', 'awww', 'awwww', 'awh', 'aw', 'cute', 'adorable', 'cutest',
    'loving', 'lovin', 'loooove', 'lovee', 'luv', 'luvv', 'lurv',
    // Reactions & affirmations
    'totally', 'absolutely', 'definitely', 'for sure', 'no doubt', 'agreed',
    'right', 'exactly', 'same', 'relatable', 'mood', 'big mood', 'felt',
    'valid', 'real', 'facts', 'true', 'so true', 'preach',
    // Internet slang
    'tbh', 'ngl', 'fr', 'frfr', 'ong', 'lowkey', 'highkey', 'period', 'periodt',
    'slay', 'slayed', 'slaying', 'queen', 'king', 'legend', 'icon', 'iconic',
    'chef kiss', 'chefs kiss', 'blessed', 'vibing', 'chillin', 'chilling',
    // Misspellings & variations
    'happi', 'happie', 'happpy', 'awsome', 'awsum', 'amazin', 'amaze',
    'luv', 'lov', 'lovly', 'graet', 'grate', 'niceee', 'thanx', 'thx', 'ty', 'thnx',
    '😊', '😄', '😁', '❤️', '💕', '💖', '😍', '🥰', '😘', '🎉', '🎊', '👏',
    '🔥', '✨', '💯', '👍', '🙌', '😃', '😀', '🥳', '💗', '💓', '💞', '💝',
    '😂', '🤣', '😅', '🤗', '🥹', '💖', '🤩', '😎', '🙂', '☺️', '💛', '💚',
  ],
  sadness: [
    'sad', 'sorry', 'miss', 'missed', 'cry', 'crying', 'hurt', 'pain',
    'lost', 'alone', 'lonely', 'depressed', 'upset', 'disappointed', 'terrible',
    'awful', 'worst', 'sucks', 'unfortunate', 'regret', 'wish', 'heartbroken',
    'miserable', 'down', 'blue', 'gloomy', 'melancholy', 'grief', 'sorrow',
    // Casual variations
    'ugh', 'meh', 'blah', 'bummer', 'dang', 'damn', 'crap', 'oof',
    'rough', 'tough', 'hard', 'difficult', 'struggle', 'struggling',
    // WhatsApp expressions
    'ughhh', 'ughhhh', 'mehh', 'blahhh', 'noo', 'nooo', 'noooo', 'oh no',
    'cant take', "can't take", 'fed up', 'tired', 'exhausted', 'drained',
    'broken', 'crushed', 'shattered', 'devastated', 'destroyed',
    'killing me', 'dying', 'dead inside', 'cant even', "can't even",
    'giving up', 'done', 'over it', 'had enough', 'cant do this', "can't do this",
    'hopeless', 'helpless', 'worthless', 'empty', 'numb',
    // Variations & misspellings
    'sadd', 'sadddd', 'sorri', 'sori', 'sorryy', 'cryin', 'cryed',
    'missss', 'missin', 'missing u', 'missing you', 'i miss',
    'hurting', 'hurts', 'painful', 'painfull',
    // Low energy expressions
    'tired af', 'exhausted af', 'cant anymore', 'giving up', 'whatever',
    'dont care', "don't care", 'who cares', 'so what', 'why bother',
    '😢', '😭', '😔', '☹️', '😞', '💔', '😥', '😪', '🥺', '😿', '🙁', '😣', '😖',
  ],
  anger: [
    'angry', 'mad', 'hate', 'annoyed', 'annoying', 'frustrated', 'stupid',
    'idiot', 'damn', 'wtf', 'ridiculous', 'unacceptable', 'disgusting',
    'furious', 'pissed', 'irritated', 'sick of', 'fed up', 'outraged',
    'infuriated', 'livid', 'enraged', 'hostile', 'resentful', 'bitter',
    // WhatsApp anger expressions
    'wth', 'tf', 'wtaf', 'omfg', 'ffs', 'smh', 'bruh', 'bruhhh',
    'seriously', 'srsly', 'for real', 'are u kidding', 'are you kidding',
    'joke', 'joking', 'unbelievable', 'cant believe', "can't believe",
    'bullshit', 'bs', 'nonsense', 'trash', 'garbage', 'worst',
    'pathetic', 'lame', 'weak', 'dumb', 'dumbass', 'moron', 'fool',
    'screw this', 'screw you', 'fuck', 'fuckin', 'fucking', 'shit',
    // Frustration
    'annoying af', 'pissed off', 'pissing me off', 'driving me crazy',
    'getting on my nerves', 'nerve', 'nerves', 'bugging', 'bothering',
    'irritating', 'frustrating af', 'aggravating', 'aggravated',
    // Variations
    'angryyy', 'maddd', 'angryy', 'hatee', 'hateee', 'annoyingg',
    'stupiddd', 'anoyying', 'frustratin', 'frustratin',
    '😠', '😡', '🤬', '😤', '🙄', '😒', '💢',
  ],
  affection: [
    'love you', 'miss you', 'thinking of you', 'care about', 'adore',
    'sweetheart', 'darling', 'honey', 'baby', 'babe', 'dear', 'treasure',
    'precious', 'forever', 'always', 'kiss', 'hug', 'cuddle', 'embrace',
    'cherish', 'devoted', 'fond of', 'attached', 'intimate', 'tender',
    // WhatsApp affection
    'ily', 'ilysm', 'ily2', 'luv u', 'luv you', 'love ya', 'love u', 'lov u',
    'lovee', 'loove', 'loveee', 'lub u', 'wub u', 'wuv u',
    'miss u', 'miss ya', 'missu', 'missing u', 'i miss u',
    'thinking bout you', 'thinking about u', 'thought of you',
    // Pet names & terms of endearment
    'bae', 'baee', 'bby', 'bbg', 'bb', 'cutie', 'sweetie', 'hun', 'hunny',
    'my love', 'my dear', 'my everything', 'my world', 'my heart',
    'angel', 'sunshine', 'moonlight', 'star', 'beautiful', 'handsome',
    'gorgeous', 'stunning', 'perfect', 'special', 'amazing person',
    // Actions & expressions
    'kisses', 'kissing', 'kissed', 'hugs', 'hugging', 'hugged', 'hug u',
    'cuddling', 'cuddles', 'snuggle', 'snuggles', 'holding hands',
    'hold you', 'holding you', 'warm hug', 'tight hug', 'squeeze',
    'xoxo', 'muah', 'mwah', 'smooch', 'smooches',
    // Caring expressions
    'take care', 'stay safe', 'be safe', 'sleep well', 'sweet dreams',
    'thinking of u', 'you mean', 'mean everything', 'mean so much',
    'care so much', 'care deeply', 'care bout you',
    // Variations
    'lovvv', 'lovvve', 'missss', 'kisss', 'huggg', 'babyyyy', 'babee',
    '💑', '💏', '👫', '🫂', '😘', '😻', '💝', '💋', '🥰', '😍', '❤️‍🔥',
    '💞', '💓', '💗', '💖', '💕', '❣️', '💌', '🤍', '🧡', '💜',
  ],
  gratitude: [
    'thank you', 'thanks', 'appreciate', 'grateful', 'thankful', 'blessing',
    'blessed', 'lucky', 'fortunate', 'kind', 'kindness', 'helpful',
    'support', 'thank god', 'indebted', 'obliged', 'recognition', '🙏',
    // WhatsApp gratitude
    'thx', 'thnx', 'thanx', 'ty', 'tyvm', 'tysm', 'tq', 'tanks',
    'thank u', 'thank you so much', 'thanks alot', 'thanks a lot',
    'thank youu', 'thankss', 'thanksss', 'thankuuu',
    'appreciate it', 'appreciate you', 'appreciate that', 'much appreciated',
    'really appreciate', 'truly appreciate', 'so grateful', 'very grateful',
    'cant thank', "can't thank", 'thank you enough', 'means alot', 'means a lot',
    // Expressions of gratitude
    'youre amazing', "you're amazing", 'youre the best', "you're the best",
    'best friend', 'best person', 'amazing friend', 'great friend',
    'saved me', 'life saver', 'lifesaver', 'helped me', 'helping me',
    'owe you', 'owe u', 'debt', 'forever grateful', 'eternally grateful',
    // Blessings
    'god bless', 'blessings', 'blessed to have', 'blessed to know',
    'lucky to have', 'fortunate to have', 'glad to have',
    // Variations
    'gratefull', 'greatful', 'thaaaanks', 'thankyou', 'thnku',
    '🙏', '🙌', '❤️', '💕', '🥺', '😊', '🤗', '💯',
  ],
  apology: [
    'sorry', 'apologize', 'apology', 'my bad', 'forgive', 'mistake',
    'my fault', 'regret', 'didnt mean', "didn't mean", 'pardon', 'excuse me',
    'remorseful', 'ashamed', 'guilty',
    // WhatsApp apologies
    'sry', 'srry', 'soryy', 'soryyy', 'sorri', 'sori', 'sorii',
    'my b', 'mb', 'mybad', 'ma bad', 'mah bad',
    'so sorry', 'soo sorry', 'sooo sorry', 'really sorry', 'truly sorry',
    'very sorry', 'deeply sorry', 'super sorry', 'extremely sorry',
    'sorry bout', 'sorry about', 'sorry for', 'apologise', 'apologies',
    // Explanations & excuses
    'didnt mean to', "didn't mean to", 'wasnt trying', "wasn't trying",
    'didnt realize', "didn't realize", 'my mistake', 'made a mistake',
    'messed up', 'screwed up', 'fucked up', 'messed things up',
    'shouldnt have', "shouldn't have", 'shoulda', 'coulda', 'woulda',
    // Asking forgiveness
    'forgive me', 'plz forgive', 'please forgive', 'can u forgive',
    'hope u forgive', 'hope you forgive', 'pardon me',
    'dont be mad', "don't be mad", 'please dont', "please don't",
    // Feelings
    'feel bad', 'feel terrible', 'feel awful', 'feel horrible',
    'feeling guilty', 'feeling bad', 'so bad', 'really bad about',
    // Variations
    'sorryyy', 'sorryyyy', 'sorrrry', 'apologise', 'apologys',
    '🙏', '😔', '🥺', '😢', '💔', '😞', '😣',
  ],
  anxiety: [
    'worried', 'worry', 'nervous', 'anxious', 'stress', 'stressed',
    'overwhelmed', 'scared', 'afraid', 'fear', 'concern', 'concerned',
    'panic', 'tense', 'uneasy', 'apprehensive', 'troubled', 'insecure',
    // WhatsApp anxiety expressions
    'freaking out', 'freaking', 'freak out', 'freaked out', 'panicking',
    'panicked', 'stressing', 'stressed out', 'stressed af', 'so stressed',
    'worrying', 'worries', 'worried sick', 'so worried', 'really worried',
    'nervous af', 'nervousss', 'scared af', 'scareddd', 'terrified',
    // Overwhelm
    'too much', 'cant handle', "can't handle", 'cant deal', "can't deal",
    'overwhelm', 'overwhelming', 'drowning', 'suffocating', 'cant breathe',
    'falling apart', 'losing it', 'losing my mind', 'going crazy',
    'cant cope', "can't cope", 'breaking down', 'breakdown',
    // Fear expressions
    'afraid of', 'scared of', 'frightened', 'fearful', 'terrifying',
    'nightmare', 'nightmares', 'paranoid', 'paranoia',
    'what if', 'worried about', 'concern about', 'concerned about',
    // Pressure & tension
    'under pressure', 'so much pressure', 'pressure is', 'tense',
    'on edge', 'edge', 'shaking', 'trembling', 'sweating',
    'heart racing', 'cant sleep', "can't sleep", 'insomnia',
    // Uncertainty
    'unsure', 'uncertain', 'dont know what', "don't know what",
    'confused', 'lost', 'helpless', 'hopeless feeling',
    // Variations
    'worryed', 'worrid', 'nervouse', 'stressd', 'anxios', 'scareddd',
    '😰', '😨', '😱', '😬', '😟', '😧', '🫨', '😵', '💀', '🫣',
  ],
  excitement: [
    'excited', 'cant wait', "can't wait", 'looking forward', 'thrilled',
    'pumped', 'hyped', 'omg', 'wow', 'amazing news', 'incredible',
    'enthusiastic', 'eager', 'anticipating', 'stoked', '🤩', '😃',
    // Casual variations
    'woah', 'whoa', 'woo', 'wooho', 'yay', 'yess', 'lets go', "let's go",
    'omfg', 'holy', 'insane', 'crazy', 'unbelievable', 'no way',
    // WhatsApp excitement
    'omggg', 'omgggg', 'omfgg', 'wowww', 'wowwww', 'wowza', 'woooow',
    'yayyy', 'yayyyy', 'woohoo', 'woohooo', 'yesss', 'yessss', 'hell yeah',
    'so excited', 'super excited', 'really excited', 'soo excited',
    'cant wait to', "can't wait to", 'waiting for', 'waiting to',
    'psyched', 'stoked af', 'pumped up', 'hyped up', 'so hyped',
    // Reactions
    'no wayy', 'no wayyy', 'shut up', 'get out', 'stop it',
    'you kidding', 'are you serious', 'seriously', 'for real',
    'thats amazing', "that's amazing", 'thats incredible', 'thats insane',
    'mind blown', 'blown away', 'shook', 'shooketh', 'dead',
    'dying', 'im dead', "i'm dead", 'screaming', 'im screaming',
    // Enthusiasm
    'love this', 'love it', 'loving this', 'best news', 'best thing',
    'amazing', 'fantastic', 'incredible', 'unreal', 'surreal',
    'dream come true', 'finally', 'finallyy', 'at last',
    // Anticipation
    'soon', 'coming soon', 'almost here', 'almost time', 'countdown',
    'counting down', 'ready for', 'prepared for', 'bring it on',
    // Variations
    'excitedd', 'exciteddd', 'hypedd', 'pumpedd', 'wowww', 'amazin',
    '🎉', '🥳', '🤗', '😆', '🙀', '😱', '🤯', '🎊', '🎈', '🥰',
    '🤩', '😍', '🔥', '💥', '⚡', '✨', '🌟', '💫', '🎆', '🎇',
  ],
  trust: [
    'trust', 'believe', 'confident', 'faith', 'rely', 'depend', 'count on',
    'honest', 'truthful', 'genuine', 'authentic', 'reliable', 'loyal',
    'committed', 'dedicated', 'sincere',
  ],
  betrayal: [
    'betrayed', 'lied', 'cheated', 'deceived', 'dishonest', 'unfaithful',
    'backstabbed', 'two-faced', 'fake', 'phony', 'manipulated', 'used',
    'abandoned', 'let down', 'broken promise',
  ],
  pride: [
    'proud', 'accomplished', 'achieved', 'successful', 'triumph', 'victory',
    'excellence', 'mastery', 'skillful', 'competent', 'capable', 'impressive',
  ],
  shame: [
    'ashamed', 'embarrassed', 'humiliated', 'mortified', 'disgrace',
    'guilty', 'remorseful', 'shameful', 'regretful', 'uncomfortable',
  ],
};

// Context-specific keywords
export const contextKeywords = {
  // Business & Corporate context
  business: [
    'meeting', 'deadline', 'project', 'client', 'proposal', 'contract',
    'revenue', 'profit', 'loss', 'budget', 'investment', 'roi', 'kpi',
    'strategy', 'market', 'competitor', 'sales', 'marketing', 'ceo',
    'board', 'stakeholder', 'merger', 'acquisition', 'partnership',
    'presentation', 'report', 'quarterly', 'annual', 'fiscal', 'business',
    'corporate', 'enterprise', 'industry', 'sector', 'market share',
    'quarterly results', 'earnings', 'stock', 'shares', 'investor',
    'board meeting', 'executive', 'management', 'department', 'team lead',
    'okr', 'okrs', 'qbr', 'all hands', 'town hall', 'one-on-one', '1:1',
    'cross-functional', 'alignment', 'strategic initiative', 'business case',
    'go-to-market', 'gtm', 'pipeline', 'forecast', 'bookings', 'quota',
    'arr', 'mrr', 'churn', 'retention', 'nps', 'cac', 'ltv', 'clv',
    'gross margin', 'margin', 'ebitda', 'p&l', 'cash flow', 'runway',
    'burn rate', 'valuation', 'cap table', 'equity',
    'operations', 'operational', 'org', 'organization', 'business unit', 'bu',
    'governance', 'compliance', 'regulatory', 'audit', 'risk management',
    'controls', 'policy', 'procedure', 'sop', 'procurement', 'vendor',
    'supplier', 'supply chain', 'statement of work', 'sow', 'msa',
    'master service agreement', 'sla', 'service level', 'rfp', 'rfq', 'rfi',
    'po', 'purchase order', 'invoice', 'billing', 'accounts payable',
    'accounts receivable', 'finance', 'legal', 'hr', 'people ops',
    'headcount', 'hiring plan', 'workforce', 'reorg', 'restructure',
    'quarter close', 'competitive analysis', 'market sizing',
    'balance sheet', 'income statement', 'cash flow statement', 'financial statement',
    'gaap', 'ifrs', 'cogs', 'opex', 'capex', 'operating income', 'net income',
    'gross profit', 'net profit', 'operating margin', 'net margin', 'working capital',
    'dso', 'days sales outstanding', 'dpo', 'days payables outstanding', 'dio',
    'days inventory on hand', 'forecast accuracy', 'budget variance', 'variance analysis',
    'cost center', 'profit center', 'expense report', 'expense policy', 'travel policy',
    'reimbursement', 'capital allocation', 'treasury', 'cash management', 'liquidity',
    'earnings call', 'investor relations', 'ir', 'sec filing', '10-k', '10-q', 's-1',
    'ipo', 'earnings guidance', 'board deck', 'strategic plan', 'operating plan',
    'annual plan', 'long-range plan', 'north star', 'strategic pillar', 'business review',
    'operating review', 'exec summary', 'kpi dashboard', 'scorecard', 'balanced scorecard',
    'management report', 'business continuity', 'bcdr', 'risk register', 'internal controls',
    'sox', 'sox compliance', 'audit committee', 'board committee', 'steering committee',
    'decision log', 'operating cadence', 'governance model', 'operating model', 'org design',
    'org structure', 'headcount plan', 'workforce planning', 'succession planning', 'lead',
    'leads', 'prospect', 'prospecting', 'opportunity', 'opportunities', 'deal cycle',
    'deal desk', 'sales cycle', 'pipeline review', 'lead gen', 'demand gen', 'account plan',
    'account executive', 'ae', 'sdr', 'bdr', 'sales ops', 'revops', 'revenue operations',
    'quota attainment', 'win rate', 'close rate', 'average selling price', 'asp', 'deal size',
    'contract value', 'acv', 'tcv', 'upsell', 'cross-sell', 'renewal', 'renewals',
    'pipeline stage', 'stage gate', 'forecast category', 'commit', 'best case', 'upside',
    'commit number', 'brand', 'branding', 'positioning', 'value proposition', 'messaging',
    'campaign', 'campaigns', 'lead nurturing', 'funnel', 'top of funnel', 'middle of funnel',
    'bottom of funnel', 'conversion rate', 'ctr', 'cpc', 'cpm', 'seo', 'sem', 'paid search',
    'content marketing', 'mql', 'sql', 'product marketing', 'segmentation', 'targeting',
    'persona', 'customer journey', 'brand awareness', 'customer success', 'csat',
    'customer satisfaction', 'health score', 'adoption', 'renewal date',
  ],

  // Professional/Work context
  professional: [
    'work', 'job', 'career', 'office', 'boss', 'manager', 'colleague',
    'coworker', 'employee', 'employer', 'interview', 'promotion', 'raise',
    'salary', 'benefits', 'performance', 'evaluation', 'feedback',
    'assignment', 'task', 'responsibility', 'accountability', 'professional',
    'networking', 'conference', 'workshop', 'training', 'development',
    'performance review', 'performance appraisal', 'goal setting', 'okrs',
    'one-on-one', '1:1', 'all-hands', 'town hall', 'onboarding', 'offboarding',
    'pto', 'leave', 'vacation', 'sick leave', 'employee handbook', 'policy',
    'compliance training', 'hr', 'people ops', 'org chart', 'reporting line',
    'direct report', 'skip level', 'promotion cycle', 'compensation', 'bonus',
    'equity', 'rsu', 'offer', 'offer letter', 'workplace', 'hybrid', 'remote',
    'performance goals', 'objectives', 'key results', 'career path', 'career ladder',
    'leveling', 'job description', 'jd', 'requisition', 'req', 'headcount approval',
    'hiring manager', 'interview loop', 'onsite interview', 'screening', 'recruiter',
    'talent acquisition', 'candidate', 'applicant', 'offer stage', 'background check',
    'reference check', 'start date', 'orientation', 'probation', 'employment contract',
    'notice period', 'resignation', 'exit interview', 'severance', 'layoff',
    'reduction in force', 'rif', 'rehire', 'employee relations', 'grievance',
    'disciplinary', 'performance improvement plan', 'pip', 'coaching', 'mentorship',
    'manager feedback', 'peer review', '360 review', 'calibration', 'compensation review',
    'salary band', 'pay grade', 'pay range', 'equity grant', 'stock options', 'vesting',
    'cliff', 'benefits enrollment', 'open enrollment', 'health insurance', 'dental',
    'vision', 'hsa', 'fsa', 'payroll', 'timesheet', 'time off', 'absence',
    'leave of absence', 'loa', 'maternity leave', 'paternity leave', 'parental leave',
    'flexible schedule', 'flextime', 'core hours', 'performance bonus', 'annual bonus',
    'spot bonus', 'employee recognition', 'kudos', 'engagement survey', 'pulse survey',
    'manager one-on-one', 'skip-level', 'team meeting', 'staff meeting', 'standup',
    'check-in', 'okr review', 'career development', 'professional development',
    'training budget', 'learning stipend',
  ],

  // Project management context
  project: [
    'milestone', 'deliverable', 'sprint', 'agile', 'scrum', 'kanban',
    'roadmap', 'timeline', 'schedule', 'task', 'backlog', 'priority',
    'blocker', 'dependency', 'resource', 'allocation', 'scope', 'requirement',
    'specification', 'launch', 'deployment', 'testing', 'qa', 'bug',
    'feature', 'enhancement', 'iteration', 'release', 'version',
    'kickoff', 'kick-off', 'project plan', 'project charter', 'workstream',
    'status update', 'status report', 'risk log', 'issue log', 'raid log',
    'change request', 'change control', 'scope creep', 'critical path',
    'gantt', 'capacity', 'estimate', 'estimation', 'user story', 'epic',
    'acceptance criteria', 'uat', 'release plan', 'cutover', 'backout',
    'postmortem', 'retro', 'lessons learned', 'handoff', 'handover',
    'scope statement', 'scope baseline', 'requirements gathering', 'requirements workshop',
    'stakeholder analysis', 'stakeholder map', 'project sponsor', 'project governance',
    'steering group', 'project status', 'status meeting', 'weekly status',
    'action items', 'issue tracking', 'risk mitigation', 'mitigation plan',
    'contingency plan', 'dependency management', 'resource plan', 'resource loading',
    'capacity plan', 'effort estimate', 'story points', 'sprint planning',
    'sprint review', 'sprint demo', 'daily standup', 'backlog grooming',
    'backlog refinement', 'release candidate', 'code freeze', 'change freeze',
    'go-live', 'cutover plan', 'rollback plan', 'hypercare', 'stabilization',
    'defect triage', 'qa signoff', 'uat signoff', 'acceptance testing',
    'test plan', 'test case', 'regression testing', 'test coverage',
    'schedule variance', 'milestone review', 'phase gate', 'phase exit',
    'work breakdown structure', 'wbs', 'burndown', 'burnup', 'velocity',
    'sprint retrospective', 'project retrospective', 'release retrospective',
    'scope change', 'change order', 'deliverable acceptance',
  ],

  // Romantic relationship context
  love: [
    'date', 'dating', 'boyfriend', 'girlfriend', 'partner', 'relationship',
    'romance', 'romantic', 'marriage', 'married', 'wedding', 'engagement',
    'engaged', 'anniversary', 'valentine', 'love', 'passion', 'intimacy',
    'commitment', 'devoted', 'soulmate', 'together', 'couple', 'us',
    'future together', 'moving in', 'propose', 'proposal',

    // General romantic language
    'i love you', 'love you', 'love u', 'luv you', 'i miss you',
    'i adore you', 'i cherish you', 'you mean everything',
    'you mean a lot to me', 'i care about you deeply',
    'you’re special to me', 'you’re important to me',
    'i want you', 'i want to be with you',
    'you make me happy', 'you make my day',
    'i’m thinking about you', 'thinking of you',
    'i can’t stop thinking about you',

    // Affection & closeness
    'babe', 'baby', 'bae', 'hun', 'honey', 'darling',
    'my love', 'my heart', 'my person', 'my everything',
    'my queen', 'my king', 'my woman', 'my man',
    'my person', 'my forever',
    'holding hands', 'hug', 'hugging', 'kiss', 'kissing',

    // Relationship progression
    'let’s be together', 'i want a future with you',
    'building a life', 'our future', 'long-term',
    'settling down', 'serious relationship',
    'move in together', 'cohabiting', 'start a family',
    'marriage plans', 'wedding plans', 'meet the parents',

    // Emotional intimacy
    'i trust you', 'i feel safe with you', 'you understand me',
    'you get me', 'you complete me', 'you’re my peace',
    'you’re my person', 'i’m here for you always',
    'you’re my safe space',

    // Romantic reassurance
    'i’m not going anywhere', 'i’m committed to you',
    'i choose you', 'you’re the one', 'you matter to me',
    'i’m loyal to you', 'i’m devoted to you',

    // Conflict-in-love phrasing
    'i don’t want to lose you', 'i care too much',
    'i’m afraid of losing you', 'please stay',
    'let’s fix this', 'i want us to work',
    'don’t give up on us',

    // Breakup/heart tensions (still romance-context)
    'i miss us', 'i still love you', 'broken heart',
    'heartache', 'heartbroken', 'we drifted',
    'we grew apart', 'i still care', 'i’m hurting',

    // Zambian / African love phrasing
    'iwe babe', 'iwe my love', 'my person pa Zed',
    'mwana wanga', 'chikondi', 'ninkukonda',
    'nalikutemwa', 'i love you pa real',
    'you’re my heartbeat', 'you’re my one and only',
    'tili pamodzi', 'future yathu', 'we move together',
    'you’re my oxygen', 'you’re my human',

    // Flirty tone (light, safe)
    'i like you', 'i’m into you', 'you look good',
    'you’re cute', 'you’re fine', 'you’re gorgeous',
    'you’re attractive', 'you make me blush',
    'you’re sweet', 'you’re charming',

    // Digital romance cues
    'good morning babe', 'goodnight love',
    'gm baby', 'gn babe', 'miss you texts',
    'thinking of you texts',
    'sending hearts', 'heart emoji', 'love emoji',

    // Couple identity markers
    'our thing', 'our bond', 'our love',
    'relationship goals', 'power couple',
    'love of my life', 'ride or die',

    // Proposal/wedding
    'engagement ring', 'wedding ring', 'bride', 'groom',
    'lobola', 'dowry', 'marriage ceremony', 'wedding bells',
    'save the date',
  ],

  // Friendship context
  friendship: [
    'friend', 'buddy', 'pal', 'bestie', 'bff', 'mate', 'hang out',
    'hangout', 'catch up', 'reunion', 'squad', 'crew', 'gang',
    'friendship', 'loyal', 'supportive', 'fun', 'memories', 'adventure',
  ],

  // Family context
  family: [
    'mom', 'dad', 'mother', 'father', 'parent', 'parents', 'brother',
    'sister', 'sibling', 'son', 'daughter', 'child', 'kid', 'kids',
    'grandma', 'grandpa', 'grandmother', 'grandfather', 'aunt', 'uncle',
    'cousin', 'niece', 'nephew', 'family', 'relatives', 'home', 'house',

    // Additional English variations
    'mum', 'mama', 'mommy', 'daddy', 'papa',
    'stepmom', 'stepdad', 'stepbrother', 'stepsister',
    'stepson', 'stepdaughter',
    'in-laws', 'mother-in-law', 'father-in-law',
    'brother-in-law', 'sister-in-law',
    'guardian', 'caretaker',

    // Relationship & household context
    'household', 'my people', 'our people', 'the kids', 'the children',
    'my folks', 'my old man', 'my old lady',
    'my partner', 'co-parent', 'baby mama', 'baby daddy',

    // Extended family
    'grandkids', 'grandchildren', 'godparent', 'godfather',
    'godmother', 'godchild',
    'descendant', 'ancestor', 'lineage', 'bloodline',

    // Zambian / African family terms
    'ba mama', 'ba dad', 'ba mayo', 'ba tata', 'banoko', 'batata',
    'banja', 'umoyo', 'abena kumuzi', 'village people',
    'shikulu', 'shikulu bakulu', 'nkashi', 'mwisho', 'malume', 'maibwe',
    'bama', 'bana', 'mwana', 'abana',
    'bakashi', 'bashikulu', 'ba shikashi', 'ba mudala',

    // Cultural relationship patterns
    'my clan', 'my tribe', 'my village', 'family back home',
    'visiting home', 'going to the village',
    'my elders', 'respect the elders', 'taking care of parents',

    // Common WhatsApp family references
    'checking on the kids', 'my family needs me',
    'at home with family', 'going to see mom',
    'visiting dad', 'family issues', 'family matters',
    'family meeting', 'family gathering', 'funeral at home',
    'someone at home is sick',

    // Domestic/home context
    'household chores', 'home responsibilities', 'home situation',
    'taking care of home', 'back home', 'things at home',
    'staying with family', 'living with parents', 'moving home',

    // Caregiving roles
    'taking care of mom', 'taking care of dad',
    'supporting family', 'family duty', 'family responsibility',
    'raising kids', 'taking care of children',
  ],

  // Conflict/Hostile context
  conflict: [
    'argue', 'argument', 'fight', 'fighting', 'disagree', 'disagreement',
    'conflict', 'tension', 'hostile', 'confrontation', 'dispute', 'quarrel',
    'clash', 'debate', 'opposition', 'against', 'versus', 'vs',

    // Direct conflict
    'we’re arguing', 'you’re arguing', 'stop arguing',
    'you’re fighting me', 'we’re fighting', 'you’re attacking me',
    'you don’t listen', 'you’re not listening',
    'this is a problem', 'we have a problem',
    'things are heated', 'things are tense',
    'this is turning into a fight',

    // Accusatory tone
    'you’re wrong', 'you got it wrong', 'that’s not true',
    'stop twisting things', 'stop lying', 'you’re lying',
    'you caused this', 'you started this', 'you made this worse',
    'don’t put this on me', 'that’s on you',

    // Escalation signals
    'say it again', 'what did you say', 'try me',
    'don’t push me', 'don’t test me',
    'you’re provoking me', 'keep talking',
    'this won’t end well', 'don’t start',

    // Frustration conflict
    'i’m tired of this', 'i’ve had enough',
    'i’m done with this', 'this is annoying',
    'you’re stressing me', 'you’re pushing me',
    'you’re making this harder', 'you’re overreacting',
    'why are you like this', 'this is too much',

    // Indirect conflict/resentment
    'i don’t like this', 'i’m not happy with this',
    'this isn’t working', 'this doesn’t sit well with me',
    'i’m upset', 'i’m bothered',
    'you disappointed me', 'i’m frustrated with you',
    'this is not okay', 'you crossed the line',

    // Heated back-and-forth patterns
    'thats not what happened', "that's not what happened",
    'you don’t get it', 'you misunderstood',
    'stop blaming me', 'stop accusing me',

    // WhatsApp / African conflict flavor
    'iwe stop that', 'iwe calm down', 'don’t start nonsense',
    'you’re bringing drama', 'why are you making noise',
    'mudala relax', 'are you serious', 'come off it',
    'you’re overdoing', 'you’re causing issues',
    'this is beef', 'don’t spark beef',
    'ulishupa', 'don’t provoke me',
    'why are you attacking me', 'ma issues', 'there’s fire here',

    // Social conflict language
    'beef', 'drama', 'problem', 'issue', 'misunderstanding',
    'fallout', 'breakdown', 'rift', 'bad blood',

    // Competitive/oppositional framing
    'against me', 'opposing me', 'vs me', 'versus me',
    'taking sides', 'we’re not on the same side',
    'you’re challenging me', 'you’re confronting me',

    // Conflict escalation markers
    'stop shouting', 'stop yelling', 'don’t raise your voice',
    'lower your tone', 'watch your tone', 'calm down',
    'why are you shouting', 'we’re going in circles',
    'this is getting out of hand',
  ],

  // Technical/Development context
  technical: [
    // Programming & Development
    'code', 'coding', 'programming', 'developer', 'development', 'software',
    'algorithm', 'function', 'method', 'class', 'variable', 'array', 'object',
    'string', 'integer', 'boolean', 'loop', 'iteration', 'recursion',
    'compile', 'compiler', 'build', 'debug', 'debugging', 'breakpoint',
    'stack trace', 'error', 'exception', 'syntax', 'runtime', 'memory leak',

    // Languages & Frameworks
    'javascript', 'python', 'java', 'typescript', 'react', 'node', 'angular',
    'vue', 'django', 'flask', 'spring', 'express', '.net', 'ruby', 'rails',
    'php', 'swift', 'kotlin', 'go', 'rust', 'c++', 'c#', 'sql',

    // Architecture & Design
    'architecture', 'design pattern', 'mvc', 'api', 'rest', 'graphql',
    'microservices', 'monolith', 'serverless', 'backend', 'frontend',
    'fullstack', 'endpoint', 'middleware', 'authentication', 'authorization',
    'jwt', 'oauth', 'webhook', 'payload', 'request', 'response',

    // DevOps & Infrastructure
    'devops', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'container',
    'deployment', 'deploy', 'server', 'cloud', 'aws', 'azure', 'gcp',
    'heroku', 'vercel', 'netlify', 'infrastructure', 'load balancer',
    'scaling', 'horizontal', 'vertical', 'cdn', 'nginx', 'apache',

    // Database & Storage
    'database', 'db', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql',
    'redis', 'elasticsearch', 'query', 'schema', 'table', 'collection',
    'migration', 'orm', 'transaction', 'index', 'primary key', 'foreign key',

    // Version Control & Collaboration
    'git', 'github', 'gitlab', 'bitbucket', 'commit', 'push', 'pull',
    'branch', 'merge', 'rebase', 'pull request', 'pr', 'code review',
    'fork', 'clone', 'repository', 'repo', 'version control',

    // Testing & Quality
    'test', 'testing', 'unit test', 'integration test', 'e2e', 'tdd',
    'jest', 'mocha', 'cypress', 'selenium', 'coverage', 'mock', 'stub',
    'refactor', 'refactoring', 'optimization', 'performance', 'benchmark',
    'profiling', 'lint', 'linter', 'eslint', 'prettier', 'code quality',

    // Security & Best Practices
    'security', 'vulnerability', 'xss', 'csrf', 'sql injection', 'encryption',
    'hashing', 'ssl', 'tls', 'https', 'penetration test', 'audit',
    'best practice', 'clean code', 'solid', 'dry', 'design principles',

    // Troubleshooting & Problem Solving
    'bug', 'issue', 'fix', 'patch', 'hotfix', 'workaround', 'troubleshoot',
    'investigate', 'reproduce', 'crash', 'hang', 'timeout', 'bottleneck',
    'race condition', 'deadlock', 'performance issue', 'latency',

    // Tools & Technologies
    'npm', 'yarn', 'webpack', 'babel', 'vite', 'rollup', 'gradle', 'maven',
    'ide', 'vscode', 'intellij', 'terminal', 'cli', 'command line',
    'package', 'library', 'dependency', 'module', 'import', 'export',

    // Methodologies
    'agile', 'scrum', 'sprint', 'standup', 'retrospective', 'planning poker',
    'story points', 'velocity', 'burndown', 'kanban', 'waterfall',

    // Web & Mobile
    'html', 'css', 'sass', 'less', 'responsive', 'mobile', 'ios', 'android',
    'pwa', 'spa', 'ssr', 'seo', 'accessibility', 'a11y', 'dom', 'browser',
    'chrome', 'firefox', 'safari', 'webkit', 'rendering', 'layout',

    // Data & Analytics
    'data structure', 'big o', 'complexity', 'hash table', 'linked list',
    'tree', 'graph', 'binary search', 'sorting', 'json', 'xml', 'yaml',
    'serialization', 'parsing', 'regex', 'regular expression',

    // Modern Concepts
    'async', 'asynchronous', 'promise', 'callback', 'event loop', 'concurrency',
    'parallel', 'thread', 'process', 'state management', 'redux', 'context',
    'hooks', 'props', 'component', 'virtual dom', 'hydration',
  ],

  // Support/Care context
  support: [
    'support', 'help', 'helping', 'assist', 'assistance', 'care', 'caring',
    'comfort', 'encourage', 'encouragement', 'motivate', 'motivation',
    'inspire', 'inspiration', 'believe in', 'rooting for', 'here for you',
    'got your back', 'lean on', 'shoulder to cry on',

    // Emotional support
    'i’m here for you', 'i got you', 'you’re not alone', 'you can count on me',
    'i’m with you', 'i stand with you', 'i understand', 'i hear you',
    'i feel you', 'i get you', 'take your time', 'i’m listening',
    'you can vent', 'talk to me', 'you can talk to me', 'let it out',
    'you matter', 'you’re valued', 'you’re important', 'i care',
    'you’re safe here', 'you’re supported', 'you’re stronger than you think',

    // Practical support
    'let me help', 'how can i help', 'i’ll help you', 'i’ll support you',
    'i can assist', 'need backup', 'i got your back on this',
    'i’ll be there for you', 'i’m available', 'reach out anytime',
    'let me know what you need', 'i can step in', 'i can handle this with you',

    // Reassurance
    'you’ll be okay', 'you’ll get through this', 'it gets better',
    'you’re doing well', 'keep going', 'don’t stress', 'don’t worry',
    'i believe in you', 'you can do this', 'you’ve got this',
    'stay strong', 'i’m proud of you', 'you’re improving',

    // Friendship/connection care
    'i care about you', 'checking on you', 'thinking of you',
    'hope you’re okay', 'are you fine', 'i worry about you',
    'let me check on you', 'how are you holding up',
    'talk to me anytime', 'i value you', 'i appreciate you',

    // Zambian / African support phrasing
    'iwe we’re together', 'tizapanga', 'we move', 'i’m behind you',
    'ulipo', 'tili pamodzi', 'we are here', 'don’t lose hope',
    'iwe you’re strong', 'tizakwanisa', 'kulibe giving up',
    'i’m with you pa ground', 'stay solid', 'you’re covered',
    'ndine nawo', 'i’m backing you', 'go forward, i got you',

    // Spiritual/comfort (commonly used)
    'god’s with you', 'god will help you', 'stay blessed',
    'pray about it', 'i’m praying for you',
  ]
};

// Communication styles and intents
export const communicationPatterns = {
  // Assertive — healthy, direct, clear expression
  assertive: [
    'i think', 'i feel', 'i believe', 'my opinion', 'my perspective',
    'i would like', 'i prefer', 'id appreciate', "i'd appreciate",
    'lets discuss', "let's discuss", 'can we talk', 'id like to understand',
    'from my view', 'from my side', 'here’s what i mean',
    'this is how i see it', 'i expect', 'i choose to', 'i need',
    'i want to clarify', 'i want to address this directly',
    'im comfortable with', "i'm comfortable with",
    'id rather', "i'd rather", 'i value honesty',
    'lets be clear', "let's be clear",

    // Zambian/WhatsApp assertive
    'truth is', 'to be honest', 'lemme be clear', 'let me be direct',
    'i won’t lie', 'honestly speaking', 'pa ground reality',
  ],

  // Passive-aggressive — indirect hostility, emotional withdrawal
  passiveAggressive: [
    'fine', 'whatever', 'if you say so', 'sure', 'i guess', 'nevermind',
    'nothing', 'its fine', "it's fine", 'dont worry', "don't worry",
    'no worries', 'im fine', "i'm fine", 'forget it', 'nothing wrong',
    'ok then', 'if that makes you happy', 'do what you want',
    'go ahead', 'its cool', "it's cool", 'as usual',
    'i won’t argue', 'ok sure', 'nice', 'alright then',
    'you win', 'as you wish', 'i’m done talking',

    // Zambian/WhatsApp style
    'okay boss', 'sure sure', 'yasila', 'do you', 'endapo',
    'you’ve decided', 'mwapanga', 'cool story', 'good for you',
    'it’s whatever', 'no stress (but there is)',
  ],

  // Defensive — protecting self, shifting blame, explaining away
  defensive: [
    'but i', 'but you', 'thats not fair', "that's not fair", 'you always',
    'you never', 'why do you', 'stop blaming', 'not my fault',
    'you started', 'what about you', 'and you', 'at least i',
    'you misunderstood', 'you don’t get it', 'you twisted it',
    'i didn’t mean it like that', 'i was just saying',
    'im not the bad guy', "i'm not the bad guy",
    'that’s not what happened', 'you’re exaggerating',
    'you misinterpreted', 'you assumed wrong',

    // Local tone
    'ine nshalanda so', 'ulelanda fye', 'that’s not me',
    'don’t paint me bad', 'i didn’t start this',
  ],

  // Supportive — comforting, empowering, encouraging
  supportive: [
    'im here', "i'm here", 'you can', 'you got this', 'believe in you',
    'proud of you', 'well done', 'good job', 'youre amazing', "you're amazing",
    'youre doing great', 'keep going', 'dont give up', "don't give up",
    'im with you', "i'm with you", 'i support you', 'im on your side',
    'you’re stronger than you think', 'you’ll be okay',
    'i’ve got your back', 'you can rely on me',
    'take your time', 'you’re improving', 'you matter',

    // Zambian warmth/support
    'iwe you’re strong', 'tizakwanisa', 'we move', 'i’m rooting for you',
    'stay strong', 'go for it', 'ulipo', 'i believe in you big time',
  ],

  // Planning / Future-oriented — proactive, coordinating, scheduling
  planning: [
    'lets plan', "let's plan", 'we should', 'we could', 'how about',
    'what if', 'planning', 'schedule', 'arrange', 'organize',
    'future', 'next', 'soon', 'later', 'eventually', 'tomorrow',
    'lets sort this out', "let's sort this out", 'timeline', 'deadline',
    'can we meet', 'let’s set a date', 'steps', 'prepare',
    'next steps', 'going forward', 'moving ahead',
    'we can start with', 'let’s work on',

    // Local phrasing
    'tikonke plan', 'let’s schedule properly', 'tifike pa agreement',
    'let’s finalize', 'tizichita bwanji', 'strategy time',
  ],

  // Question / Inquiry — exploring, requesting info
  questioning: [
    'what', 'when', 'where', 'why', 'how', 'who', 'which',
    '?', 'wondering', 'curious', 'question', 'asking',
    'do you know', 'can you explain', 'is it possible',
    'could you clarify', 'what does that mean',
    'how come', 'where exactly', 'why though', 'is that true',
    'are you sure', 'what’s going on', 'what happened',
    'need details',

    // Local forms
    'nanga bwanji', 'kuti mwa', 'kuli shani', 'ati how',
    'explain mwaiche', 'why kanshi', 'how kanshi',
  ],

  // Affirmation / Agreement — positive alignment
  agreeing: [
    'yes', 'yeah', 'yep', 'sure', 'absolutely', 'definitely', 'exactly',
    'agreed', 'i agree', 'makes sense', 'sounds good', 'perfect',
    'right', 'correct', 'true', 'indeed', 'of course',
    'i concur', 'works for me', 'true story', 'fair enough',
    'i get you', 'i see your point',

    // Local agreement
    'eeya', 'ndiyo', 'yep sure', 'truth', 'facts', 'sharp',
    'kulibe doubting', 'i feel that', 'manje yeah',
  ],

  // Disagreement — rejecting, challenging, offering alternative
  disagreeing: [
    'no', 'nope', 'nah', 'disagree', 'dont think so', "don't think so",
    'not sure', 'maybe not', 'i dont think', "i don't think",
    'actually', 'but', 'however', 'although', 'on the other hand',
    'that’s not right', 'i see it differently', 'i don’t agree',
    'i have another view', 'not exactly', 'i question that',
    'that doesn’t add up', 'i doubt that', 'not buying it',
    'i think you’re mistaken',

    // Local disagreement
    'ayi', 'chaipa', 'noo iwe', 'that’s off', 'i don’t feel that',
    'sichitika', 'i call cap', 'no ways', 'i’m not convinced',
  ],
};

// Toxicity detection keywords
export const toxicityKeywords = {
  insults: [
    'idiot', 'stupid', 'dumb', 'moron', 'loser', 'pathetic', 'worthless',
    'useless', 'incompetent', 'failure', 'trash', 'garbage', 'disgusting',
    'clown', 'fool', 'buffoon', 'airhead', 'blockhead', 'simpleton',
    'waste of space', 'pea brain', 'small brain', 'dead brain',
    'you’re slow', 'thick headed', 'dense', 'braindead',

    // Slang & African/Zambian style
    'mbuzi', 'fonkopa', 'iwe chi', 'chi stupid', 'wamene', 'wamene iwe',
    'chi loss', 'chi nonsense', 'chisilu', 'bakawalala', 'iwe uli chipuba',
    'chipuba', 'koswe', 'ka hule', 'ka mbuzi', 'foolish boy', 'foolish girl',
    'you’re a joke', 'you’re nothing', 'you’re a clown', 'ka clown',
    'you behave like a child', 'chi slow motion', 'ka useless',
  ],

  aggression: [
    'hate you', 'hate this', 'shut up', 'leave me alone', 'go away',
    'kill', 'die', 'dead', 'hurt you', 'destroy', 'ruin', 'screw you',
    'i’ll deal with you', 'you’ll see', 'try me', 'don’t test me',
    'i’m done with you', 'i’ll finish you', 'watch yourself', 'stop talking',
    'you’re pushing me', 'i can end you', 'you’ll regret',

    // Localities / WhatsApp hostility
    'nika kula', 'nikupweteka', 'uzalila', 'ndekupaya', 'ndekukongola',
    'ufunse', 'kakoma', 'i swear for you', 'don’t force me',
    'I’ll slap you', 'I’ll sort you out', 'I’ll beat you',
  ],

  dismissive: [
    'whatever', 'don’t care', 'dont care', 'who cares', 'so what',
    'your problem', 'not my problem', 'deal with it', 'get over it',
    'ok sure', 'good for you', 'do what you want', 'i’m not bothered',
    'keep talking', 'irrelevant', 'pointless', 'you done?',
    'lol ok', 'okay boss', 'cool story bro', 'nice try',

    // Zambian/WhatsApp dismissive
    'sipangana', 'do you', 'it’s fine continue', 'iwe endapo',
    'ukalanda che', 'kukamba zoona', 'and then?', 'okay sure sure',
    'ndabwela', 'who even asked?', 'mwaiche please', 'just leave me',
  ],

  manipulation: [
    'always', 'never', 'you always', 'you never', 'typical', 'just like you',
    'should have known', 'knew it', 'told you so', 'you’re predictable',
    'you disappoint again', 'as usual', 'same old you', 'prove me wrong',
    'you don’t think', 'sounds like something you’d do',
    'you clearly don’t care', 'this is why people don’t like you',
    'be serious for once', 'i expected nothing else',

    // Local vibe
    'iwe as usual', 'you’re always like this', 'never changes',
    'no wonder', 'this is your thing', 'you can’t do anything right',
  ],

  blame: [
    'your fault', 'you did', 'you made me', 'because of you', 'you ruined',
    'blame you', 'you caused', 'you always do', 'you messed up',
    'you created this', 'you brought this on yourself', 'you started it',
    'you’re the reason', 'you provoked me', 'you forced me',
    'you let this happen', 'you failed again',

    // Local speech patterns
    'because of you iwe', 'iwe wakolopa',
    'niwe waponya', 'iwe ulechita', 'niwe wabipisha',
    'it’s on you', 'you’re the problem', 'you spoiled everything',
  ],
};
