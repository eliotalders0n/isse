# Debugging Google Chat Extraction

The extension now includes comprehensive console logging to help diagnose extraction issues.

## How to Debug

### 1. Open Browser Console

1. Open Google Chat in Chrome: `https://mail.google.com/chat`
2. Open a conversation
3. Press **F12** or **Ctrl+Shift+I** (Windows) / **Cmd+Option+I** (Mac) to open DevTools
4. Click on the **Console** tab

### 2. Run the Extraction

1. Click the **Babili Chat Extractor** extension icon
2. Click **"Extract Chat"** button
3. Watch the console output

### 3. What to Look For

The console will show detailed logs like:

```
[Babili] Found container using: role=list <div...>
[Babili] Found message nodes: 8
[Babili] Trying selector "div[data-message-id]:not([data-message-id=""])": found 0
[Babili] Trying selector "div[jslog*="message"]": found 8
[Babili] After filtering: 8 valid messages
[Babili] Node 1 - raw text: "I love you"
[Babili] Node 1 - sender: "Sandra Masiwa"
[Babili] ✓ Extracted message 1: "I love you" from Sandra Masiwa
```

### 4. Common Issues and Solutions

#### Issue: "Found message nodes: 0"

**Problem:** No message elements were found in the container.

**Solutions:**
- Make sure the chat is fully loaded (scroll up to load history)
- Check if you're on the correct page (should be mail.google.com/chat or chat.google.com)
- The selector might not match the current Google Chat DOM structure

**Debugging:**
Look for this log line:
```
[Babili] No messages found with any selector strategy
```

Then check what selectors were tried:
```
[Babili] Trying selector "...": found X
```

#### Issue: "Extracted 0 messages successfully"

**Problem:** Messages were found but not extracted (filtered out or extraction failed).

**Solutions:**
- Check the "raw text" logs to see what text was extracted
- Look for "Skipping node X" messages to see why messages were filtered

**Example logs:**
```
[Babili] Node 1 - raw text: "Try reloading the page"
[Babili] Skipping node 1 - no text
```

#### Issue: Wrong container found

**Problem:** The scroll container detection picked the wrong element.

**Solutions:**
Look for:
```
[Babili] Found container using: <name> <element>
```

If it's using the wrong container (e.g., "Using document.body as fallback"), the selectors need updating.

### 5. Manual DOM Inspection

If extraction still fails, inspect the DOM manually:

1. Right-click on a message in the chat
2. Select **"Inspect"** or **"Inspect Element"**
3. Look for:
   - **Container element**: What wraps all messages?
   - **Message elements**: What element represents each message?
   - **Attributes**: Look for `data-message-id`, `aria-label`, `role`, etc.
   - **Text content**: Where is the actual message text stored?

#### Example Google Chat Structure

```html
<div role="list">
  <div data-message-id="abc123" aria-label="Message from Sandra at 21:23">
    <div class="sender">Sandra Masiwa</div>
    <div class="content">I love you</div>
    <span class="timestamp">21:23</span>
  </div>
  ...
</div>
```

### 6. Report Issues

If extraction still doesn't work, copy the console logs and share:

1. What selectors were tried
2. How many nodes were found
3. What the "Found container using" line shows
4. Any error messages

## Advanced: Custom Selector Testing

You can test selectors directly in the console:

```javascript
// Find the container
const container = document.querySelector('div[role="list"]');
console.log('Container:', container);

// Test a message selector
const messages = container.querySelectorAll('div[data-message-id]');
console.log('Messages found:', messages.length, messages);

// Check first message
if (messages[0]) {
  console.log('First message text:', messages[0].textContent);
  console.log('First message HTML:', messages[0].innerHTML);
}
```

This helps identify the correct selectors for your specific Google Chat version.
