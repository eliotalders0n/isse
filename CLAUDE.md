# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Isse" is a mobile-first relationship coaching app that transforms WhatsApp chat exports into an interactive, scroll-based story experience. The app uses warm, inviting colors and provides brief, insightful coaching guidance as users discover patterns in their conversations.

### Design Philosophy
- **Mobile-First**: Optimized for touch and small screens with responsive layouts
- **Relationship Coach**: Brief, warm insights rather than data-heavy analytics
- **Scroll-Based Story**: Progressive reveal with scroll-triggered animations
- **Warm Color Palette**: Coral, peach, and rose tones create an inviting atmosphere
- **Illustrated Personas**: Participant avatars using illustrated character designs

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
- Appears with slide-in animation on scroll

**StoryDashboard** (`src/components/StoryDashboard.jsx`)
- Main visualization replacing the old tab-based Dashboard
- Scroll-based story with 6 progressive sections
- Scroll-triggered animations using Framer Motion
- Mobile-optimized with responsive breakpoints

### Background Images (`src/assets/`)
- `3746043.jpg` - Used for upload screen background
- `4105004.jpg` - Alternative background option
- `4955146.jpg` - Alternative background option

## Architecture Overview

### Core Data Flow

The application follows a single-direction data flow pattern:

1. **File Upload** (`FileUpload.jsx`) → User uploads WhatsApp .txt export
2. **Parsing** (`utils/whatsappParser.js`) → Raw text parsed into structured message objects
3. **Analysis** → Multiple analysis modules process the parsed data:
   - `utils/analytics.js` - Word frequency, conversation streaks, response times, peak hours
   - `services/sentimentAnalysis.js` - Emotion detection and sentiment scoring
4. **Story Visualization** (`StoryDashboard.jsx`) → Results displayed as scroll-based narrative

### Story Sections

The StoryDashboard presents insights in 6 progressive sections:

1. **Introduction** - Participant avatars and relationship title
2. **At a Glance** - Key metrics (messages, days, mood) with coach insight
3. **Who Says What** - Message distribution with balance analysis
4. **Emotional Landscape** - Sentiment breakdown and emotion charts
5. **Communication Health** - Streak data, peak times, health metrics
6. **Summary** - Encouraging closing message

### Key Modules

**WhatsApp Parser** (`src/utils/whatsappParser.js`)
- Handles both Android and iOS export formats using regex pattern matching
- Supports multi-line messages
- Exports: `parseWhatsAppChat()`, `groupMessagesByDate()`, `getMessagesPerDay()`, `getStatsPerSender()`

**Analytics** (`src/utils/analytics.js`)
- Pure functions for statistical analysis
- Filters common stop words (50+ English stop words)
- Key exports: `calculateWordFrequency()`, `findConversationStreaks()`, `findSilencePeriods()`, `calculateResponseTimes()`, `detectPeakHours()`, `calculateEngagementScore()`

**Sentiment Analysis** (`src/services/sentimentAnalysis.js`)
- Keyword-based emotion detection (8 emotion categories: joy, sadness, anger, affection, gratitude, apology, anxiety, excitement)
- Includes emoji detection
- Exports: `analyzeSentiment()`, `analyzeChatSentiment()`, `getSentimentTimeline()`, `generateRelationshipSummary()`
- Note: Currently uses basic keyword matching; production integration with OpenAI/Hugging Face APIs is planned

**Component Structure**
- `FileUpload.jsx` - Drag-and-drop file upload with progress indicator and animated interactions
- `Dashboard.jsx` - Main container with Chakra UI Tabs component managing 6 fully implemented tabs
- `components/tabs/` - 6 complete tab components (OverviewTab, TimelineTab, EmotionsTab, WordsTab, PatternsTab, SummaryTab)
- Each tab component receives `stats`, `metadata`, and `analytics` props from the parent Dashboard

### Message Data Structure

After parsing, each message object contains:
```javascript
{
  date: string,        // Original date string from export
  time: string,        // Original time string from export
  timestamp: Date,     // Parsed JavaScript Date object
  sender: string,      // Sender name (trimmed)
  text: string         // Message content (supports multi-line)
}
```

### UI Framework & Dependencies

**Core UI Library**: Chakra UI v2.10.9
- Theme: Custom warm color palette (see `src/theme.js`)
- Colors: Warm coral (`warm.500`), peach, rose, and sand neutrals
- Layout: Mobile-first with `Container maxW="container.md"`
- Components: Card, Stat, Badge, Progress, VStack, HStack
- Typography: Bold headings, warm gradient backgrounds

**Data Visualization**:
- `recharts` v3.5.1 - Primary charting library
- `chart.js` v4.5.1 + `react-chartjs-2` v5.3.0 - Alternative chart options

**Animation Libraries**:
- `framer-motion` v12.23.12 - Core animation framework
- `gsap` v3.13.0 - Timeline-based animations
- `liquid-glass-react` v1.1.1 - Glass morphism effects

**Utility Libraries**:
- `date-fns` v4.1.0 - Date manipulation and formatting
- `qrcode` v1.5.4 - QR code generation (likely for sharing features)
- `html2canvas` v1.4.1 - Screenshot/export functionality
- `react-icons` v5.5.0 - Icon library

**Framework**:
- React v19.1.1 (latest)
- React DOM v19.1.1

**Styling**:
- Tailwind CSS v4.1.17 (dev dependency)
- Emotion (for Chakra UI styling)

**Deployment**:
- Firebase v12.5.0 - Hosting and backend services
- Firebase Tools v14.24.1 - CLI for deployment

### Date Handling

Uses `date-fns` library for date operations. The parser handles:
- 2-digit years (auto-converts to 2000s)
- 12/24 hour time formats with AM/PM
- Multi-format date parsing (M/D/YY and M/D/YYYY)

## Animations & Interactivity

The app uses Framer Motion for scroll-based story animations:

**Animation Libraries:**
- `framer-motion` v12.23.12 - Core animation framework
- `gsap` v3.13.0 - Timeline animations (legacy)
- `html2canvas` v1.4.1 - Screenshot and export functionality

**Scroll-Based Animation Patterns:**
- **whileInView**: Sections animate as user scrolls into view
- **viewport**: `{ once: true, margin: '-100px' }` triggers animation before element is fully visible
- **Progressive Reveal**: Each story section fades and slides in on scroll
- **Card Animations**: Stats cards stagger in with scale and y-translation
- **Avatar Animations**: Scale and fade-in with sequential delays
- **Coach Messages**: Slide in from left with optional delay

**Key Animation Implementations:**
- **FileUpload**: Floating upload icon, warm color hover states
- **StoryDashboard**: Scroll-triggered section reveals, card staggers
- **ParticipantAvatar**: Hover scale effects with decorative glow
- **CoachMessage**: Slide-in animations triggered by scroll position
- **App.js**: Page transition between upload and story dashboard

**Mobile-First Principles:**
- Touch-friendly interaction areas
- Reduced motion on mobile for performance
- Responsive font sizes and spacing
- Bottom-safe-area padding for mobile browsers

## Testing Notes

- Test framework: React Testing Library + Jest
- Setup file: `src/setupTests.js`
- Test utilities from `@testing-library/react` and `@testing-library/user-event`

## Story Dashboard Sections

The StoryDashboard presents relationship insights as a scroll-based narrative:

1. **Introduction Section**
   - Large illustrated avatars for both participants
   - Relationship title with participant names
   - Welcoming message about exploring connection patterns
   - Scroll-triggered avatar animations with stagger effect

2. **At a Glance Section**
   - 4 key metric cards: Messages, Days, Per Day, Mood
   - Animated card reveals with hover lift effects
   - Coach insight based on conversation frequency
   - Warm color gradients on stat cards

3. **Who Says What Section**
   - Message distribution with progress bars
   - Participant avatars next to their percentages
   - Balance analysis coach message
   - Insights on conversation equity

4. **Emotional Landscape Section**
   - Sentiment breakdown (Positive/Neutral/Negative percentages)
   - Top 5 emotions bar chart using Recharts
   - Coach message about emotional tone
   - Warm color scheme for positive emphasis

5. **Communication Health Section**
   - Overall health badge (healthy/moderate/needs attention)
   - Longest conversation streak display
   - Peak activity hours badges
   - Encouraging coach message

6. **Summary Section**
   - Warm gradient card with participant names
   - Encouraging closing message
   - Call to continue growing the relationship
   - Final motivational coach insight

### Coaching Tone
- **Brief and Insightful**: Short observations (1-2 sentences)
- **Warm and Encouraging**: Positive, supportive language
- **Data-Informed**: Insights based on actual metrics
- **Non-Judgmental**: Focuses on patterns, not criticism
