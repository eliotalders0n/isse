# Babili Chat Extractor

A Chrome extension that extracts chat messages from WhatsApp Web, Google Chat, Gmail Chat, and other messaging platforms for use with the Babili relationship coaching app.

## Features

- **Multi-Platform Support**: WhatsApp Web, Google Chat, Gmail Chat, and more
- **JSON Export**: Download extracted chats as JSON files
- **Direct Upload**: Send chats directly to Babili API
- **Smart Extraction**: Filters out UI elements and system messages
- **Warm Branding**: Beautiful coral/peach gradient design matching Isse app

## Installation

1. Download or clone this extension folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `babili-chat-extractor` folder
6. The extension icon should appear in your toolbar

## Usage

### Quick Start

1. Open a chat platform (e.g., Google Chat or WhatsApp Web)
2. Open a conversation
3. Click the Babili Chat Extractor icon in your toolbar
4. Click **"Extract Chat"**
5. Choose to either:
   - **Export JSON**: Download as a file
   - **Upload to Babili**: Send directly to the API

### Supported Platforms

#### ✅ Google Chat / Gmail Chat
- Extracts sender names, message text, and timestamps
- Filters out UI elements and promotional messages
- Works with both chat.google.com and mail.google.com/chat

#### ✅ WhatsApp Web
- Full message extraction with sender identification
- Supports multi-line messages
- Timestamp extraction

#### 🔄 Other Platforms (Experimental)
- Facebook Messenger
- Telegram Web
- Generic chat platforms

## How It Works

1. **Injection**: The extension injects a content script into the chat page
2. **Container Detection**: Finds the main chat message container using multiple strategies
3. **Message Extraction**: Identifies individual messages using platform-specific selectors
4. **Data Parsing**: Extracts sender, text, and timestamp from each message
5. **Output**: Returns structured JSON with metadata

## Output Format

```json
{
  "exportedAt": "2025-12-01T15:26:08.981Z",
  "messageCount": 8,
  "messages": [
    {
      "id": "m1",
      "sender": "Sandra Masiwa",
      "text": "I love you",
      "timestamp": "Yesterday 21:23",
      "rawHtml": "..."
    },
    {
      "id": "m2",
      "sender": "You",
      "text": "goodnight",
      "timestamp": "36 min",
      "rawHtml": "..."
    }
  ]
}
```

## Troubleshooting

### Not extracting messages?

1. **Check the console**: Press F12 and look for `[Babili]` logs (see [DEBUG.md](DEBUG.md))
2. **Reload the chat**: Try refreshing the page and reopening the conversation
3. **Scroll up**: Some platforms lazy-load messages - scroll up to load history
4. **Check permissions**: Make sure the extension has access to the site

### Getting 0 messages?

- **Google Chat**: Make sure you're on `mail.google.com/chat` or `chat.google.com` with a conversation open
- **WhatsApp**: Open `web.whatsapp.com` and select a chat
- See [DEBUG.md](DEBUG.md) for detailed debugging steps

### Extraction is slow?

- The extension auto-scrolls to load all messages
- This can take 10-30 seconds for long conversations
- Status will show "Extracting messages..." during this time

## Development

### File Structure

```
babili-chat-extractor/
├── manifest.json        # Extension configuration
├── popup.html           # Extension popup UI
├── popup.js             # Popup interaction logic
├── popup.css            # Warm Isse branding styles
├── content.js           # Main extraction logic (injected into pages)
├── service_worker.js    # Background service worker
├── icons/               # Extension icons (16x16, 48x48, 128x128)
├── README.md            # This file
├── DEBUG.md             # Debugging guide
└── TESTING.md           # Testing instructions
```

### Key Functions in content.js

- `findScrollContainer()`: Detects the chat container
- `findMessageNodes()`: Finds all message elements
- `extractSender()`: Extracts sender name from message
- `extractTextFromNode()`: Extracts message text
- `parseTimestampFromNode()`: Extracts timestamp
- `extractMessages()`: Main extraction orchestrator

### Adding Support for New Platforms

1. Add platform detection in `detectPlatform()`
2. Add container selector in `findScrollContainer()`
3. Add message selectors in `findMessageNodes()`
4. Test extraction and adjust text/sender/timestamp extraction as needed

## Privacy & Security

- **Local Processing**: All extraction happens locally in your browser
- **No Data Stored**: Extension doesn't store messages (unless you use Chrome storage API)
- **Manual Upload**: Only uploads when you explicitly click "Upload to Babili"
- **No Analytics**: No tracking or analytics

## Icons

The extension includes placeholder icon files. To customize:

1. Create icons at 16x16, 48x48, and 128x128 pixels
2. Replace `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`
3. Use warm coral/orange colors to match the Isse brand (#FF8556, #F97316)

## License

Part of the Babili/Isse relationship coaching platform.

## Support

For issues or questions:
- Check [DEBUG.md](DEBUG.md) for troubleshooting
- Check [TESTING.md](TESTING.md) for testing procedures
- Check browser console for `[Babili]` logs

---

**Built with warm colors for the Isse relationship coaching app** 🧡
