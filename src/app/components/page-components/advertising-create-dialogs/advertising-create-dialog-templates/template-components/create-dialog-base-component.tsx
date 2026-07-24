import InfoIcon from '@/app/components/common/info-icon/info-icon';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import {
  AmazonAdvertisingTableTypesEnum,
  WalmartAdvertisingTableTypeEnum,
} from '@/enums/advertising.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IEntityTypes } from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { useAppDispatch } from '@/redux/hooks';
import {
  setBidLimitErr,
  setTableRowErrMessage,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { formatNum } from '@/utils';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { NoteIcon, TrashIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { getEntitySpecificString } from 'src/utils/advertising.utils';
import { CreateDialog } from '../../advertising-create-dialogs-styles';
import styles from '../../advertising-create-dialogs.module.scss';

interface ICreateDialogBaseComponentProps<T> {
  children: JSX.Element;
  handleAdditionalClear: () => void;
  openDialog: boolean;
  handleCloseDialog: () => void;
  initialAddedEntityCount: number;
  maxEntityCount: number;
  handleCreateEntity: () => void;
  isCreateDisabled: boolean;
  isCreateLoading: boolean;
  isInitialDataLoading?: boolean;
  addedListTableData: Array<T>;
  addedListCount: number;
  addedListTableColumns: Array<ColumnDef<T>>;
  entityType: IEntityTypes;
  isAddedTableLoading: boolean;
}

export default function CreateDialogBaseComponent<T>({
  children,
  handleAdditionalClear,
  openDialog,
  handleCloseDialog,
  initialAddedEntityCount,
  maxEntityCount,
  handleCreateEntity,
  isCreateDisabled,
  isCreateLoading,
  isInitialDataLoading,
  addedListTableData,
  addedListTableColumns,
  entityType,
  isAddedTableLoading,
  addedListCount,
}: ICreateDialogBaseComponentProps<T>) {
  const formattedInitialAddedEntityCount = useMemo(
    () => formatNum(initialAddedEntityCount, false),
    [initialAddedEntityCount]
  );
  const formattedMaxEntityCount = useMemo(
    () => formatNum(maxEntityCount, false),
    [maxEntityCount]
  );
  const formattedAddedListCount = useMemo(
    () => formatNum(addedListCount, false),
    [addedListCount]
  );

  const dispatch = useAppDispatch();

  const entityTypeTitle = useMemo(
    () => getEntitySpecificString(entityType),
    [entityType]
  );

  const isTargeting = useMemo(
    () =>
      entityType !== AmazonAdvertisingTableTypesEnum.PRODUCT_ADS &&
      entityType !== WalmartAdvertisingTableTypeEnum.AD_ITEM,
    [entityType]
  );

  const handleClearAll = () => {
    handleAdditionalClear();

    const emptyMsg = {
      id: '',
      message: '',
    };
    dispatch(setBidLimitErr(emptyMsg));
    dispatch(setTableRowErrMessage(emptyMsg));
  };

  const handleCancelClick = () => {
    handleClearAll();
    handleCloseDialog();
  };

  return (
    <CreateDialog
      onClose={handleCancelClick}
      aria-labelledby="create-dialog"
      aria-describedby="create-dialog-description"
      open={openDialog}
      maxWidth="lg"
    >
      {isCreateLoading === true && <CustomEditLoader />}
      {isInitialDataLoading === true && (
        <CustomEditLoader overlayText="Please wait..." />
      )}
      <CreateDialogTitle id="create-dialog">
        <div className={styles.titleTextContainer}>
          <Typography
            fontSize="2.4rem"
            fontWeight={700}
            lineHeight="100%"
            letterSpacing="-1%"
            alignSelf="center"
          >
            Add {entityTypeTitle.title}
            {isTargeting === true && ' Targets'}
            {maxEntityCount !== undefined && (
              <span className={styles.totalCount}>
                {formattedInitialAddedEntityCount}/{formattedMaxEntityCount}
              </span>
            )}
          </Typography>
          {maxEntityCount !== undefined && (
            <InfoIcon
              title={`“${formattedInitialAddedEntityCount}/${formattedMaxEntityCount}” - ${formattedInitialAddedEntityCount} is the number of ${entityTypeTitle.body}s already added to the list and ${formattedMaxEntityCount} is the maximum number of ${entityTypeTitle.body}s we can add.`}
              position={TooltipPlacement.Right}
            />
          )}
        </div>

        <div className={styles.titleButtonContainer}>
          <SecondaryButton
            buttonText="Cancel"
            height="3.2rem"
            width="auto"
            buttonFunction={handleCancelClick}
            isButtonIconRequired={false}
            disabled={false}
          />

          <PrimaryButton
            buttonText="Add"
            width="5.5rem"
            height="3.2rem"
            buttonFunction={handleCreateEntity}
            isButtonIconRequired={false}
            disabled={isCreateDisabled}
          />
        </div>
      </CreateDialogTitle>

      <Divider />

      <DialogContent
        id="create-dialog-description"
        className={styles.descriptionContainer}
        sx={{
          padding: '0 !important',
          gap: 0,
          display: 'flex',
          flex: 1,
        }}
      >
        {children}

        <div className={styles.vl}></div>

        <div className={styles.dataContainer}>
          <div className={styles.dataHeader}>
            <Typography fontSize="2rem" fontWeight={700} lineHeight="24.2px">
              Added {entityTypeTitle.title} {isTargeting === true && ' Targets'}{' '}
              {addedListCount > 0 && (
                <span className={styles.totalCount}>
                  {formattedAddedListCount}
                </span>
              )}
            </Typography>

            <SecondaryButton
              buttonText="Clear All"
              height="3rem"
              width="auto"
              buttonFunction={handleClearAll}
              isButtonIconRequired={true}
              buttonIcon={
                <TrashIcon
                  size={'1.5rem'}
                  color={addedListTableData.length <= 0 ? '#dadeeb' : '#464646'}
                />
              }
              disabled={addedListTableData.length <= 0}
            />
          </div>

          <div className={styles.addedListContainer}>
            <CustomTableWrapper
              data={addedListTableData}
              columns={addedListTableColumns}
              getRowId={(row) => `${(row as any)?.id}`}
              width="100%"
              height="100%"
              borderRadius="8px"
              isLoading={isAddedTableLoading}
              disableSorting={true}
              enableRowSelection={false}
              isPaginationRequired={false}
              pagination={{ pageIndex: 0, pageSize: addedListTableData.length }}
              noResultsOverlay={
                <div
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#8b8b8b',
                  }}
                >
                  <NoteIcon size={'2rem'} color="#8b8b8b" weight="fill" />
                  <p>
                    There isn't any {entityTypeTitle.body} added in the list
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </DialogContent>
    </CreateDialog>
  );
}

interface ICreateDialogTitleProps {
  id: string;
  children?: React.ReactNode;
}
export function CreateDialogTitle(props: ICreateDialogTitleProps) {
  const { id, children, ...other } = props;

  return (
    <DialogTitle
      id={id}
      sx={{
        height: '8rem',
        width: '100%',
        m: 0,
        p: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      {...other}
    >
      {children}
    </DialogTitle>
  );
}
