import { IDropdownItem } from '../dropdown/dropdown';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import styles from './grid-spaced-selection-container.module.scss';

interface IGridSpacedContainerProps<T> {
  options: IDropdownItem<T>[];
  selectedItems: Set<T> | undefined;
  onItemClick: (value: IDropdownItem<T>) => void;
  noOfColumns?: number;
  itemContainerRequired: boolean;
  itemBorderRadius: string;
  isNewDesign?: boolean;
  isFlexWidth?: boolean;
}

export default function GridSpacedContainer<T>({
  options,
  selectedItems,
  onItemClick,
  noOfColumns,
  itemContainerRequired,
  itemBorderRadius,
  isNewDesign = false,
  isFlexWidth = false,
}: IGridSpacedContainerProps<T>) {
  return (
    <div
      className={`${styles.gridContainer} ${
        isFlexWidth ? styles.flexWidthGrid : ''
      }`}
      style={{
        gridTemplateColumns: noOfColumns
          ? `repeat(${noOfColumns}, 1fr)`
          : isFlexWidth
          ? 'repeat(auto-fit, minmax(max-content, 1fr))'
          : `repeat(${options.length}, auto)`,
      }}
    >
      {options.map((option, idx) => {
        const itemContent = (
          <div
            key={idx}
            className={`${option.isDisabled ? styles.disabled : ''} ${
              selectedItems && selectedItems.has(option.value)
                ? isNewDesign
                  ? styles.isSelectedNewStyles
                  : styles.isSelected
                : ''
            } ${styles.itemButton} ${
              itemContainerRequired ? styles.withItemContainer : ''
            } ${isFlexWidth ? styles.flexWidthItem : ''}`}
            style={{
              borderRadius: itemBorderRadius,
            }}
            onClick={() => onItemClick(option)}
          >
            {option.label}
          </div>
        );

        if (option.isDisabled && option.tooltipText) {
          return (
            <HoverInfoTooltip key={idx} title={option.tooltipText}>
              {itemContent}
            </HoverInfoTooltip>
          );
        }

        return itemContent;
      })}
    </div>
  );
}
