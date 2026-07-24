import { CHATBOT_LOADING_PLACEHOLDERS } from '@/constants/chatbot.constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseThinkingIndicatorOptions {
  isStreaming: boolean;
  enabled?: boolean;
  interval?: number;
}

export const useThinkingIndicator = ({
  isStreaming,
  enabled = true,
  interval = 2000,
}: UseThinkingIndicatorOptions) => {
  const [statusText, setStatusText] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusTextRef = useRef<string>('');

  const getRandomText = useCallback(() => {
    const randomIndex = Math.floor(
      Math.random() * CHATBOT_LOADING_PLACEHOLDERS.length
    );
    const text = CHATBOT_LOADING_PLACEHOLDERS[randomIndex];
    statusTextRef.current = text;
    return text;
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (isStreaming) {
      setIsVisible(true);
      const initialText = getRandomText();
      setStatusText(initialText);

      intervalRef.current = setInterval(() => {
        getRandomText();
        setStatusText((prev) => {
          const newText = getRandomText();
          return newText;
        });
      }, interval);
    } else {
      clearTimer();
      setIsVisible(false);
      setStatusText('');
      statusTextRef.current = '';
    }

    return () => clearTimer();
  }, [isStreaming, enabled, interval, getRandomText, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsVisible(false);
    setStatusText('');
    statusTextRef.current = '';
  }, [clearTimer]);

  const result = useMemo(
    () => ({
      statusText,
      isVisible,
      reset,
    }),
    [statusText, isVisible, reset]
  );

  return result;
};
