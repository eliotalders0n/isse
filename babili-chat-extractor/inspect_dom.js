// DOM Inspector - Run this in the browser console to find the correct chat container
// Copy and paste this entire script into the console while on Google Chat

(function () {
  console.log('=== Babili DOM Inspector ===');
  console.log('Analyzing Google Chat DOM structure...\n');

  // Check if we are in an iframe
  if (window !== window.top) {
    console.log('⚠️ Running inside an IFRAME');
    console.log('Origin:', window.location.origin);
  } else {
    console.log('✅ Running in TOP frame');
    const iframes = document.querySelectorAll('iframe');
    console.log(`Found ${iframes.length} iframes in the top window. Messages might be inside one of them.`);
  }

  // Check for Shadow DOM
  const allEls = document.querySelectorAll('*');
  let shadowRoots = 0;
  for (const el of allEls) {
    if (el.shadowRoot) shadowRoots++;
  }
  if (shadowRoots > 0) {
    console.log(`⚠️ Found ${shadowRoots} elements with Shadow DOM. Messages might be hidden inside.`);
  }

  // Find all potential scrollable containers
  const scrollableContainers = Array.from(document.querySelectorAll('div')).filter(d =>
    d.scrollHeight > d.clientHeight && d.clientHeight > 200
  );

  console.log(`Found ${scrollableContainers.length} scrollable containers:\n`);
  scrollableContainers.forEach((container, i) => {
    const attrs = Array.from(container.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
    console.log(`${i + 1}. <div ${attrs.substring(0, 100)}${attrs.length > 100 ? '...' : ''}>`);
    console.log(`   Height: ${container.clientHeight}px, Scroll: ${container.scrollHeight}px`);
    console.log(`   Children: ${container.children.length}`);
  });

  // Look for elements with message-like attributes
  console.log('\n=== Message-like elements ===');

  const messageSelectors = [
    '[data-message-id]',
    '[aria-label*="Message"]',
    '[aria-label*="from"]',
    '[jslog*="message"]',
    '[role="listitem"]',
    '[role="row"]'
  ];

  messageSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`\n"${selector}": found ${elements.length}`);
      if (elements.length > 0) {
        const sample = elements[0];
        console.log('Sample element:', sample);
        console.log('Sample text:', sample.textContent.substring(0, 100));
        console.log('Sample HTML:', sample.outerHTML.substring(0, 200) + '...');
      }
    }
  });

  // Check for c-wiz components (Google's framework)
  console.log('\n=== Google c-wiz components ===');
  const cwizElements = document.querySelectorAll('c-wiz');
  console.log(`Found ${cwizElements.length} c-wiz elements`);

  Array.from(cwizElements).forEach((el, i) => {
    const attrs = Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).slice(0, 5);
    console.log(`${i + 1}. c-wiz with attributes:`, attrs);
  });

  // Look for role attributes
  console.log('\n=== Elements with role attributes ===');
  const roleElements = document.querySelectorAll('[role]');
  const roleCounts = {};
  roleElements.forEach(el => {
    const role = el.getAttribute('role');
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  console.log('Role counts:', roleCounts);

  // Inspect visible message text
  console.log('\n=== Searching for visible message text ===');
  const allText = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const text = el.textContent?.trim();
      return text && text.length > 5 && text.length < 200 &&
        el.children.length === 0; // Leaf nodes only
    })
    .map(el => ({
      text: el.textContent.trim(),
      tag: el.tagName,
      parent: el.parentElement?.tagName,
      parentAttrs: Array.from(el.parentElement?.attributes || [])
        .map(a => `${a.name}="${a.value.substring(0, 30)}"`)
        .join(' ')
    }))
    .slice(0, 20); // First 20 text nodes

  console.log('Sample text nodes:');
  allText.forEach((item, i) => {
    console.log(`${i + 1}. "${item.text.substring(0, 50)}"`);
    console.log(`   <${item.tag}> inside <${item.parent} ${item.parentAttrs.substring(0, 100)}>`);
  });

  console.log('\n=== Next Steps ===');
  console.log('1. Look at the scrollable containers above - which one contains the messages?');
  console.log('2. Check the message-like elements - do any selectors find the actual messages?');
  console.log('3. Inspect the c-wiz components - Google Chat often uses these');
  console.log('4. Look at the sample text nodes - find the pattern for message containers');
  console.log('\nOnce you identify the correct container and message selectors, update content.js');
})();
