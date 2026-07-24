import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartAdGroup } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  SbAdGroupLevelTitles,
  SdAdGroupLevelTitles,
  SpAdGroupLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSVAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import AddAdsProductDialog from './add-ads-product-dialog/add-ads-product-dialog';
import CreateNegTargetingKeywordDialog from './create-neg-targeting-keyword-dialog/create-neg-targeting-keyword-dialog';
import CreateNegTargetingProductDialog from './create-neg-targeting-product-dialog/create-neg-targeting-product-dialog';
import CreateAmazonKeywordTargetsDialog from './create-targeting-keyword/create-amazon-keyword-targets';
import CreateTargetingProductDialog from './create-targeting-product-dialog/create-targeting-product-dialog';
import WalmartAddKeywordsDialog from './walmart-keyword-dialog/walmart-keyword-dialog';
import WalmartAddProductsDialog from './walmart-product-ads-dialog/walmart-product-ads-dialog';

interface IAdvertisingCreateDialogsProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedTitle: string;
  selectedCampaignId: string | number;
  selectedAdGroupId: string | number;
  walmartTargeting?: TargetingTypeEnum;
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup
    | null;
}

export default function AdvertisingCreateDialogs({
  openDialog,
  handleCloseDialog,
  selectedTitle,
  selectedCampaignId,
  selectedAdGroupId,
  walmartTargeting,
  selectedAdGroup,
}: IAdvertisingCreateDialogsProps) {
  if (selectedAdGroup) {
    if (
      selectedTitle === SpAdGroupLevelTitles.PRODUCT_ADS ||
      selectedTitle === SdAdGroupLevelTitles.PRODUCT_ADS
    ) {
      return (
        <AddAdsProductDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup}
        />
      );
    }

    if (
      selectedTitle === WalmartSPAdGroupLevelTitles.AD_ITEMS ||
      selectedTitle === WalmartSBAdGroupLevelTitles.AD_ITEMS ||
      selectedTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS
    ) {
      return (
        <WalmartAddProductsDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          walmartTargeting={walmartTargeting}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup}
        />
      );
    }

    if (
      selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD ||
      selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD
    ) {
      return (
        <CreateNegTargetingKeywordDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup}
        />
      );
    }

    if (
      selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT ||
      selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT
    ) {
      return (
        <CreateNegTargetingProductDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup as IAdGroup | ISBAdGroup}
        />
      );
    }

    if (
      selectedTitle === SpAdGroupLevelTitles.PRODUCT_TARGETING ||
      selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING
    ) {
      return (
        <CreateTargetingProductDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup as IAdGroup | ISBAdGroup}
        />
      );
    }

    if (
      selectedTitle === WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING ||
      selectedTitle === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING ||
      selectedTitle === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING
    ) {
      return (
        <WalmartAddKeywordsDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={selectedAdGroup}
        />
      );
    }

    if (
      selectedTitle === SpAdGroupLevelTitles.KEYWORD_TARGETING ||
      selectedTitle === SbAdGroupLevelTitles.KEYWORD_TARGETING
    ) {
      return (
        <CreateAmazonKeywordTargetsDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedCampaignId={selectedCampaignId}
          selectedAdGroupId={selectedAdGroupId}
          selectedTitle={selectedTitle}
          selectedAdGroup={
            selectedAdGroup as IAdGroup | ISBAdGroup | ISDAdGroup
          }
        />
      );
    }
  }
}
