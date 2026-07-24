import Dropdown, {
  IDropdownItem,
} from '@/app/components/common/dropdown/dropdown';
import MultiSelectDropdown from '@/app/components/common/dropdown/multi-select-dropdown';
import GraphLoadingComponent from '@/app/components/common/graph-loading-state/graph-loading-state';
import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '@/app/components/common/img-component/img-component';
import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import TextButton from '@/app/components/common/text-button/text-button';
import ProfitabilityGraph from '@/app/components/page-components/profitability/profitability-graph/profitability-graph';
import UploadCOGSDialog from '@/app/components/page-components/profitability/upload-cogs-dialog/upload-cogs-dialog';
import { LOGO_ITEM_ID, LOGO_ITEM_NAME } from '@/constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { Nullable } from '@/interfaces/index.interface';
import { IProfitabilityOrdersData } from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import {
  selectActivePerformanceBox,
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
  selectSelectedProducts,
  setProfitabilityFilterState,
  setProfitabilityGraphMetricsFilters,
} from '@/redux/slices/profitability/profitability.slice';
import { amazonProfitabilityService } from '@/services/profitability/amazon-profitability.service';
import { profitabilityHomeService } from '@/services/profitability/profitability-home.service';
import { displayValue, formatNum } from '@/utils';
import { checkIsNull, getProductUrl } from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@mui/material';
import { ChartLine, XIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './product-details.module.scss';

interface IProductDetails {
  isLoading: boolean;
  name: string;
  sku?: Nullable<string>;
  imgUrl: string;
  itemId: string;
  productPrice?: Nullable<number>;
  itemInventory?: number;
  showPerformance?: boolean;
  orderId?: string;
  isTrends?: boolean;
  cogs?: Nullable<number>;
  isHome?: boolean;
  marketplace?: MarketplaceEnum;
}

function ProfitabilityProductDetails({
  imgUrl,
  itemId,
  name,
  productPrice,
  sku,
  isLoading,
  showPerformance = true,
  itemInventory,
  isTrends = false,
  cogs,
  isHome = false,
  marketplace = MarketplaceEnum.WALMART,
}: IProductDetails) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const filterOptions = useAppSelector(selectProfitabilityHeaderFilterOptions);
  const activePerformanceBox = useAppSelector(selectActivePerformanceBox);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const selectedProducts = useAppSelector(selectSelectedProducts);

  const [graphData, setGraphData] = useState<any | null>(null);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isUploadCOGSOpen, setIsUploadCOGSOpen] = useState(false);

  const handleUploadCOGSToggle = () => setIsUploadCOGSOpen((prev) => !prev);

  const handleGraphToggle = () => {
    setIsGraphOpen(!isGraphOpen);
    dispatch(
      setProfitabilityFilterState({
        ...filters,
        graphFrequency: filters.frequency,
      })
    );
  };

  const selectedMetricsData =
    profitabilityUtils.getProfitabilityMetricsGraphData<IProfitabilityOrdersData>(
      filters.graphMetrics
    );

  const handleSelectFrequency = (graphFrequency: IDropdownItem<Frequency>) => {
    dispatch(
      setProfitabilityFilterState({
        ...filters,
        graphFrequency,
      })
    );
  };

  const fetchProductSearchPnLData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_PRODUCT_SEARCH_GRAPH_DATA,
      filters.graphFrequency,
      sku,
    ],
    queryFn: ({ signal }) => {
      return profitabilityHomeService.getProductSearchPnLData(
        profitabilityUtils.getProductSearchPnLDataPayload(
          filters,
          appliedFilters,
          activePerformanceBox,
          isTrends,
          true
        ),
        [sku ?? ''],
        signal
      );
    },
    options: {
      staleTime: Infinity,
    },
    enabled:
      Boolean(sku) && isGraphOpen && marketplace === MarketplaceEnum.WALMART,
  });

  const fetchProfitabilityProductLevelData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMAZON_PROFITABILITY_TRENDS_PRODUCT_LEVEL_DATA,
      filters.graphFrequency,
      JSON.stringify([sku, itemId]),
    ],
    queryFn: ({ signal }) => {
      return amazonProfitabilityService.getGraphData(
        {
          ...profitabilityUtils.getGraphDataPayload(
            filters,
            activePerformanceBox,
            true,
            []
          ),
          frequency: filters.graphFrequency.value,
          asinSkuMapping: [
            {
              asin: itemId,
              sku: sku ?? '',
            },
          ],
        },
        signal
      );
    },
    options: {
      staleTime: Infinity,
    },
    enabled:
      Boolean(itemId) &&
      Boolean(sku) &&
      marketplace === MarketplaceEnum.AMAZON &&
      isGraphOpen,
  });

  useEffect(() => {
    if (fetchProductSearchPnLData.isSuccess) {
      const responseData = fetchProductSearchPnLData.data.data.data;
      setGraphData(responseData);
    }
  }, [
    fetchProductSearchPnLData.data?.data.data,
    fetchProductSearchPnLData.isSuccess,
  ]);

  const isDataLoading = useMemo(
    () =>
      fetchProductSearchPnLData.isLoading ||
      fetchProductSearchPnLData.isRefetching,
    [
      fetchProductSearchPnLData.isLoading,
      fetchProductSearchPnLData.isRefetching,
    ]
  );

  useEffect(() => {
    if (fetchProfitabilityProductLevelData.isSuccess) {
      const responseData = fetchProfitabilityProductLevelData.data.data.data;
      setGraphData(responseData);
    }
  }, [
    fetchProfitabilityProductLevelData.data?.data.data,
    fetchProfitabilityProductLevelData.isSuccess,
  ]);

  const isAmazonProductDataLoading = useMemo(
    () =>
      fetchProfitabilityProductLevelData.isLoading ||
      fetchProfitabilityProductLevelData.isRefetching,
    [
      fetchProfitabilityProductLevelData.isLoading,
      fetchProfitabilityProductLevelData.isRefetching,
    ]
  );

  const onMetricsSelect = (options: IMultiSelectDropdownItem[]) => {
    dispatch(setProfitabilityGraphMetricsFilters(options));
  };

  const generatedChartData = useMemo(
    () =>
      profitabilityUtils.generateChartData(
        graphData,
        selectedMetricsData,
        filters.graphFrequency.value
      ),
    [filters.graphFrequency.value, graphData, selectedMetricsData]
  );

  return (
    <div
      style={{
        width: 'max-content',
        display: 'flex',
        alignItems: 'start',
      }}
    >
      {renderGraphPopup()}
      <div className={styles.productSection}>
        {isLoading === true ? (
          <span
            style={{
              marginRight: '1rem',
            }}
          >
            <SkeletonComponent width={'6rem'} height={'8rem'} color="#f4f4f4" />
          </span>
        ) : (
          <ImgComponent
            imageURL={imgUrl}
            alt=""
            className={styles.productImage}
            isProduct={true}
          />
        )}

        {isLoading === true ? (
          <div className={styles.productDetails}>
            <SkeletonComponent
              width={'30rem'}
              height={'3rem'}
              color="#f4f4f4"
            />

            <span className={styles.divider}></span>
            <div className={styles.productMeta}>
              <span className={styles.metaText}>
                <SkeletonComponent
                  width={'6rem'}
                  height={'3rem'}
                  color="#f4f4f4"
                />
              </span>
              <span className={styles.vl}></span>
              <span className={styles.metaText}>
                <SkeletonComponent
                  width={'6rem'}
                  height={'3rem'}
                  color="#f4f4f4"
                />
              </span>
              <span className={styles.vl}></span>
              <SkeletonComponent
                width={'6rem'}
                height={'3rem'}
                color="#f4f4f4"
              />
              <span className={styles.vl}></span>
              <span className={styles.metaText}>
                <SkeletonComponent
                  width={'6rem'}
                  height={'3rem'}
                  color="#f4f4f4"
                />
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.productDetails}>
            <a
              className={styles.productName}
              href={getProductUrl(itemId, marketplace)}
              target="_blank"
              rel="noreferrer"
            >
              <HoverInfoTooltip title={name ?? itemId ?? sku}>
                {itemId === LOGO_ITEM_ID ? (
                  <span>{LOGO_ITEM_NAME}</span>
                ) : (
                  <span>{name ?? itemId ?? sku}</span>
                )}
              </HoverInfoTooltip>
            </a>

            <span className={styles.divider}></span>
            <div className={styles.productMeta}>
              <span className={styles.metaText}>
                <b>{marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'ID'}</b>
                &nbsp;{itemId ?? ''}
              </span>
              {checkIsNull(sku) === false && (
                <React.Fragment>
                  <span className={styles.vl}></span>
                  <HoverInfoTooltip title={sku ?? ''}>
                    <span className={styles.metaText}>
                      <b>SKU</b>&nbsp;{sku}
                    </span>
                  </HoverInfoTooltip>
                </React.Fragment>
              )}
              {checkIsNull(productPrice) === false &&
                itemId !== LOGO_ITEM_ID && (
                  <React.Fragment>
                    <span className={styles.vl}></span>
                    <span className={styles.metaText}>
                      {displayValue(formatNum(productPrice), false)}
                    </span>
                  </React.Fragment>
                )}

              {isHome === true && checkIsNull(sku) === false && (
                <React.Fragment>
                  <span className={styles.vl}></span>
                  <span onClick={handleUploadCOGSToggle}>
                    <span className={styles.COGSText}>COGS </span>
                    <span className={styles.COGSValue}>
                      {displayValue(formatNum(Math.abs(cogs ?? 0)), false)}
                    </span>
                  </span>
                </React.Fragment>
              )}

              {checkIsNull(sku) === false && itemId !== LOGO_ITEM_ID && (
                <UploadCOGSDialog
                  key={cogs ?? 0}
                  open={isUploadCOGSOpen}
                  onClose={handleUploadCOGSToggle}
                  imgUrl={imgUrl}
                  name={name}
                  sku={sku ?? ''}
                  itemId={itemId}
                  cogs={Math.abs(cogs ?? 0)}
                  marketplace={marketplace}
                />
              )}

              {showPerformance === true && checkIsNull(sku) === false && (
                <span className="flex items-center">
                  <span className={styles.vl}></span>
                  <TextButton
                    label={'Trends'}
                    handleClick={handleGraphToggle}
                    buttonStartIcon={<ChartLine size={'1.6rem'} />}
                    customStyles={{
                      fontSize: '1.15rem',
                      marginBottom: '0.1rem',
                      fontWeight: '500',
                    }}
                  />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderGraphPopup() {
    return (
      <Dialog
        open={isGraphOpen}
        onClose={handleGraphToggle}
        sx={{
          '& .MuiDialog-paper': {
            padding: '0',
            minWidth: '80%',
            height: '70%',
          },
        }}
      >
        <DialogTitle
          className={styles.graphTitle}
          sx={{
            padding: '1.5rem 2rem',
          }}
        >
          <span className="flex items-center gap-4">
            <ImgComponent
              imageURL={imgUrl}
              alt=""
              customStyles={{
                height: '3.5rem',
                width: 'auto',
                borderRadius: '0.1rem',
              }}
              isProduct={true}
            />
            <span style={{ fontSize: '1.3rem', fontWeight: '600' }}>
              {name}
            </span>
            <span className={`${styles.vl} m-0`}></span>
            <span className={styles.metaText}>
              <b>ID</b>&nbsp;{itemId ?? ''}
            </span>
            <span className={`${styles.vl} m-0`}></span>
            <span className={styles.metaText}>
              <b>SKU</b>&nbsp;{sku ?? ''}
            </span>
          </span>
          <IconButton
            onClick={handleGraphToggle}
            sx={{
              cursor: 'pointer',

              '&:hover': {
                background: 'rgba(0,0,0,0.1)',
              },
            }}
          >
            <XIcon size={'1.6rem'} weight="bold" color="white" />
          </IconButton>
        </DialogTitle>
        <div className="flex justify-between items-center mt-[1rem] mr-[1rem]">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,auto)',
              gap: '1rem',
            }}
          >
            {Boolean(itemInventory) && (
              <React.Fragment>
                <span className="flex flex-col items-center gap-1 ml-4 justify-end ">
                  <span
                    style={{
                      fontSize: '1.4rem',
                    }}
                  >
                    Item Inventory
                  </span>
                  <span
                    style={{
                      fontSize: '1.8rem',
                    }}
                  >
                    {itemInventory} Units
                  </span>
                </span>
                <span
                  style={{
                    height: '100%',
                    width: '1px',
                    background: '#dadeeb',
                    marginLeft: '1rem',
                  }}
                ></span>
              </React.Fragment>
            )}

            <span className="flex flex-col items-center gap-1 ml-4 justify-end ">
              <span
                style={{
                  fontSize: '1.4rem',
                }}
              >
                Product Price
              </span>
              <span
                style={{
                  fontSize: '1.8rem',
                }}
              >
                {displayValue(formatNum(productPrice), false)}
              </span>
            </span>
          </div>
          <span className="flex justify-end items-end gap-4">
            <Dropdown
              options={filterOptions.frequency}
              label="Frequency"
              width="14rem"
              selected={filters.frequency}
              onSelect={handleSelectFrequency}
            />
            <MultiSelectDropdown
              options={filterOptions.graphMetrics}
              label="Metrics"
              onSelect={onMetricsSelect}
              width="20rem"
              maxLimit={4}
              minLimit={1}
            />
          </span>
        </div>
        <Divider
          sx={{
            margin: '2rem 1rem',
            background: '#464646',
          }}
        />
        <DialogContent>
          {isDataLoading === true ||
          graphData === null ||
          isAmazonProductDataLoading ? (
            <span>
              <GraphLoadingComponent bars={20} yAxisPoints={5} />
              <span className="flex justify-center gap-2">
                {Array(4)
                  .fill('')
                  .map((_, index) => {
                    return (
                      <SkeletonComponent
                        key={index}
                        width={'10rem'}
                        height={'3rem'}
                        color="#f4f4f4"
                      />
                    );
                  })}
              </span>
            </span>
          ) : (
            <ProfitabilityGraph
              chartData={generatedChartData}
              selectedMetricsData={selectedMetricsData}
              formattedXAxisText={''}
              expandGraph={false}
              handleExpandClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              chartTitle={''}
              handleTableEmptyReset={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export default ProfitabilityProductDetails;
