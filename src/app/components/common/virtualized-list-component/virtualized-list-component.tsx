import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef } from 'react';
import styles from './virtualized-list-component.module.scss';

interface IVirtualizedListProps {
  props: React.HTMLAttributes<HTMLElement>;
  ref: React.ForwardedRef<HTMLDivElement>;
  itemHeight: number;
  maxVisibleItems: number;
  overScan: number;
}

function VirtualizedListBox({
  props,
  ref,
  itemHeight,
  maxVisibleItems,
  overScan,
}: IVirtualizedListProps) {
  const { children, ...other } = props;
  const parentRef = useRef<HTMLDivElement>(null);
  const itemData = React.Children.toArray(children);

  const virtualizer = useVirtualizer({
    count: itemData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: overScan,
  });

  return (
    <div ref={ref}>
      <div
        {...other}
        style={{
          ...other.style,
          margin: 0,
          padding: 0,
        }}
      >
        <div
          ref={parentRef}
          style={{
            height: `${maxVisibleItems * itemHeight}px`,
            overflow: 'auto',
          }}
          className={styles.scroll}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const item = itemData[virtualItem.index] as React.ReactElement;
              return React.cloneElement(item, {
                key: `virtual-${virtualItem.index}-${item.key}`,
                style: {
                  ...item.props.style,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                },
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualizedListBox;
