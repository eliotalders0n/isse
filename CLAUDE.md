# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Isse" is a mobile-first relationship coaching app that transforms WhatsApp chat exports into an interactive, scroll-based story experience. The app uses warm, inviting colors and provides brief, insightful coaching guidance as users discover patterns in their conversations.

### Design Philosophy
- **Mobile-First**: Optimized for touch and small screens with responsive layouts
- **Relationship Coach**: Brief, warm insights rather than data-heavy analytics
- **Swipe-Based Navigation**: Card carousel with Framer Motion gestures
- **Warm Color Palette**: Coral, peach, and rose tones create an inviting atmosphere
- **Illustrated Personas**: Participant avatars using DiceBear API

## Development Commands

### Starting the Development Server
```bash
npm start
```
Runs the app in development mode at http://localhost:3000 with hot reloading.

### Running Tests
```bash
npm test
```
Launches the Jest test runner in interactive watch mode.

### Building for Production
```bash
npm run build
```
Creates an optimized production build in the `build/` directory.

### Deployment

The project is configured for Firebase Hosting (project: `babili-isse`):

```bash
npm run build
firebase deploy
```

Firebase configuration is in `firebase.json` with the build directory as the public folder.

**Firebase Configuration Files:**
- `.firebaserc` - Project configuration (default project: `babili-isse`)
- `firebase.json` - Hosting settings with SPA routing support

## Design System

### Color Palette (`src/theme.js`)
The app uses a custom Chakra UI theme with warm colors:
- **Warm (Primary)**: `#FF8556` - Coral orange, main accent color
- **Peach**: `#F97316` - Warm orange for secondary elements
- **Rose**: `#F43F5E` - Warm pink for emotional highlights
- **Sand**: Neutral grays for text and backgrounds

### Key Components

**ParticipantAvatar** (`src/components/ParticipantAvatar.jsx`)
- Generates illustrated character avatars using DiceBear API
- Consistent color assignment based on participant name
- Includes decorative glow effects and animations
- Sizes: sm, md, lg, xl

**CoachMessage** (`src/components/CoachMessage.jsx`)
- Displays coaching insights with scroll-triggered animations
- Types: insight, encouragement, observation
- Left-border colored cards with icons

**SwipeableCardDashboard** (`src/components/SwipeableCardDashboard.jsx`)
- Main dashboard with swipe/drag navigation
- Touch-friendly card carousel with progress indicator
- Conditional card rendering based on data availability
- 11-12 cards with optional personalized cards

### Background Images (`src/assets/`)
- `3746043.jpg` - Used for upload screen background
- `4105004.jpg` - Alternative background option
- `4955146.jpg` - Alternative background option

## Architecture Overview

### Core Data Flow

The application uses the **Semantic Engine** - a powerful 6-layer analysis pipeline orchestrated by the `useAnalysisOrchestrator` hook:

1. **File Upload** (`FileUpload.jsx`) → User uploads WhatsApp .txt, .json, .pdf, or .zip file
2. **Quick Parse** (`utils/whatsappParser.js`) → Extract messages and metadata
3. **Participation Question** (`ChatParticipationPrompt.jsx`) → Ask if user is in the chat
4. **Semantic Analysis** (`useAnalysisOrchestrator` hook) → 6-layer deep analysis:
   - **Layer 1: Canonical Transformation** - Normalize messages to standard format
   - **Layer 2: Lexical Analysis** - Intent detection (alignment, resistance, urgency, delegation, closure, uncertainty)
   - **Layer 3: Behavioral Profiling** - Response times, turn-taking, message bursts, silence patterns
   - **Layer 4: Conversation Segmentation** - Identify conversation phases and topic shifts
   - **Layer 5: Intent Evolution** - Track how communication intents change over time
   - **Layer 6: Narrative Synthesis** (optional) - AI-powered conversation summary via Groq
5. **Gamification & Analytics** → Relationship level, badges, milestones, health scores
6. **Personalization** (if user is participant) → User selects their identity
7. **Dashboard** (`SwipeableCardDashboard.jsx`) → Swipeable card carousel with insights

### Semantic Engine Architecture

**Location**: `/src/hooks/useAnalysisOrchestrator.js` (26KB)

**Key Features**:
- **Web Worker Processing**: Layers 2-5 run in background thread (`semanticAnalysisWorker.js`)
- **Deterministic Analysis**: Rule-based intent detection (no AI required for core analysis)
- **Progress Tracking**: Real-time updates via worker messages
- **Firestore Sync**: Automatic cloud backup for authenticated users
- **Type-Safe**: Comprehensive TypeScript-style type definitions in `/src/types/`

**Intent Categories** (Layer 2):
- **Alignment**: Agreement, collaboration, shared goals
- **Resistance**: Disagreement, pushback, conflict
- **Urgency**: Time-sensitive requests, deadlines
- **Delegation**: Task assignment, responsibility transfer
- **Closure**: Conclusion, resolution, wrap-up
- **Uncertainty**: Questions, confusion, ambiguity

**Behavioral Metrics** (Layer 3):
- Response latency categorization (instant, quick, delayed, ghost)
- Turn-taking patterns (balanced, dominant, passive)
- Message clustering (single vs. burst messaging)
- Silence profiling (comfortable vs. concerning gaps)

**Data Flow Through Layers**:
```
Raw Messages (parser)
  → Layer 1 (canonical)
  → Worker (Layers 2-5 parallel)
  → Sentiment mapping
  → Gamification
  → Dashboard
```

### State Management (`App.js`)

**Orchestrated by `useAnalysisOrchestrator` Hook:**
- `chatData`: Semantic analysis results (from hook)
- `parsedData`: Raw parsed messages (from hook)
- `isParticipant`: User participation status (from hook)
- `isProcessing`: Loading state (from hook)
- `processingStep`: Current analysis step (from hook)
- `processingProgress`: Percentage 0-100 (from hook)
- `handleFileProcessed`: File upload handler (from hook)
- `runFullAnalysis`: Triggers semantic pipeline (from hook)

**Local App States:**
- `selectedParticipant`: User's identity selection
- `processedData`: Temporary storage for participant selector
- `finalChatData`: Personalized data after participant selection

**Navigation Flow:**
```
Upload → Participation Prompt → [6-Layer Semantic Analysis] → Participant Selector (if applicable) → Dashboard
```

### File Format Support

**WhatsApp Parser** (`src/utils/whatsappParser.js`)

Supports multiple input formats:

| Format | Parser Function | Features |
|--------|-----------------|----------|
| **WhatsApp .txt** | `parseWhatsAppChat()` | Android/iOS format detection, system message filtering, multi-line support, auto date format detection (DMY/MDY) |
| **JSON** | `parseJSONChat()` | Babili Chrome extension format, handles metadata like "Message read by", generates timestamps if missing |
| **Gmail PDF** | `parseGmailPDF()` | Email conversation parsing, signature detection, quoted content filtering |
| **ZIP Archive** | `extractTextFromZip()` (in FileUpload.jsx) | Finds first .txt file, uses JSZip library |

**Message Data Structure:**
```javascript
{
  date: string,        // Localized date string
  time: string,        // Localized time string
  timestamp: Date,     // JavaScript Date object
  sender: string,      // Trimmed participant name
  text: string         // Message content (supports multi-line)
}
```

### Analytics Engine (`src/utils/analytics.js`)

Pure functions for statistical analysis:
- `calculateWordFrequency()` - Top N words (filters 70+ English stop words)
- `calculateWordFrequencyPerSender()` - Per-participant word analysis
- `findConversationStreaks()` - Consecutive messaging days
- `findSilencePeriods()` - Communication gaps (3+ days)
- `calculateResponseTimes()` - Message delay analysis
- `detectPeakHours()` - Most active time slots
- `calculateEngagementScore()` - Weekly/monthly engagement tracking
- `getStatsPerSender()` - Per-person: message count, characters, word count, averages

### Sentiment Analysis (`src/services/sentimentAnalysis.js`)

**Two-Stage Approach:**

1. **Fast Keyword-Based** (zero cost):
   - 8 emotion categories: joy, sadness, anger, affection, gratitude, apology, anxiety, excitement
   - Emoji detection
   - Toxicity detection using keyword matching
   - Outputs: positive/negative/neutral percentages

2. **AI Enhancement** (1 API call):
   - Google Gemini API with model fallback: `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-2.5-pro`
   - Generates conversation-level insights (97% API quota reduction from previous per-message approach)
   - **SECURITY NOTE**: API key exposed in client code (marked for backend migration)

**Key Exports:**
- `analyzeChatSentiment()` - Apply keyword analysis to all messages
- `getSentimentTimeline()` - Daily/weekly sentiment progression
- `generateRelationshipSummary()` - AI-powered conversation summary
- `calculateEmotionSynchrony()` - Emotional pattern alignment
- `detectConflictResolution()` - Tension detection & resolution
- `getAffectionLevel()` - Romantic/platonic intensity scoring
- `detectToxicity()` - Harmful content detection
- `generateAllCoachNotes()` - Unified AI coaching notes (1 API call)

### Gamification System (`src/utils/gamification.js`)

**Functions:**
- `calculateRelationshipLevel()` - 1-10 scale based on frequency, positivity, engagement, conflict resolution
- `calculateCompatibilityScore()` - Message style alignment
- `generateBadges()` - 20+ achievement badges defined in `badgeDefinitions.js`
- `detectMilestones()` - Relationship anniversary/achievement markers
- `calculateWeeklyHealthScores()` - Weekly relationship health progression
- `calculateStreakData()` - Consistent communication tracking

**Badge System** (`src/utils/badgeDefinitions.js`):
Achievements like "Love Letter", "Midnight Talker", "Perfect Balance", "Growing Stronger" with thresholds and rarity tiers.

### Personalization (`src/utils/personalizedAnalytics.js`)

When user is a participant in the chat:
- `getPersonalizedInsights()` - User-specific message patterns
- `getPersonalizedSentiment()` - User emotional contribution analysis
- `getCommunicationStyle()` - Communication personality typing
- `getPersonalizedCoachingInsights()` - Targeted advice

### Storage (`src/services/storageService.js`)

**Current Implementation:**
- localStorage with `isse_` prefix
- Chat ID generation from sorted participant names
- User profile management with historical tracking
- Gamification data persistence
- Storage size monitoring (4MB warning threshold)

**Future-Ready:**
- Firebase/Firestore integration structure prepared
- Service files: `firebase.js`, `firestoreService.js`, `indexedDBService.js`

## Dashboard Card Components

The dashboard presents insights as swipeable cards (`src/components/cards/`):

1. **IntroCard.jsx** - Relationship title with participant avatars
2. **StatsCard.jsx** - Key metrics (messages, days, per-day avg, mood)
3. **AboutYouCard.jsx** - Personalized user profile (conditional: if user is participant)
4. **CoachingInsightsCard.jsx** - AI coaching tips (conditional: if AI insights available)
5. **AIInsightsCard.jsx** - Advanced AI insights (conditional: if AI insights available)
6. **BalanceCard.jsx** - Message distribution analysis
7. **EmotionsCard.jsx** - Sentiment breakdown with top emotions chart
8. **WordsCard.jsx** - Most frequent words visualization
9. **PatternsCard.jsx** - Communication patterns & streaks
10. **HealthCard.jsx** - Overall relationship health score with badge
11. **MilestonesCard.jsx** - Achievements (conditional: if milestones exist)
12. **ShareCard.jsx** - Share results & export options

**Conditional Rendering:**
SwipeableCardDashboard filters cards using `shouldShow()` predicates based on data availability and user participation status.

## Group Chat Support (Recent Major Update)

**Commit 66d2ad4** introduced comprehensive group chat functionality:

### Detection
- 3+ participants = group chat
- 2 participants = 1-on-1 chat

### Components
- **ChatParticipationPrompt.jsx**: Binary question ("Are you in this chat?")
- **ParticipantSelector.jsx**: Card-based selector for user identification

### Modified Components
- **IntroCard**: Grid layout for multiple avatars
- **BalanceCard**: Multi-participant message distribution
- **AboutYouCard**: Only shows if user selected themselves

## Recent Architectural Changes

**Latest Features (Dec 2025):**

1. **Multi-Format Upload** (commits c106ba2, cc522ad):
   - ZIP extraction with JSZip
   - JSON parsing for Babili Chrome extension
   - Gmail PDF parsing with pdf.js
   - File type detection and routing

2. **Enhanced Semantic Keywords** (commit cc522ad):
   - Major additions to `sentimentKeywords.js` (535 new lines)
   - Zambian/African language pattern detection
   - Better nuanced emotion matching

3. **AI Optimization**:
   - 97% API quota reduction (30+ calls → 1 call)
   - Conversation-level insights instead of per-message
   - Model fallback system for reliability

## UI/UX Framework Stack

**Core:**
- **React 19.1.1** - Latest with concurrent features
- **Chakra UI 2.10.9** - Component library with custom theme
- **Framer Motion 12.23.12** - Scroll & gesture animations
- **TailwindCSS 4.1.17** - Utility-first styling (dev dependency)

**Visualization:**
- **Recharts 3.5.1** - Primary charting library
- **Chart.js 4.5.1** + **react-chartjs-2** - Alternative charts

**File Handling:**
- **JSZip 3.10.1** - ZIP extraction
- **pdf.js-dist 5.4.449** - PDF text extraction
- **html2canvas 1.4.1** - Screenshot/export functionality

**Utilities:**
- **date-fns 4.1.0** - Date manipulation
- **react-icons 5.5.0** - Icon library
- **uuid 13.0.0** - ID generation
- **@google/generative-ai 0.24.1** - Gemini API client
- **@microsoft/clarity 1.0.2** - Analytics integration

## Key Architectural Patterns

### Multi-Stage Processing
- Quick parse → Heavy analysis → Personalization
- Prevents UI blocking with progress tracking
- Toast notifications at each stage

### Conditional Rendering
- Dashboard filters cards based on data availability
- Personalizes experience based on participation status
- Shows/hides AI-dependent cards gracefully

### Pure Utility Functions
- Analytics and gamification are pure functions
- No side effects, easily testable
- Reusable across components

### Keyword-First, AI-Enhanced
- Fast offline keyword analysis for all messages
- Targeted AI calls for conversation-level insights
- Hybrid approach balances speed, cost, and depth

### Chat ID Generation
- Consistent ID from sorted participant names
- Enables historical tracking and profile management

## Important Notes for Development

### Security Considerations
- **Gemini API key exposed in client code** (`sentimentAnalysis.js`)
- Marked for backend migration in comments
- Consider environment variables or backend proxy for production

### No Complex State Management
- Pure React hooks, no Redux/Zustand/Context
- Simpler onboarding for new developers
- Sufficient for current app complexity

### localStorage First
- Current: localStorage with `isse_` prefix
- Planned: Firestore migration (services prepared)
- No real-time sync currently

### Mobile-First Design
- Touch-friendly swipe navigation
- Desktop fallback with arrow buttons
- Responsive breakpoints throughout

### Single-File Upload
- Each upload creates separate analysis session
- Data persisted per chat ID
- No multi-file batch processing

## Babili Chat Extractor (Chrome Extension)

Located in `babili-chat-extractor/` directory. Companion Chrome extension for extracting chats from:
- Google Chat / Gmail Chat
- WhatsApp Web
- Other messaging platforms (experimental)

Exports JSON format compatible with `parseJSONChat()` in the main app. See `babili-chat-extractor/README.md` for details.

## Working with the Semantic Engine

### Adding New Intent Categories

To add a new intent type to Layer 2:

1. **Update Intent Keywords** (`src/services/intentKeywords.js`):
   - Add keyword patterns to `INTENT_KEYWORDS` object
   - Define scoring weights in `KEYWORD_CONFIG`

2. **Update Type Definitions** (`src/types/lexical.js`):
   - Add new intent field to `IntentVector` type
   - Update `getZeroIntentVector()` to include new intent

3. **Update Lexical Analyzer** (`src/services/lexicalAnalyzer.js`):
   - Extend `analyzeLexical()` to detect new intent
   - Add normalization logic if needed

4. **Update Sentiment Mapping** (`src/services/sentimentCompatibility.js`):
   - Map new intent to sentiment/emotion for dashboard display

### Performance Optimization

**Web Worker Benefits:**
- Layers 2-5 run in parallel without blocking UI
- Progress updates keep user informed
- Timeout protection (180s / 3 minutes max)
- Performance logging for each layer

**Current Processing Times**:
- **Small chats (500-1000 messages)**: 5-15 seconds total
  - Layer 1 (Canonical): ~100ms
  - Layers 2-5 (Worker): ~2-5 seconds
  - Layer 6 (Narrative): ~3-10 seconds (optional, AI-powered)
- **Medium chats (1000-5000 messages)**: 15-60 seconds total
- **Large chats (5000-10000 messages)**: 60-180 seconds total
- **Worker Timeout**: 3 minutes (180 seconds)

**Performance Tips for Large Files**:
- Files with 10,000+ messages may timeout
- Consider splitting very large chats into smaller date ranges
- Worker logs timing for each layer to identify bottlenecks
- Check browser console for `[Worker] Layer X complete in Xs` logs

### Debugging the Semantic Engine

**Console Output:**
The orchestrator logs each layer's progress:
```javascript
console.log('🧠 NEW: Running deterministic semantic analysis (Layers 1-3)...');
console.log('✅ Transformed N messages to canonical format');
console.log('✅ Semantic analysis complete: ...');
```

**Worker Messages:**
Check browser DevTools for worker communications:
- `[Worker] Starting Layer 2: Lexical analysis`
- `[Worker] Layer 3 complete, starting Layer 4: Segmentation`

**Data Inspection:**
Final `chatData` object includes:
- `messages`: Array with `.lexical` and `.behavioral` properties
- `segments`: Conversation phases
- `evolution`: Intent changes over time
- `sentiment`: Derived from intents
- `gamification`: All achievements

## Coaching Tone Guidelines

When modifying coach messages or insights:
- **Brief and Insightful**: 1-2 sentences maximum
- **Warm and Encouraging**: Positive, supportive language
- **Data-Informed**: Based on actual metrics, not generic advice
- **Non-Judgmental**: Focus on patterns, not criticism
- **Actionable**: Where possible, suggest constructive next steps

## File Structure Reference

**Hooks** (`src/hooks/`):
- `useAnalysisOrchestrator.js` (26.4KB) - **MAIN ORCHESTRATOR** - Controls entire analysis pipeline
- `useAiInsights.js` (2.4KB) - Manages AI insights fetching with caching

**Type Definitions** (`src/types/`):
- `index.js` - Central export for all type definitions
- `canonical.js` (5.6KB) - Layer 1 types (CanonicalMessage, MessageMetadata)
- `lexical.js` (9.4KB) - Layer 2 types (IntentVector, LexicalAnalysis)
- `behavioral.js` (11.2KB) - Layer 3 types (BehavioralProfile, ResponseDynamics)
- `segmentation.js` (14.2KB) - Layer 4 & 5 types (ConversationSegment, IntentEvolution)
- `narrative.js` (10.5KB) - Layer 6 types (NarrativeSynthesis, CoachingInsights)

**Workers** (`src/workers/`):
- `semanticAnalysisWorker.js` - Web Worker for parallel processing of Layers 2-5

**Critical Files for Modifications:**
1. `src/hooks/useAnalysisOrchestrator.js` (26.4KB) - **MAIN ENTRY POINT** - Orchestrates all analysis
2. `src/App.js` - UI flow and personalization logic
3. `src/utils/whatsappParser.js` (19.4KB) - File format parsing
4. `src/services/lexicalAnalyzer.js` (14.8KB) - Layer 2: Intent detection
5. `src/services/behavioralAnalyzer.js` (13.4KB) - Layer 3: Behavioral analysis
6. `src/components/cards/*.jsx` - Visual presentation of insights
7. `src/utils/gamification.js` (16.4KB) - Gamification logic

**Service Layer** (`src/services/` - 23 files, ~10,000 LOC):
- **Semantic Engine Core**:
  - `canonicalTransformer.js` - Layer 1: Message normalization
  - `lexicalAnalyzer.js` (14.8KB) - Layer 2: Intent detection with keyword matching
  - `behavioralAnalyzer.js` (13.4KB) - Layer 3: Behavioral profiling
  - `conversationSegmenter.js` (17.6KB) - Layer 4: Topic segmentation
  - `intentEvolutionEngine.js` (13.1KB) - Layer 5: Intent tracking over time
  - `narrativeSynthesis.js` (12.5KB) - Layer 6: AI summary generation (Groq)
- **Supporting Services**:
  - `intentKeywords.js` (17.1KB) - Intent detection keyword library
  - `semanticWordAnalyzer.js` (7.1KB) - Semantic word frequency analysis
  - `sentimentCompatibility.js` (8.2KB) - Intent-to-sentiment mapping
  - `dictionaryService.js` (12.2KB) - Word normalization and cultural variants
- **Legacy Services** (still used for gamification):
  - `sentimentAnalysis.js` (60.6KB) - Old AI-based sentiment (deprecated for core analysis)
  - `sentimentKeywords.js` (45.2KB) - Emotion keyword database
- **Infrastructure**:
  - `storageService.js` (16.3KB) - localStorage management
  - `firebase.js`, `firestoreService.js`, `indexedDBService.js` - Cloud sync
