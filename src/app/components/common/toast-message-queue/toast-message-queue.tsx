import { getToastStyle } from '@/utils';
import { GlobalDataTestIds } from 'cypress/enums/global';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  clearToastMessage,
  resetToastMessage,
  resetToastMessageWithAutoClear,
  selectToastMessages,
} from 'src/redux/slices/notifications/toast-message.slice';
import ToastMessage from '../toast-message/toast-message';
import ToastMessageQueueControls from './toast-message-nav-bar';
import styles from './toast-message-queue.module.scss';

export function ToastMessageQueue() {
  const [hovered, setHovered] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [areControlsDisabled, setAreControlsDisabled] =
    useState<boolean>(false);

  const toastMessages = useAppSelector(selectToastMessages);
  const dispatch = useAppDispatch();
  const totalCount = useMemo(
    () => toastMessages.length,
    [toastMessages.length]
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number | undefined>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetTimer = () => {
    const currentMessage = toastMessages[activeIndex];
    if (
      currentMessage?.autoClear &&
      currentMessage.autoClearTime !== undefined
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      startTimeRef.current = Date.now();
      remainingTimeRef.current = currentMessage.autoClearTime;

      if (!hovered) {
        timeoutRef.current = setTimeout(() => {
          dispatch(resetToastMessageWithAutoClear());
        }, currentMessage.autoClearTime);
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      remainingTimeRef.current = undefined;
    }
  };

  useEffect(() => {
    if (totalCount === 0) {
      setActiveIndex(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      remainingTimeRef.current = undefined;
    } else {
      resetTimer();
    }
  }, [totalCount, activeIndex, toastMessages]);

  const handleMouseEnter = () => {
    if (
      timeoutRef.current &&
      remainingTimeRef.current &&
      startTimeRef.current
    ) {
      clearTimeout(timeoutRef.current);
      remainingTimeRef.current =
        remainingTimeRef.current - (Date.now() - startTimeRef.current);
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    const currentMessage = toastMessages[activeIndex];
    if (
      remainingTimeRef.current &&
      remainingTimeRef.current > 0 &&
      currentMessage?.autoClear
    ) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        dispatch(resetToastMessageWithAutoClear());
      }, remainingTimeRef.current);
    }
  };

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % totalCount;
    setActiveIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = activeIndex === 0 ? totalCount - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  const close = (index: number) => {
    dispatch(clearToastMessage(index));
    const newTotalCount = totalCount - 1;
    if (activeIndex >= newTotalCount) {
      setActiveIndex(Math.max(0, newTotalCount - 1));
    }
  };

  const closeAll = () => {
    dispatch(resetToastMessage());
    setActiveIndex(0);
    setHovered(false);
  };

  const updateHeight = useCallback(() => {
    if (containerRef.current) {
      const activeToast = containerRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeToast) {
        setContainerHeight(activeToast.clientHeight);
      }
    }
  }, [activeIndex]);
  useEffect(() => {
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeIndex, toastMessages]);
  return (
    <div
      data-test={GlobalDataTestIds.TOAST_WRAPPER}
      className={styles.toastMessageQueueWrapper}
      style={{
        opacity: totalCount > 0 ? '1' : '0',
        transform: totalCount > 0 ? 'translateY(0)' : 'translateY(100%)',
        transition: 'opacity 0.4s ease-in-out,transform 0.4s ease-in-out',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <ToastMessageQueueControls
        totalCount={totalCount}
        messages={toastMessages}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onCloseAll={closeAll}
        areControlsDisabled={areControlsDisabled}
      />

      <div
        className={styles.messagesContainer}
        style={{
          height: `${containerHeight}px`,
        }}
      >
        {toastMessages.map((item, index) => (
          <ToastMessage
            key={`${item.title}-${index}`}
            hovered={hovered}
            data-index={index}
            title={item.title}
            description={item.description}
            errData={item.errData}
            type={item.type}
            closeToast={() => close(index)}
            totalCount={totalCount}
            currentIndex={index + 1}
            style={getToastStyle(index, activeIndex)}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            areControlsDisabled={areControlsDisabled}
            setAreControlsDisabled={setAreControlsDisabled}
          />
        ))}
      </div>
    </div>
  );
}

export default ToastMessageQueue;
