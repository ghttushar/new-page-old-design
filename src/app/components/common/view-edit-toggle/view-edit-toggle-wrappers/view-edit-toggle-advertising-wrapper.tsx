import { MarketplaceEnum } from '@/enums/serp.enums';
import { DISABLE_TOOLTIP } from '@/enums/tooltip-texts.enums';
import { IBulkActionContext } from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdGroup,
  ISBCampaign,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  ISDAdGroup,
  ISDCampaign,
} from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  ICampaign,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IWalmartAdGroup,
  IWalmartCampaign,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVCampaign,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import accessControlUtils from '@/utils/access-control/access-control.utils';
import { useMemo } from 'react';
import { ADVERTISING_BULK_ACTION_RULES } from 'src/constants/advertising-bulk-action-rules.constants';
import { WalmartSBCampaignLevelTitles } from 'src/enums/advertising.enums';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { IBulkAction } from 'src/interfaces/bulk-action.interface';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectBidLimitErr,
  selectDailyBudgetLimitErr,
  selectNameErr,
  selectTotalBudgetLimitErr,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  checkIsEditDisableByReviewStatus,
  checkIsObjectEmpty,
  checkIsWalmartCampaign,
  checkIsWalmartKT,
} from 'src/utils/advertising.utils';
import { ITabData } from '../../tabs-select/tabs-select';
import ViewEditToggle from '../view-edit-toggle';

interface IViewEditToggleAdvertisingWrapperProps extends IEditBulkActionProp {
  tabValue: ITabData;
  tabData: ITabData[];
  onTabChange: (value: ITabData) => void;
  buttonsDisabled: boolean;
  toggleButtonDisabled?: boolean;
  toggleButtonDisableReason?: string;
  handleCancelClick: () => void;
  handleSaveClick: () => void;
  title: string;
  selectedTargetingType?: string;
  selectedCampaign:
    | ICampaign
    | ISBCampaign
    | ISDCampaign
    | IWalmartCampaign
    | IWalmartSVCampaign
    | null
    | undefined;
  selectedAdGroup:
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartAdGroup
    | IWalmartSVAdGroup
    | null
    | undefined;
  totalItems: number | string;
}

export default function ViewEditToggleAdvertisingWrapper({
  tabValue,
  tabData,
  onTabChange,
  buttonsDisabled,
  toggleButtonDisabled,
  toggleButtonDisableReason,
  handleCancelClick,
  handleSaveClick,
  setTableData,
  title,
  selectedTargetingType,
  selectedCampaign,
  selectedAdGroup,
  totalItems,
}: IViewEditToggleAdvertisingWrapperProps) {
  const dailyBudgetLimitErr = useAppSelector(selectDailyBudgetLimitErr);
  const totalBudgetLimitErr = useAppSelector(selectTotalBudgetLimitErr);
  const bidLimitErr = useAppSelector(selectBidLimitErr);
  const nameErrMsg = useAppSelector(selectNameErr);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const hasAdminManagerAccess = accessControlUtils.hasAdminManagerAccess();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as MarketplaceEnum,
    [advertisingAccount]
  );

  const isWalmartCampaign = useMemo(
    () => checkIsWalmartCampaign(title),
    [title]
  );

  const isWalmartKT = useMemo(() => checkIsWalmartKT(title), [title]);

  const bulkActionContext: IBulkActionContext = useMemo(
    () => ({
      title,
      selectedTargetingType: selectedTargetingType ?? '',
      selectedMarketplace,
      isWalmartCampaign,
      isWalmartKT,
    }),
    [
      title,
      selectedTargetingType,
      selectedMarketplace,
      isWalmartCampaign,
      isWalmartKT,
    ]
  );

  const bulkActions: IBulkAction[] = useMemo(
    () =>
      ADVERTISING_BULK_ACTION_RULES.filter((rule) =>
        rule.isVisible(bulkActionContext)
      ).map((rule) => ({
        key: rule.key,
        node: rule.render(bulkActionContext, setTableData),
      })),
    [bulkActionContext, setTableData]
  );

  const isBulkActionsVisible = useMemo(
    () => title !== WalmartSBCampaignLevelTitles.BRANDS,
    [title]
  );

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedCampaign) {
      return checkIsEditDisableByReviewStatus(selectedCampaign);
    }

    if (selectedAdGroup) {
      return checkIsEditDisableByReviewStatus(selectedAdGroup);
    }

    return false;
  }, [selectedAdGroup, selectedCampaign]);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: ITabData
  ) => {
    onTabChange(value);
  };

  const toggleDisabled =
    !hasAdminManagerAccess ||
    isEditDisabledByReviewStatus ||
    !!toggleButtonDisabled;

  const disableReason = !hasAdminManagerAccess
    ? DISABLE_TOOLTIP.ADMIN_MANAGER_ACCESS
    : isEditDisabledByReviewStatus
    ? DISABLE_TOOLTIP.CAMPAIGN_REVIEW
    : toggleButtonDisabled && toggleButtonDisableReason
    ? toggleButtonDisableReason
    : undefined;

  const isSaveDisabled =
    buttonsDisabled ||
    !checkIsObjectEmpty(dailyBudgetLimitErr) ||
    !checkIsObjectEmpty(totalBudgetLimitErr) ||
    !checkIsObjectEmpty(bidLimitErr) ||
    !checkIsObjectEmpty(nameErrMsg);

  return (
    <ViewEditToggle
      tabValue={tabValue}
      tabData={tabData}
      handleTabChange={handleTabChange}
      toggleDisabled={toggleDisabled}
      disableReason={disableReason}
      showEditControls={tabValue.value === EditAccessValues.Edit}
      buttonsDisabled={buttonsDisabled}
      handleCancelClick={handleCancelClick}
      handleSaveClick={handleSaveClick}
      isSaveDisabled={isSaveDisabled}
      isBulkActionsVisible={isBulkActionsVisible}
      bulkActions={bulkActions}
      totalItems={totalItems}
    />
  );
}
