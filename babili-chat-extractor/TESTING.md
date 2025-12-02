# Testing Babili Chat Extractor

## Installation

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `babili-chat-extractor` folder
5. The extension should now appear in your extensions list

## Testing on Google Chat

### Setup
1. Open [Google Chat](https://mail.google.com/chat) or [Gmail Chat](https://mail.google.com) in a new tab
2. Open a conversation with someone 
3. Let the chat fully load

### Extract Messages
1. Click the Babili Chat Extractor extension icon in your toolbar
2. Click **"Extract Chat"** button
3. Wait for the extraction to complete (you'll see "Extracting messages..." status)

### Expected Results
You should see:
- **Success message**: "Extracted X messages successfully" (where X > 0)
- **Preview pane**: Shows metadata and sample messages
- **Enabled buttons**: "Export JSON" and "Upload to Babili" buttons become clickable

### Example Output
```json
{
  "metadata": {
    "url": "https://mail.google.com/chat/u/0/#chat/dm/...",
    "title": "Sandra Masiwa - Chat",
    "extractedAt": "2025-12-01T...",
    "platform": "Gmail Chat"
  },
  "messageCount": 8,
  "firstMessage": {
    "id": "m1",
    "sender": "Sandra Masiwa",
    "text": "Yeah's",
    "timestamp": "Yesterday 21:23"
  },
  "lastMessage": {
    "id": "m8",
    "sender": "You",
    "text": "afraid?",
    "timestamp": "Yesterday 21:25"
  }
}
```

## Testing on WhatsApp Web

1. Open [WhatsApp Web](https://web.whatsapp.com)
2. Scan QR code and open a chat
3. Click the extension icon
4. Click **"Extract Chat"**
5. Messages should be extracted with sender names and timestamps

## Export Options

### Export as JSON
1. After successful extraction, click **"Export JSON"**
2. Choose save location
3. File will be saved as `babili-chat-TIMESTAMP.json`

### Upload to Babili
1. Verify the upload URL (default: `https://babili-isse.web.app/api/upload`)
2. Click **"Upload to Babili"**
3. Wait for upload confirmation

## Troubleshooting

### No messages extracted
- Make sure a chat conversation is fully loaded and visible
- Try scrolling up to load older messages
- Check browser console (F12) for error messages

### Wrong messages extracted (loading screens, etc.)
- The new update filters out common UI elements like:
  - "Try reloading the page"
  - "Break free from browser tabs"
  - "Learn more about the app"
  - Google Workspace branding

### Timestamps not showing
- Some platforms may not expose timestamps in accessible format
- The extension will attempt multiple extraction methods
- If null, timestamp extraction wasn't possible for that message

## Platform-Specific Notes

### Google Chat
- Messages are identified by `data-message-id` attributes
- Sender names extracted from `aria-label` attributes
- Timestamps extracted from "Message from X at Y" patterns
- Filters out promotional and loading messages

### WhatsApp Web
- Uses `data-testid="msg-container"` selectors
- Extracts from `.copyable-text` elements
- Supports multi-line messages
- Identifies sender from `data-testid="message-author"`

## Need Help?

If extraction isn't working:
1. Open browser console (F12)
2. Look for console warnings/errors
3. Check that the page has fully loaded
4. Try refreshing the chat and re-extracting
