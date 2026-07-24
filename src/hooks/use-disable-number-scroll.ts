import { RefObject, useEffect } from 'react';

export default function useDisableNumberScroll(
  inputRef: RefObject<HTMLInputElement>
) {
  useEffect(() => {
    let currentInput: HTMLInputElement | null = null;

    const attachListener = (input: HTMLInputElement) => {
      const handleWheel = (e: WheelEvent) => {
        if (document.activeElement === input) {
          e.preventDefault();
        }
      };
      input.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        input.removeEventListener('wheel', handleWheel);
      };
    };

    const cleanup = () => {
      if (currentInput) {
        currentInput.replaceWith(currentInput.cloneNode(true));
        currentInput = null;
      }
    };

    const observer = new MutationObserver(() => {
      if (inputRef.current && inputRef.current !== currentInput) {
        cleanup();
        currentInput = inputRef.current;
        attachListener(currentInput);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });

    if (inputRef.current) {
      currentInput = inputRef.current;
      attachListener(currentInput);
    }

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [inputRef]);
}
