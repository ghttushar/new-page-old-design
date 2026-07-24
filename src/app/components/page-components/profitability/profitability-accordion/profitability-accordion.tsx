import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '@/app/components/common/img-component/img-component';
import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import {
  getAccordionItemStyles,
  getCaretIconStyles,
} from '@/app/components/pages/profitability-page/profitability-styles';
import { imageUrls } from '@/constants/assets/images.constants';
import { ACCORDION_ROOT_ID } from '@/constants/profitability/profitability.constants';
import { ProfitabilityFallBackEnum } from '@/enums/profitability.enums';
import {
  IAccordionItem,
  ProfitabilityAccordionProps,
} from '@/interfaces/profitability/profitability.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectIsSidebarMenuOpen } from '@/redux/slices/auth/auth.slice';
import { selectSelectedRowData } from '@/redux/slices/profitability/profitability.slice';
import { hasProperty } from '@/utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import IconButton from '@mui/material/IconButton/IconButton';
import {
  CaretDoubleRightIcon,
  CaretRightIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useEffect } from 'react';
import styles from './profitability-accordion.module.scss';

const ProfitabilityAccordion = ({
  activeCardNumber,
  handleClose,
  expandedItems,
  setExpandedItems,
  isLoading,
  isTable = false,
  totalExpandableItems,
  accordionData,
  calculatedMetrics,
}: ProfitabilityAccordionProps) => {
  const isSideBarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const selectedRowData = useAppSelector(selectSelectedRowData);
  useEffect(() => {
    if (
      expandedItems.size === 0 &&
      accordionData.length >= 1 &&
      accordionData[0].children &&
      accordionData[0].children.length >= 1
    ) {
      setExpandedItems(
        profitabilityUtils.getItemIdFromLabel(
          ACCORDION_ROOT_ID,
          accordionData[0].children[0].label,
          0
        ),
        0
      );
    }
  }, []);

  const renderAccordionItem = (
    item: IAccordionItem,
    level = 0,
    parentId = '',
    index = 0
  ) => {
    const itemId = profitabilityUtils.getItemIdFromLabel(
      parentId,
      item.label,
      index
    );
    const isExpanded = expandedItems.has(itemId);
    const hasChildren = item.children && item.children.length > 0;

    const toggleItem = () => {
      if (isLoading) return;
      if (hasChildren) setExpandedItems(itemId, activeCardNumber);
    };
    if (item.label === '') return null;

    return (
      <div key={itemId} className={styles.accordionItem}>
        <div
          className={`${styles.tableRow} ${styles[`level${level}`]} ${
            isExpanded ? styles.expanded : ''
          }`}
          onClick={toggleItem}
          style={getAccordionItemStyles(
            accordionData.length === 0,
            isTable,
            hasChildren ?? false,
            isLoading
          )}
        >
          <div
            className={styles.labelColumn}
            style={{ paddingLeft: `${level * 1.2}rem` }}
          >
            <span
              className={styles.icon}
              style={{
                visibility: hasChildren ? 'visible' : 'hidden',
              }}
            >
              <CaretRightIcon
                size={'1.2rem'}
                style={getCaretIconStyles(
                  isExpanded,
                  accordionData.length === 0,
                  isTable,
                  hasChildren === true
                )}
                color={isExpanded ? '#77469b' : '#464646'}
                weight={'bold'}
              />
            </span>
            <span
              className={styles.label}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem();
              }}
            >
              <HoverInfoTooltip
                title={item.label.length > 40 ? item.label : ''}
              >
                <span>{item.label}</span>
              </HoverInfoTooltip>
            </span>
          </div>
          {isLoading ? (
            <SkeletonComponent
              width={'4rem'}
              height={'2.5rem'}
              color="#f4f4f4"
            />
          ) : (
            <div className={styles.valueColumn}>
              <span className={styles.value}>{item.value}</span>
            </div>
          )}

          <div className={styles.percentageColumn}>
            {item.percentage !== undefined &&
              (isLoading === true ? (
                <SkeletonComponent
                  width={'4rem'}
                  height={'2.5rem'}
                  color="#f4f4f4"
                />
              ) : (
                item.percentage !== '' && (
                  <span className={styles.percentage}>{item.percentage}</span>
                )
              ))}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.itemContent}>
            {item.children?.map((child, childIndex) =>
              renderAccordionItem(child, level + 1, itemId, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={styles.container}
      style={{
        flexBasis: isSideBarMenuOpen ? '76.5%' : '62%',
      }}
    >
      <div className={styles.titleSection}>
        <h3 className={styles.title}>
          <IconButton
            disableRipple
            onClick={() => {
              if (accordionData.length > 0) {
                setExpandedItems('', -1);
              }
            }}
            className={styles.iconBtn}
            style={{
              cursor:
                accordionData.length === 0 || totalExpandableItems === 0
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            <CaretDoubleRightIcon
              size={'1.4rem'}
              color="white"
              weight="bold"
              style={{
                rotate:
                  expandedItems.size === totalExpandableItems &&
                  totalExpandableItems > 0
                    ? '90deg'
                    : '0deg',
                transition: 'all 0.2s ease',
              }}
            />
          </IconButton>
          {isTable === true &&
          (hasProperty(selectedRowData, 'subRows') === true ||
            hasProperty(selectedRowData, 'items') === true) === false ? (
            <ImgComponent
              imageURL={profitabilityUtils.getImageUrlFromData(selectedRowData)}
              alt={'product-img'}
              isProduct={true}
              customStyles={{
                width: 'auto',
                height: '4rem',
              }}
            />
          ) : (
            <ImgComponent
              imageURL={imageUrls.usFlag}
              alt={'us-flag'}
              isProduct={true}
              customStyles={{
                width: 'auto',
                height: '2rem',
              }}
            />
          )}
          {isLoading === true ? (
            <span className="mt-[-0.2rem]">
              <SkeletonComponent
                width={'8rem'}
                height={'2rem'}
                color="#d8b3e6"
              />
            </span>
          ) : (
            accordionData[0]?.label ?? ProfitabilityFallBackEnum.ACCORDION_TITLE
          )}
        </h3>

        <IconButton
          onClick={handleClose}
          className={styles.iconBtn}
          sx={{
            padding: '0.2rem !important',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <XIcon size={'1.6rem'} color="white" weight="bold" />
        </IconButton>
      </div>

      <div className={styles.accordionSection}>
        <div className={styles.tableContainer}>
          {accordionData[0]?.children?.map(
            (item: IAccordionItem, index: number) =>
              renderAccordionItem(item, 0, ACCORDION_ROOT_ID, index)
          )}
        </div>

        <div className={styles.metricsSection}>
          <div className={styles.metricsHeader}>
            <h4 className={styles.metricsTitle}>Calculated Metrics</h4>
          </div>
          <div className={styles.metricsContent}>
            <div className={styles.metricsTable}>
              {calculatedMetrics.map((metric) => (
                <div key={metric.key} className={styles.metricRow}>
                  <div className={styles.metricLabel}>{metric.label}</div>
                  <div className={styles.metricValue}>
                    {isLoading === true ? (
                      <span className={styles.skeleton}>
                        <SkeletonComponent color="#dadeeb" width={'4rem'} />
                      </span>
                    ) : (
                      metric.currValue
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAccordion;
