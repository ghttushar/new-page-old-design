import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import {
  AmazonAdvertisingTableTypesEnum,
  CampaignStateEnum,
} from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { IRadioSelect } from '@/interfaces/advertising/advertising.interface';
import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IChipBasedEntityTypes,
  ICreateKeyword,
  IEntityTypes,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { IWalmartAdGroup } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { showErrorToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { formatNum, getCurrencySymbolByCountry, getValidNumber } from '@/utils';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  checkIsDuplicateKeywordPresent,
  getEntitySpecificString,
  hasCostTypeProp,
  hasCreativeTypeProp,
  processKeywords,
  uniqueKeywords,
} from '@/utils/advertising.utils';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import {
  addDataBoxStyles,
  addDataTextFieldStyles,
  checkboxStyles,
  customBidStyles,
  matchTypeLabelStyles,
} from '../../advertising-create-dialogs-styles';
import styles from '../../advertising-create-dialogs.module.scss';

interface ICreateChipTemplateProps {
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup;
  handlePopulateAddedList: (newList: Array<ICreateKeyword>) => void;
  isCustomBidRequired: boolean;
  minBidLimit?: number;
  areMatchTypeOptionsRequired: boolean;
  matchTypeRadioOptions?: IRadioSelect<string>[];
  initialKeywordList: Array<IChipBasedEntityTypes>;
  addedListTableData: Array<ICreateKeyword>;
  entityType: IEntityTypes;
  handleTriggerGetNormalizedKeywords?: (
    addedKeywords: ICreateKeyword[]
  ) => void;
}

export default function CreateChipTemplate({
  selectedAdGroup,
  handlePopulateAddedList,
  isCustomBidRequired,
  minBidLimit,
  areMatchTypeOptionsRequired,
  matchTypeRadioOptions,
  initialKeywordList,
  addedListTableData,
  entityType,
  handleTriggerGetNormalizedKeywords,
}: ICreateChipTemplateProps) {
  const dispatch = useAppDispatch();
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const entityTypeTitle = useMemo(
    () => getEntitySpecificString(entityType),
    [entityType]
  );

  const costType =
    selectedAdGroup && hasCostTypeProp(selectedAdGroup)
      ? selectedAdGroup.costType
      : undefined;

  const creativeType =
    selectedAdGroup && hasCreativeTypeProp(selectedAdGroup)
      ? selectedAdGroup.creativeType
      : undefined;

  const targetingType = selectedAdGroup
    ? selectedAdGroup.targetingType
    : undefined;

  const initialMatchTypes =
    areMatchTypeOptionsRequired &&
    matchTypeRadioOptions !== undefined &&
    matchTypeRadioOptions.length
      ? matchTypeRadioOptions
      : undefined;

  const initialCustomBid =
    isCustomBidRequired && minBidLimit !== undefined ? minBidLimit : undefined;

  const [entityName, setEntityName] = useState<string>('');
  const [chips, setChips] = useState<string[]>([]);
  const [matchTypes, setMatchTypes] = useState<
    IRadioSelect<string>[] | undefined
  >(initialMatchTypes);
  const [matchTypeError, setMatchTypeError] = useState<boolean>(false);
  const [customBid, setCustomBid] = useState<number | undefined>(
    initialCustomBid
  );
  const [customBidError, setCustomBidError] = useState<string>('');
  const [customBidOverSpendMsg, setCustomBidOverSpendMsg] =
    useState<string>('');

  const handleTextInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEntityName(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (entityName.trim() === '') {
        return;
      }
      const [validEntityNames, invalidEntityNames] =
        processKeywords(entityName);

      if (validEntityNames.length === 0) {
        dispatch(
          showErrorToastMessage({
            title: 'Invalid Input',
            description: `Please enter valid ${entityTypeTitle.body}.`,
          })
        );
        return;
      }

      const uniqueNewEntities = uniqueKeywords(validEntityNames, chips);
      if (uniqueNewEntities.length === 0) {
        dispatch(
          showErrorToastMessage({
            title: 'Warning!!!',
            description: `${entityTypeTitle.body} already listed to be ${
              entityType ===
                AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD ||
              entityType ===
                AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT
                ? 'negated'
                : 'tracked'
            }.`,
          })
        );
        return;
      }
      setChips((prevChips) => [...prevChips, ...uniqueNewEntities]);
      setEntityName(invalidEntityNames.join(', '));

      if (invalidEntityNames.length > 0) {
        dispatch(
          showErrorToastMessage({
            title: `Some ${entityTypeTitle.body}s Ignored`,
            description: `Some ${entityTypeTitle.body}s were invalid and not added`,
          })
        );
      }
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    setChips(chips.filter((chip) => chip !== chipToDelete));
  };

  const handleMatchTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (matchTypes === undefined) return;

    const updatedTypes = matchTypes.map((type) => {
      if (type.value === event.target.name) {
        return {
          ...type,
          selected: event.target.checked,
        };
      }

      return type;
    });

    setMatchTypes(updatedTypes);

    const selectedLength = updatedTypes.filter(
      (type) => type.selected === true
    ).length;
    setMatchTypeError(selectedLength < 1);
  };

  const handleCustomBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const bidValue = getValidNumber(event.target.valueAsNumber) as number;
    setCustomBid(bidValue);

    const minLimitErrMsg = checkBidValueMinLimit(
      advertisingAccount.marketplace,
      advHeaderFilters.adType.value,
      targetingType,
      parseFloat(event.target.value),
      costType,
      creativeType
    );

    const maxLimitErrMsg = checkBidValueMaxLimit(
      advertisingAccount.marketplace,
      advHeaderFilters.adType.value,
      targetingType,
      parseFloat(event.target.value),
      costType,
      creativeType
    );

    if (minLimitErrMsg) setCustomBidError(minLimitErrMsg);
    else if (maxLimitErrMsg) setCustomBidError(maxLimitErrMsg);
    else if (isNaN(parseFloat(event.target.value)))
      setCustomBidError('Bid cannot be empty.');
    else setCustomBidError('');

    if (parseFloat(event.target.value) >= 2)
      setCustomBidOverSpendMsg(
        'Bid is unusually high. Verify to avoid overspending'
      );
    else setCustomBidOverSpendMsg('');
  };

  const handleClearInput = () => {
    setChips([]);
    setMatchTypes(initialMatchTypes);
    setMatchTypeError(false);
    setCustomBid(initialCustomBid);
    setCustomBidError('');
  };

  const handleAddEntities = async () => {
    const selectedMatchTypes =
      matchTypes?.filter((type) => type.selected) ?? null;
    let newAddedEntities: ICreateKeyword[] = [];

    if (selectedMatchTypes !== null) {
      newAddedEntities = chips
        .flatMap((chip) =>
          selectedMatchTypes.map((type) => {
            return {
              id: crypto.randomUUID(),
              status:
                advertisingAccount.marketplace === MarketplaceEnum.WALMART
                  ? WalmartCampaignStatusEnum.ENABLED
                  : CampaignStateEnum.ENABLED,
              entityName: chip,
              normalizedKeyword:
                advertisingAccount.marketplace === MarketplaceEnum.WALMART
                  ? 'UNAVAILABLE'
                  : undefined,
              matchType: type,
              suggestedBid:
                advertisingAccount.marketplace === MarketplaceEnum.WALMART
                  ? '-'
                  : undefined,
              customBid: customBid,
            } as ICreateKeyword;
          })
        )
        .filter(
          (keyword) =>
            !addedListTableData.find(
              (added) =>
                added.entityName === keyword.entityName &&
                added.matchType === keyword.matchType
            )
        );
    } else {
      chips.forEach((chip) => {
        newAddedEntities.push({
          id: crypto.randomUUID(),
          status:
            advertisingAccount.marketplace === MarketplaceEnum.WALMART
              ? WalmartCampaignStatusEnum.ENABLED
              : CampaignStateEnum.ENABLED,
          entityName: chip,
          customBid: customBid,
        });
      });
    }

    const { existingKeywords, uniqueKeywords } = checkIsDuplicateKeywordPresent(
      newAddedEntities,
      initialKeywordList,
      entityType
    );

    existingKeywords.forEach((keyword) => {
      dispatch(
        showErrorToastMessage({
          title: 'Warning!!!',
          description: `"${keyword.entityName}" is already present${
            keyword.matchType
              ? ` for match type ${keyword.matchType} in the targeting table.`
              : ' in the targeting table.'
          }`,
        })
      );
    });

    if (handleTriggerGetNormalizedKeywords) {
      if (uniqueKeywords.length > 0) {
        const intermediateKeywords = [...addedListTableData, ...uniqueKeywords];
        handleTriggerGetNormalizedKeywords(intermediateKeywords);
      }
    } else {
      handlePopulateAddedList([...addedListTableData, ...uniqueKeywords]);
    }

    setChips([]);
    setMatchTypeError(false);
    setCustomBidError('');
  };

  return (
    <div className={styles.componentsContainer}>
      <div className={styles.boxContainer}>
        <TextField
          sx={addDataTextFieldStyles}
          multiline
          fullWidth
          minRows={1}
          maxRows={4}
          value={entityName}
          onChange={handleTextInputChange}
          onKeyDown={handleKeyPress}
          placeholder={`Enter ${entityTypeTitle.body}s you want to ${
            entityType ===
              AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD ||
            entityType ===
              AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT
              ? 'negate'
              : 'track'
          }`}
        />

        <Typography fontSize="1rem" color="#464646" sx={{ my: '0.5rem' }}>
          Press <b>Enter</b> to add {entityTypeTitle.body}s to{' '}
          {entityType ===
            AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD ||
          entityType ===
            AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT
            ? 'negate'
            : 'track'}{' '}
          {chips.length > 0 ? <b>({formatNum(chips.length, false)})</b> : ''}
        </Typography>

        <Box sx={addDataBoxStyles}>
          {chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              onDelete={() => handleDeleteChip(chip)}
              style={{ margin: '5px' }}
            />
          ))}
        </Box>
      </div>

      <div className={styles.inputContainer}>
        {areMatchTypeOptionsRequired === true && matchTypes !== undefined && (
          <FormControl
            required
            component="fieldset"
            error={matchTypeError}
            sx={{
              width: '100%',
              m: 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '4rem',
            }}
            variant="standard"
          >
            <FormLabel sx={matchTypeLabelStyles}>Match Type</FormLabel>
            <div className={styles.inputErrorCheckContainer}>
              <FormGroup
                row
                sx={{
                  position: 'relative',
                }}
              >
                {matchTypes &&
                  matchTypes.length > 0 &&
                  matchTypes.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={option.selected}
                          onChange={handleMatchTypeChange}
                          name={option.value}
                          sx={checkboxStyles}
                        />
                      }
                      label={option.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '1.3rem',
                          fontWeight: 400,
                        },
                      }}
                    />
                  ))}
              </FormGroup>
              {matchTypeError ? (
                <p
                  className={styles.errorText}
                  style={{ marginTop: '-0.5rem' }}
                >
                  At least one option must be selected
                </p>
              ) : (
                ''
              )}
            </div>
          </FormControl>
        )}

        {isCustomBidRequired === true && customBid !== undefined && (
          <div className={styles.customBidContainer}>
            <InputLabel
              htmlFor="customBid"
              required
              sx={{
                ...matchTypeLabelStyles,
                '& .MuiFormLabel-asterisk': {
                  color: customBidError !== '' ? 'red' : 'inherit',
                },
              }}
            >
              Custom Bid
            </InputLabel>

            <div className={styles.inputErrorCheckContainer}>
              <TextField
                value={customBid}
                error={customBidError !== ''}
                type="number"
                id="customBid"
                variant="outlined"
                sx={customBidStyles}
                onChange={handleCustomBidChange}
                InputProps={{
                  inputProps: {
                    min: minBidLimit,
                  },
                  startAdornment: getCurrencySymbolByCountry(),
                }}
              />
              {customBidError !== '' ? (
                <p className={styles.errorText}>{customBidError}</p>
              ) : customBidOverSpendMsg !== '' ? (
                <p className={styles.errorText} style={{ color: 'orange' }}>
                  {customBidOverSpendMsg}
                </p>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <SecondaryButton
          buttonText="Clear"
          height="3.2rem"
          width="auto"
          buttonFunction={handleClearInput}
          isButtonIconRequired={false}
          disabled={false}
        />

        <PrimaryButton
          buttonText="Add"
          height="3.2rem"
          buttonFunction={handleAddEntities}
          isButtonIconRequired={false}
          disabled={
            !(
              chips.length > 0 &&
              matchTypeError === false &&
              customBidError === ''
            )
          }
        />
      </div>
    </div>
  );
}
