import { IBulkAction } from 'src/interfaces/bulk-action.interface';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import BulkActions from '../bulk-actions/bulk-actions';
import PrimaryButton from '../primary-button/primary-button';
import { ITabData } from '../tabs-select/tabs-select';
import ViewEditTabs from '../view-edit-tabs/view-edit-tabs';
import styles from './view-edit-toggle.module.scss';

interface IViewEditToggleProps {
  tabValue: ITabData;
  tabData: ITabData[];
  handleTabChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: ITabData
  ) => void;
  toggleDisabled: boolean;
  disableReason?: string;
  showEditControls: boolean;
  buttonsDisabled?: boolean;
  handleCancelClick?: () => void;
  handleSaveClick?: () => void;
  isSaveDisabled?: boolean;
  isBulkActionsVisible: boolean;
  bulkActions: IBulkAction[];
  hideSaveCancelButtons?: boolean;
  hideClearAllButton?: boolean;
  totalItems: number | string;
}

export default function ViewEditToggle({
  tabValue,
  tabData,
  handleTabChange,
  toggleDisabled,
  disableReason,
  showEditControls,
  buttonsDisabled,
  handleCancelClick,
  handleSaveClick,
  isSaveDisabled,
  isBulkActionsVisible,
  bulkActions,
  hideSaveCancelButtons = false,
  hideClearAllButton = false,
  totalItems,
}: IViewEditToggleProps) {
  return (
    <div className={styles.container}>
      <ViewEditTabs
        tabValue={tabValue}
        handleTabChange={handleTabChange}
        tabData={tabData}
        toggleDisabled={toggleDisabled}
        disableReason={disableReason}
      />

      {showEditControls && (
        <BulkActions
          isVisible={isBulkActionsVisible}
          actions={bulkActions}
          hideClearAll={hideClearAllButton}
          totalItems={totalItems}
        />
      )}

      {showEditControls && !hideSaveCancelButtons && (
        <div
          className={`${styles.buttonsContainer} ${
            buttonsDisabled ? styles.disabled : ''
          }`}
        >
          <AltPrimaryButton
            buttonText="Cancel"
            width="auto"
            height="2.5rem"
            buttonFunction={handleCancelClick ?? (() => undefined)}
            disabled={buttonsDisabled ?? false}
            isNewDesign={true}
          />

          <PrimaryButton
            buttonText="Save"
            width="6rem"
            height="2.5rem"
            buttonFunction={handleSaveClick ?? (() => undefined)}
            disabled={isSaveDisabled ?? false}
            isNewDesign={true}
          />
        </div>
      )}
    </div>
  );
}
