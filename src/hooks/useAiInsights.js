import { useState, useEffect, useRef, useMemo } from 'react';
import { hasGroqKey } from '../services/groqInsights';

/**
 * Custom hook for fetching and managing AI insights
 * @param {Function} fetchFunction - The API function to call (e.g., fetchOverviewAiNotes)
 * @param {Object} payload - The data payload to send to the API
 * @param {Object} options - Optional configuration
 * @param {boolean} options.enabled - Whether to fetch insights (default: true)
 * @returns {Object} - { insights, isLoading, error }
 */
export const useAiInsights = (fetchFunction, payload, options = {}) => {
  const { enabled = true } = options;

  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastPayloadKeyRef = useRef(null);
  const isMountedRef = useRef(true);

  // Create a stable key from the payload to detect changes
  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip if Groq API key is not available
    if (!hasGroqKey) {
      return;
    }

    // Skip if disabled
    if (!enabled) {
      return;
    }

    // Skip if no fetch function provided
    if (!fetchFunction) {
      return;
    }

    // Skip if payload is empty or invalid
    if (!payload || Object.keys(payload).length === 0) {
      return;
    }

    // Skip if payload hasn't changed
    if (payloadKey === lastPayloadKeyRef.current) {
      return;
    }

    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFunction(payload);

        if (isMountedRef.current) {
          setInsights(result);
          lastPayloadKeyRef.current = payloadKey;
        }
      } catch (err) {
        console.error('AI insights fetch error:', err);
        if (isMountedRef.current) {
          setError(err.message || 'Failed to fetch insights');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchInsights();
  }, [fetchFunction, payload, payloadKey, enabled]);

  return {
    insights,
    isLoading,
    error,
    hasInsights: insights !== null,
  };
};
