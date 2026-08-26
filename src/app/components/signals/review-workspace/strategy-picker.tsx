import { useCallback, useRef, useState } from 'react';
import { PencilSimple } from '@phosphor-icons/react';
import type { Strategy } from '@/utils/signals/strategies';
import styles from './strategy-picker.module.scss';

interface Props {
  strategies: Strategy[];
  selectedId: string;
  onSelect: (id: string) => void;
  customValue?: string;
  onCustomChange?: (v: string) => void;
  onCustomSubmit?: () => void;
}

export function StrategyPicker({ strategies, selectedId, onSelect, customValue, onCustomChange, onCustomSubmit }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const [showCustomFor, setShowCustomFor] = useState<Record<string, boolean>>({});

  const handleToggleCustom = useCallback((id: string) => {
    setShowCustomFor((prev) => {
      const isOpen = prev[id];
      if (isOpen) return { ...prev, [id]: false };
      const next: Record<string, boolean> = {};
      next[id] = true;
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      if (!items?.length) return;

      const currentIndex = Array.from(items).indexOf(e.target as HTMLButtonElement);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % items.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + items.length) % items.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = items.length - 1;
          break;
      }

      if (nextIndex !== null) {
        items[nextIndex].focus();
        onSelect(strategies[nextIndex].id);
      }
    },
    [strategies, onSelect],
  );

  return (
    <ul
      ref={listRef}
      className={styles.list}
      role="radiogroup"
      onKeyDown={handleKeyDown}
    >
      {strategies.map((s) => {
        const active = s.id === selectedId;
        const isCustom = s.id.endsWith(':custom');
        const customVisible = showCustomFor[s.id] && active && !isCustom;

        const btnClass = [
          styles.optionBtn,
          active && styles.optionBtnActive,
          active && isCustom && styles.optionBtnCustomActive,
          active && customVisible && styles.optionBtnCustomActive,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={s.id}>
            <button
              type="button"
              role="radio"
              aria-checked={active}
              className={btnClass}
              onClick={() => onSelect(s.id)}
            >
              <div className={styles.row}>
                <div
                  className={`${styles.radio} ${active ? styles.radioActive : ''}`}
                  aria-hidden="true"
                />
                <div className={styles.content}>
                  <div className={styles.titleRow}>
                    <span className={styles.title}>{s.title}</span>
                    {s.recommended && (
                      <span className={styles.recommended}>
                        ◆ Recommended
                      </span>
                    )}
                  </div>
                  {active && isCustom ? (
                    <input
                      autoFocus
                      value={customValue ?? ''}
                      onChange={(e) => onCustomChange?.(e.target.value)}
                      placeholder="Type your instruction for Jiva…"
                      className={styles.customInput}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && customValue?.trim()) {
                          e.preventDefault();
                          onCustomSubmit?.();
                        }
                      }}
                    />
                  ) : (
                    <>
                      <div className={styles.detail}>{s.detail}</div>
                      {!isCustom && (
                        <button
                          type="button"
                          className={styles.customLink}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCustom(s.id);
                            if (!active) onSelect(s.id);
                          }}
                        >
                          <PencilSimple size="0.85rem" weight="regular" />
                          Write custom instruction
                        </button>
                      )}
                    </>
                  )}
                  {customVisible && (
                    <div className={styles.customInputWrap}>
                      <input
                        autoFocus
                        value={customValue ?? ''}
                        onChange={(e) => onCustomChange?.(e.target.value)}
                        placeholder="Type your instruction for Jiva…"
                        className={styles.customInput}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && customValue?.trim()) {
                            e.preventDefault();
                            onCustomSubmit?.();
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
