/**
 * Dictionary Service - Enhanced Semantic Analysis
 *
 * Uses en-dictionary (Princeton WordNet 3.0) for sophisticated semantic analysis
 * instead of manual keyword matching. Provides word meanings, synonyms,
 * semantic relationships, and nuanced understanding.
 *
 * Design principles:
 * - Semantic understanding over keyword matching
 * - Context-aware intent detection
 * - Synonym and relationship awareness
 * - Dynamic and extensible
 */

import wordnet from 'en-wordnet';
import Dictionary from 'en-dictionary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the correct database path at runtime
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the actual database location
function getDatabasePath(version) {
  // Try to resolve from node_modules
  try {
    const nodeModulesPath = join(__dirname, '../../node_modules/en-wordnet/database', version);
    return nodeModulesPath;
  } catch (error) {
    console.warn('Could not resolve database path, using wordnet default');
    return wordnet.get(version);
  }
}

// Singleton instance
let dictionaryInstance = null;
let initializationPromise = null;

/**
 * Initialize the dictionary (lazy singleton)
 * Takes ~2 seconds on first load
 *
 * @returns {Promise<Dictionary>} Initialized dictionary instance
 */
async function initializeDictionary() {
  if (dictionaryInstance) {
    return dictionaryInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      const databasePath = getDatabasePath('3.0');
      console.log('[DictionaryService] Using database path:', databasePath);

      const dict = new Dictionary(databasePath);
      await dict.init();

      console.log('[DictionaryService] Dictionary initialized successfully');
      dictionaryInstance = dict;
      return dict;
    } catch (error) {
      console.error('[DictionaryService] Failed to initialize dictionary:', error?.message || error);
      if (error?.stack) {
        console.error('[DictionaryService] Stack:', error.stack);
      }
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get dictionary instance (initializes if needed)
 *
 * @returns {Promise<Dictionary>}
 */
export async function getDictionary() {
  return initializeDictionary();
}

/**
 * Search for word meanings and relationships
 *
 * @param {string} word - Word to search
 * @returns {Promise<Map|null>} Word data or null if not found
 */
export async function searchWord(word) {
  try {
    const dict = await getDictionary();
    const result = dict.searchSimpleFor([word.toLowerCase()]);
    return result.get(word.toLowerCase()) || null;
  } catch (error) {
    console.warn(`Failed to search word "${word}":`, error);
    return null;
  }
}

/**
 * Get synonyms for a word
 *
 * @param {string} word - Word to find synonyms for
 * @returns {Promise<string[]>} Array of synonyms
 */
export async function getSynonyms(word) {
  const wordData = await searchWord(word);
  if (!wordData) return [];

  const synonyms = new Set();

  // Extract synonyms from all parts of speech
  for (const [pos, data] of wordData.entries()) {
    if (data.words) {
      const words = data.words.split(', ').map(w => w.trim());
      words.forEach(w => {
        if (w !== word.toLowerCase() && w.length > 2) {
          synonyms.add(w);
        }
      });
    }
  }

  return Array.from(synonyms);
}

/**
 * Check if a word has a specific semantic meaning
 *
 * @param {string} word - Word to check
 * @param {string[]} meaningKeywords - Keywords to look for in meaning
 * @returns {Promise<boolean>} True if meaning matches
 */
export async function hasSemanticMeaning(word, meaningKeywords) {
  const wordData = await searchWord(word);
  if (!wordData) return false;

  for (const [pos, data] of wordData.entries()) {
    if (data.meaning) {
      const meaning = data.meaning.toLowerCase();
      for (const keyword of meaningKeywords) {
        if (meaning.includes(keyword.toLowerCase())) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Detect intent semantic categories for a word
 *
 * Maps words to intent categories based on their semantic meaning
 *
 * @param {string} word - Word to analyze
 * @returns {Promise<Object>} Intent scores {alignment, resistance, urgency, delegation, closure, uncertainty}
 */
export async function detectWordIntent(word) {
  const wordData = await searchWord(word);

  const intents = {
    alignment: 0,
    resistance: 0,
    urgency: 0,
    delegation: 0,
    closure: 0,
    uncertainty: 0,
  };

  if (!wordData) return intents;

  // Analyze each part of speech
  for (const [pos, data] of wordData.entries()) {
    const meaning = (data.meaning || '').toLowerCase();
    const words = (data.words || '').toLowerCase();

    // Alignment indicators (enhanced for corporate/business context)
    if (
      meaning.includes('agree') ||
      meaning.includes('accord') ||
      meaning.includes('harmony') ||
      meaning.includes('consensus') ||
      meaning.includes('support') ||
      meaning.includes('cooperat') ||
      meaning.includes('collaborat') ||
      meaning.includes('approve') ||
      meaning.includes('endorse') ||
      meaning.includes('confirm') ||
      meaning.includes('align') ||
      meaning.includes('partnership') ||
      meaning.includes('synergy') ||
      meaning.includes('buy-in') ||
      meaning.includes('stakeholder') ||
      words.includes('yes') ||
      words.includes('okay') ||
      words.includes('agreed') ||
      words.includes('absolutely') ||
      words.includes('definitely') ||
      words.includes('approve') ||
      words.includes('endorse') ||
      words.includes('support') ||
      words.includes('confirm') ||
      words.includes('forward') ||
      words.includes('proceed')
    ) {
      intents.alignment += 0.3;
    }

    // Resistance indicators (enhanced for corporate/business context)
    if (
      meaning.includes('disagree') ||
      meaning.includes('oppos') ||
      meaning.includes('object') ||
      meaning.includes('resist') ||
      meaning.includes('refus') ||
      meaning.includes('reject') ||
      meaning.includes('conflict') ||
      meaning.includes('dispute') ||
      meaning.includes('challenge') ||
      meaning.includes('concern') ||
      meaning.includes('pushback') ||
      meaning.includes('obstacle') ||
      meaning.includes('blocker') ||
      meaning.includes('veto') ||
      meaning.includes('escalat') ||
      words.includes('no') ||
      words.includes('but') ||
      words.includes('however') ||
      words.includes('disagree') ||
      words.includes('concern') ||
      words.includes('issue') ||
      words.includes('problem') ||
      words.includes('blocker')
    ) {
      intents.resistance += 0.3;
    }

    // Urgency indicators (enhanced for corporate/business context)
    if (
      meaning.includes('urgent') ||
      meaning.includes('immediate') ||
      meaning.includes('quick') ||
      meaning.includes('hurry') ||
      meaning.includes('pressing') ||
      meaning.includes('critical') ||
      meaning.includes('emergency') ||
      meaning.includes('asap') ||
      meaning.includes('priority') ||
      meaning.includes('deadline') ||
      meaning.includes('time-sensitive') ||
      meaning.includes('expedite') ||
      meaning.includes('rush') ||
      words.includes('urgent') ||
      words.includes('asap') ||
      words.includes('immediately') ||
      words.includes('priority') ||
      words.includes('deadline') ||
      words.includes('critical') ||
      words.includes('emergency')
    ) {
      intents.urgency += 0.3;
    }

    // Delegation indicators (enhanced for corporate/business context)
    if (
      meaning.includes('assign') ||
      meaning.includes('delegat') ||
      meaning.includes('transfer') ||
      meaning.includes('hand over') ||
      meaning.includes('handoff') ||
      meaning.includes('responsib') ||
      meaning.includes('task') ||
      meaning.includes('owner') ||
      meaning.includes('accountab') ||
      meaning.includes('action item') ||
      meaning.includes('follow up') ||
      meaning.includes('take on') ||
      words.includes('please') ||
      words.includes('could you') ||
      words.includes('would you') ||
      words.includes('assign') ||
      words.includes('delegate') ||
      words.includes('handle') ||
      words.includes('ownership')
    ) {
      intents.delegation += 0.3;
    }

    // Closure indicators (enhanced for corporate/business context)
    if (
      meaning.includes('complet') ||
      meaning.includes('finish') ||
      meaning.includes('done') ||
      meaning.includes('conclud') ||
      meaning.includes('end') ||
      meaning.includes('final') ||
      meaning.includes('resolve') ||
      meaning.includes('deliver') ||
      meaning.includes('ship') ||
      meaning.includes('launch') ||
      meaning.includes('close') ||
      meaning.includes('wrap') ||
      meaning.includes('milestone') ||
      words.includes('done') ||
      words.includes('complete') ||
      words.includes('finished') ||
      words.includes('delivered') ||
      words.includes('shipped') ||
      words.includes('closed') ||
      words.includes('resolved')
    ) {
      intents.closure += 0.3;
    }

    // Uncertainty indicators (enhanced for corporate/business context)
    if (
      meaning.includes('uncertain') ||
      meaning.includes('doubt') ||
      meaning.includes('unclear') ||
      meaning.includes('confus') ||
      meaning.includes('ambiguous') ||
      meaning.includes('question') ||
      meaning.includes('wonder') ||
      meaning.includes('risk') ||
      meaning.includes('hesitat') ||
      meaning.includes('reconsidering') ||
      meaning.includes('assumption') ||
      meaning.includes('clarif') ||
      words.includes('maybe') ||
      words.includes('perhaps') ||
      words.includes('unsure') ||
      words.includes('confused') ||
      words.includes('unclear') ||
      words.includes('question') ||
      words.includes('risk') ||
      words.includes('assume')
    ) {
      intents.uncertainty += 0.3;
    }
  }

  // Normalize to 0-1 range
  for (const key in intents) {
    intents[key] = Math.min(intents[key], 1.0);
  }

  return intents;
}

/**
 * Analyze multiple words for intent
 *
 * @param {string[]} words - Array of words to analyze
 * @returns {Promise<Object>} Aggregated intent scores
 */
export async function analyzeWordsIntent(words) {
  const intents = {
    alignment: 0,
    resistance: 0,
    urgency: 0,
    delegation: 0,
    closure: 0,
    uncertainty: 0,
  };

  let processedWords = 0;

  for (const word of words) {
    // Skip very short words (likely stop words or not meaningful)
    if (word.length < 3) continue;

    const wordIntents = await detectWordIntent(word);

    // Accumulate scores
    for (const key in intents) {
      intents[key] += wordIntents[key];
    }

    if (Object.values(wordIntents).some(v => v > 0)) {
      processedWords++;
    }
  }

  // Average the scores
  if (processedWords > 0) {
    for (const key in intents) {
      intents[key] = intents[key] / processedWords;
      intents[key] = Math.min(intents[key], 1.0);
    }
  }

  return intents;
}

/**
 * Find words related to a concept
 *
 * @param {string} concept - Concept to search for
 * @param {number} limit - Maximum number of words to return
 * @returns {Promise<string[]>} Related words
 */
export async function findRelatedWords(concept, limit = 10) {
  try {
    const dict = await getDictionary();
    const results = dict.wordsIncluding(concept.toLowerCase());
    return results.slice(0, limit);
  } catch (error) {
    console.warn(`Failed to find related words for "${concept}":`, error);
    return [];
  }
}

/**
 * Check if dictionary is initialized
 *
 * @returns {boolean}
 */
export function isInitialized() {
  return dictionaryInstance !== null;
}

/**
 * Reset dictionary (for testing)
 */
export function resetDictionary() {
  dictionaryInstance = null;
  initializationPromise = null;
}
