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
    '😊', '😄', '😁', '❤️', '💕', '💖', '😍', '🥰', '😘', '🎉', '🎊', '👏',
  ],
  sadness: [
    'sad', 'sorry', 'miss', 'missed', 'cry', 'crying', 'hurt', 'pain',
    'lost', 'alone', 'lonely', 'depressed', 'upset', 'disappointed', 'terrible',
    'awful', 'worst', 'sucks', 'unfortunate', 'regret', 'wish', 'heartbroken',
    'miserable', 'down', 'blue', 'gloomy', 'melancholy', 'grief', 'sorrow',
    '😢', '😭', '😔', '☹️', '😞', '💔',
  ],
  anger: [
    'angry', 'mad', 'hate', 'annoyed', 'annoying', 'frustrated', 'stupid',
    'idiot', 'damn', 'wtf', 'ridiculous', 'unacceptable', 'disgusting',
    'furious', 'pissed', 'irritated', 'sick of', 'fed up', 'outraged',
    'infuriated', 'livid', 'enraged', 'hostile', 'resentful', 'bitter',
    '😠', '😡', '🤬',
  ],
  affection: [
    'love you', 'miss you', 'thinking of you', 'care about', 'adore',
    'sweetheart', 'darling', 'honey', 'baby', 'babe', 'dear', 'treasure',
    'precious', 'forever', 'always', 'kiss', 'hug', 'cuddle', 'embrace',
    'cherish', 'devoted', 'fond of', 'attached', 'intimate', 'tender',
    '💑', '💏', '👫', '🫂', '😘', '😻', '💝',
  ],
  gratitude: [
    'thank you', 'thanks', 'appreciate', 'grateful', 'thankful', 'blessing',
    'blessed', 'lucky', 'fortunate', 'kind', 'kindness', 'helpful',
    'support', 'thank god', 'indebted', 'obliged', 'recognition', '🙏',
  ],
  apology: [
    'sorry', 'apologize', 'apology', 'my bad', 'forgive', 'mistake',
    'my fault', 'regret', 'didnt mean', "didn't mean", 'pardon', 'excuse me',
    'remorseful', 'ashamed', 'guilty',
  ],
  anxiety: [
    'worried', 'worry', 'nervous', 'anxious', 'stress', 'stressed',
    'overwhelmed', 'scared', 'afraid', 'fear', 'concern', 'concerned',
    'panic', 'tense', 'uneasy', 'apprehensive', 'troubled', 'insecure',
    '😰', '😨', '😱',
  ],
  excitement: [
    'excited', 'cant wait', "can't wait", 'looking forward', 'thrilled',
    'pumped', 'hyped', 'omg', 'wow', 'amazing news', 'incredible',
    'enthusiastic', 'eager', 'anticipating', 'stoked', '🤩', '😃',
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
  ],

  // Professional/Work context
  professional: [
    'work', 'job', 'career', 'office', 'boss', 'manager', 'colleague',
    'coworker', 'employee', 'employer', 'interview', 'promotion', 'raise',
    'salary', 'benefits', 'performance', 'evaluation', 'feedback',
    'assignment', 'task', 'responsibility', 'accountability', 'professional',
    'networking', 'conference', 'workshop', 'training', 'development',
  ],

  // Project management context
  project: [
    'milestone', 'deliverable', 'sprint', 'agile', 'scrum', 'kanban',
    'roadmap', 'timeline', 'schedule', 'task', 'backlog', 'priority',
    'blocker', 'dependency', 'resource', 'allocation', 'scope', 'requirement',
    'specification', 'launch', 'deployment', 'testing', 'qa', 'bug',
    'feature', 'enhancement', 'iteration', 'release', 'version',
  ],

  // Romantic relationship context
  love: [
    'date', 'dating', 'boyfriend', 'girlfriend', 'partner', 'relationship',
    'romance', 'romantic', 'marriage', 'married', 'wedding', 'engagement',
    'engaged', 'anniversary', 'valentine', 'love', 'passion', 'intimacy',
    'commitment', 'devoted', 'soulmate', 'together', 'couple', 'us',
    'future together', 'moving in', 'propose', 'proposal',
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
  ],

  // Conflict/Hostile context
  conflict: [
    'argue', 'argument', 'fight', 'fighting', 'disagree', 'disagreement',
    'conflict', 'tension', 'hostile', 'confrontation', 'dispute', 'quarrel',
    'clash', 'debate', 'opposition', 'against', 'versus', 'vs',
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
  ],
};

// Communication styles and intents
export const communicationPatterns = {
  // Assertive (healthy direct communication)
  assertive: [
    'i think', 'i feel', 'i believe', 'my opinion', 'my perspective',
    'i would like', 'i prefer', 'id appreciate', "i'd appreciate",
    'lets discuss', "let's discuss", 'can we talk', 'id like to understand',
  ],

  // Passive-aggressive
  passiveAggressive: [
    'fine', 'whatever', 'if you say so', 'sure', 'i guess', 'nevermind',
    'nothing', 'its fine', "it's fine", 'dont worry', "don't worry",
    'no worries', 'im fine', "i'm fine", 'forget it', 'nothing wrong',
  ],

  // Defensive
  defensive: [
    'but i', 'but you', 'thats not fair', "that's not fair", 'you always',
    'you never', 'why do you', 'stop blaming', 'not my fault',
    'you started', 'what about you', 'and you', 'at least i',
  ],

  // Supportive
  supportive: [
    'im here', "i'm here", 'you can', 'you got this', 'believe in you',
    'proud of you', 'well done', 'good job', 'youre amazing', "you're amazing",
    'youre doing great', 'keep going', 'dont give up', "don't give up",
  ],

  // Planning/Future-oriented
  planning: [
    'lets plan', "let's plan", 'we should', 'we could', 'how about',
    'what if', 'planning', 'schedule', 'arrange', 'organize',
    'future', 'next', 'soon', 'later', 'eventually', 'tomorrow',
  ],

  // Question/Inquiry
  questioning: [
    'what', 'when', 'where', 'why', 'how', 'who', 'which',
    '?', 'wondering', 'curious', 'question', 'asking',
  ],

  // Affirmation/Agreement
  agreeing: [
    'yes', 'yeah', 'yep', 'sure', 'absolutely', 'definitely', 'exactly',
    'agreed', 'i agree', 'makes sense', 'sounds good', 'perfect',
    'right', 'correct', 'true', 'indeed', 'of course',
  ],

  // Disagreement
  disagreeing: [
    'no', 'nope', 'nah', 'disagree', 'dont think so', "don't think so",
    'not sure', 'maybe not', 'i dont think', "i don't think",
    'actually', 'but', 'however', 'although', 'on the other hand',
  ],
};

// Toxicity detection keywords
export const toxicityKeywords = {
  insults: [
    'idiot', 'stupid', 'dumb', 'moron', 'loser', 'pathetic', 'worthless',
    'useless', 'incompetent', 'failure', 'trash', 'garbage', 'disgusting',
  ],
  aggression: [
    'hate you', 'hate this', 'shut up', 'leave me alone', 'go away',
    'kill', 'die', 'dead', 'hurt you', 'destroy', 'ruin', 'screw you',
  ],
  dismissive: [
    'whatever', 'don\'t care', 'dont care', 'who cares', 'so what',
    'your problem', 'not my problem', 'deal with it', 'get over it',
  ],
  manipulation: [
    'always', 'never', 'you always', 'you never', 'typical', 'just like you',
    'should have known', 'knew it', 'told you so',
  ],
  blame: [
    'your fault', 'you did', 'you made me', 'because of you', 'you ruined',
    'blame you', 'you caused', 'you always do',
  ],
};
