/**
 * Test Semantic Analyzer
 *
 * Simple test script to verify dictionary-based semantic analysis
 */

import { analyzeSemanticLexical } from './semanticLexicalAnalyzer.js';
import { getDictionary } from './dictionaryService.js';

async function testSemanticAnalyzer() {
  console.log('🧪 Testing Semantic Lexical Analyzer...\n');

  try {
    // Initialize dictionary (takes ~2 seconds)
    console.log('⏳ Initializing dictionary...');
    const startInit = Date.now();
    await getDictionary();
    console.log(`✅ Dictionary initialized in ${Date.now() - startInit}ms\n`);

    // Test messages with different intents
    const testMessages = [
      {
        text: 'I completely agree with your proposal. Let\'s move forward!',
        expectedIntent: 'alignment',
      },
      {
        text: 'I disagree. This approach won\'t work for our use case.',
        expectedIntent: 'resistance',
      },
      {
        text: 'This is urgent! We need to fix this immediately.',
        expectedIntent: 'urgency',
      },
      {
        text: 'Could you please handle this task? It needs your expertise.',
        expectedIntent: 'delegation',
      },
      {
        text: 'Task completed. Everything is finished and working perfectly.',
        expectedIntent: 'closure',
      },
      {
        text: 'I\'m not sure about this. Maybe we should reconsider?',
        expectedIntent: 'uncertainty',
      },
    ];

    // Analyze each message
    for (const testMsg of testMessages) {
      const message = {
        text: testMsg.text,
        normalizedText: testMsg.text.toLowerCase(),
        tokens: testMsg.text.toLowerCase().split(/\s+/).filter(t => t.length >= 2),
      };

      console.log(`📝 Message: "${testMsg.text}"`);
      console.log(`   Expected: ${testMsg.expectedIntent}`);

      const start = Date.now();
      const result = await analyzeSemanticLexical(message);
      const duration = Date.now() - start;

      console.log(`   Analysis time: ${duration}ms`);
      console.log(`   Dominant intent: ${result.intents.dominantIntent}`);
      console.log(`   Confidence: ${(result.intents.confidence * 100).toFixed(1)}%`);
      console.log(`   Intent scores:`);
      console.log(`     - Alignment: ${(result.intents.alignment * 100).toFixed(1)}%`);
      console.log(`     - Resistance: ${(result.intents.resistance * 100).toFixed(1)}%`);
      console.log(`     - Urgency: ${(result.intents.urgency * 100).toFixed(1)}%`);
      console.log(`     - Delegation: ${(result.intents.delegation * 100).toFixed(1)}%`);
      console.log(`     - Closure: ${(result.intents.closure * 100).toFixed(1)}%`);
      console.log(`     - Uncertainty: ${(result.intents.uncertainty * 100).toFixed(1)}%`);

      const isCorrect = result.intents.dominantIntent === testMsg.expectedIntent;
      console.log(`   ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}\n`);
    }

    console.log('✨ Testing complete!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testSemanticAnalyzer().then(() => {
  console.log('All tests completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
