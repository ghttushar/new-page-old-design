import TextButton from '@/app/components/common/text-button/text-button';
import {
  addDataBoxStyles,
  addDataTextFieldStyles,
  adTextButtonStyles,
} from '@/app/components/page-components/advertising-create-dialogs/advertising-create-dialogs-styles';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { NoteIcon, XIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { KeywordTrackerDataTestIds } from 'cypress/enums/keyword-tracker';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import MultiSelectDropdown from 'src/app/components/common/dropdown/multi-select-dropdown';
import { marketplaceOptions } from 'src/constants/sov.filter.constants';
import { BULK_UPLOAD_SAMPLE_FILE } from 'src/constants/urls.constants';
import { QueryKeyEnums } from 'src/enums/query.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IChannel, ISerpKeyword } from 'src/interfaces/serp.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { useAppMutation } from 'src/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import KeywordTrackerService from 'src/services/market-intelligence/keyword-tracker.service';
import { processKeywords, uniqueKeywords } from 'src/utils/advertising.utils';
import {
  BootstrapDialog,
  buttonCloseStyles,
  buttonSaveStyles,
} from './add-keyword-page-styles';
import styles from './add-keyword-page.module.scss';

interface IDialogTitleProps {
  id: string;
  children?: React.ReactNode;
}

function BootstrapDialogTitle(props: IDialogTitleProps) {
  const { children, ...other } = props;

  return (
    <DialogTitle
      sx={{
        height: '7.5rem',
        m: 0,
        p: '1rem 1rem 1rem 3.2rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      {...other}
    >
      {children}
    </DialogTitle>
  );
}

interface IAddKeywordPageProps {
  closeDialog: () => void;
  selectedRegion: CountryCodeEnum;
}

const AddKeywordPage: React.FC<IAddKeywordPageProps> = ({
  closeDialog,
  selectedRegion,
}) => {
  const [keywords, setKeywords] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedMarketplace, setSelectedMarketplace] = useState<
    IMultiSelectDropdownItem[]
  >([]);
  const [chips, setChips] = useState<string[]>([]);
  const [disableUpload, setDisableUpload] = useState(true);
  const [isTextFieldDisabled, setIsTextFieldDisabled] =
    useState<boolean>(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { mutateAsync: addKeywordMutate, isPending: isAddPending } =
    useAppMutation({
      mutationFn: (payload: ISerpKeyword[]) =>
        KeywordTrackerService.addKeyword({ keywords: payload }),
      options: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.KEYWORD_TRACKER_FETCH],
          });

          dispatch(
            showSuccessToastMessage({
              title: data.data.message,
            })
          );
        },
      },
    });

  const { mutateAsync: addBulkKeywordMutate, isPending: isAddBulkPending } =
    useAppMutation({
      mutationFn: (payload: File) =>
        KeywordTrackerService.bulkUploadKeyword(payload),
      options: {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.KEYWORD_TRACKER_FETCH],
          });

          dispatch(
            showSuccessToastMessage({
              title: data.data.message,
            })
          );
        },
      },
    });

  const handleSave = async () => {
    if (chips.length) {
      const _selectedMarketplaces = selectedMarketplace.filter(
        (item) => item.selected === true
      );
      if (!_selectedMarketplaces.length) {
        dispatch(
          showErrorToastMessage({
            title: 'Marketplace not selected.',
            description: 'Please select at least one marketplace.',
          })
        );
        return;
      }

      const payload: ISerpKeyword[] = chips.map((chip) => {
        return {
          keyword: chip,
          channels: selectedMarketplace
            .filter((item) => item.selected)
            .map<IChannel>((item) => ({
              channel: item.value as MarketplaceEnum,
              isActive: true,
              isArchived: false,
              countryCodes: [selectedRegion],
            })),
        };
      });

      await addKeywordMutate(payload);
      closeDialog();
    } else if (uploadFile !== null && typeof uploadFile === 'object') {
      await addBulkKeywordMutate(uploadFile);
      closeDialog();
    } else {
      dispatch(
        showErrorToastMessage({
          title: 'No Keywords.',
          description: 'Please enter at least one keyword.',
        })
      );
    }
  };

  const disableUploadButton = () => {
    setDisableUpload(true);
    setIsTextFieldDisabled(false);
    setIsUploadDisabled(false);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(event.target.value);
    setIsUploadDisabled(true);
    setIsTextFieldDisabled(false);

    if (event.target.value === '') {
      setIsUploadDisabled(false);
      setIsTextFieldDisabled(false);
    }
  };

  const handleDownload = () => {
    dispatch(
      showSuccessToastMessage({
        title: 'Downloaded Successfully',
      })
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (keywords.trim() === '') {
        return;
      }

      const [validKeywords, invalidKeywords] = processKeywords(keywords);

      if (validKeywords.length === 0) {
        dispatch(
          showErrorToastMessage({
            title: 'Invalid Input',
            description: 'Please enter valid keyword.',
          })
        );
        return;
      }
      const uniqueNewKeywords = uniqueKeywords(validKeywords, chips);

      if (uniqueNewKeywords?.length === 0) {
        return dispatch(
          showErrorToastMessage({
            title: 'Warning!!!',
            description: 'Keyword(s) already listed to be tracked.',
          })
        );
      }
      setChips((prevChips) => [...prevChips, ...uniqueNewKeywords]);
      setKeywords(invalidKeywords.join(', '));
      setDisableUpload(false);
      if (invalidKeywords.length > 0) {
        dispatch(
          showErrorToastMessage({
            title: 'Some Keywords Ignored',
            description: 'Some keywords were invalid and not added',
          })
        );
      }
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    if (chips.length - 1 === 0) {
      disableUploadButton();
    }
    setChips((prevChips) => prevChips.filter((chip) => chip !== chipToDelete));
  };

  const handleDeleteAllChips = () => {
    setChips([]);
    disableUploadButton();
  };

  const removeUploadedFile = () => {
    setUploadFile(null);
    disableUploadButton();
  };
  const handleMarketplaceSelect = (
    selectedOptions: IMultiSelectDropdownItem[]
  ) => {
    setSelectedMarketplace(selectedOptions);
  };

  useEffect(() => {
    setSelectedMarketplace(marketplaceOptions);
  }, []);
  return (
    <BootstrapDialog
      onClose={closeDialog}
      aria-labelledby="add-keyword-title"
      aria-describedby="add-keyword-description"
      data-test={KeywordTrackerDataTestIds.ADD_KEYWORD_DIALOG}
      open={true}
      sx={{
        '.MuiPaper-root': {
          maxHeight: 'unset',
        },
      }}
    >
      <BootstrapDialogTitle id="add-keyword-title">
        <Typography
          fontSize="2.4rem"
          fontWeight={700}
          sx={{ height: 'auto', alignSelf: 'center' }}
        >
          Upload keyword
        </Typography>
        <DialogActions
          sx={{
            padding: '0 !important',
          }}
        >
          <Button
            variant="contained"
            id="close-button"
            autoFocus
            onClick={closeDialog}
            sx={buttonCloseStyles}
          >
            Close
          </Button>
          <LoadingButton
            data-test="track-keywords-button"
            variant="contained"
            autoFocus
            disableRipple
            onClick={handleSave}
            sx={buttonSaveStyles}
            loading={isAddPending || isAddBulkPending}
            disabled={isAddPending || isAddBulkPending || disableUpload}
            loadingIndicator="Saving..."
          >
            Track Keywords
          </LoadingButton>
        </DialogActions>
      </BootstrapDialogTitle>
      <Divider />
      <DialogContent id="add-keyword-description">
        <Box marginBottom={2}>
          <MultiSelectDropdown
            options={selectedMarketplace}
            label={'Select Marketplace'}
            onSelect={handleMarketplaceSelect}
            width="20rem"
            disabled={selectedRegion !== CountryCodeEnum.UnitedStates}
          />
        </Box>

        <Box
          data-test={KeywordTrackerDataTestIds.ENTER_KEYWORDS_INPUT}
          marginBottom={2}
        >
          <Typography variant="body1" fontSize="1.2rem">
            Enter the Keywords you want to track
          </Typography>
          <div className={styles.chipBoxContainer}>
            <TextField
              multiline
              fullWidth
              rows={4}
              value={keywords}
              sx={addDataTextFieldStyles}
              style={{
                border: isTextFieldDisabled
                  ? '1px solid #d8d8d8'
                  : '1px solid #77469b',
              }}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter keywords separated by commas"
              disabled={isTextFieldDisabled}
            />
            <Box sx={addDataBoxStyles}>
              {chips &&
                chips.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    onDelete={() => handleDeleteChip(chip)}
                    style={{ margin: '5px' }}
                  />
                ))}
            </Box>
          </div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: '5px',
            }}
          >
            <Typography fontSize="0.9rem" color="#7d7d7d">
              Press <b>Enter</b> to add keywords
            </Typography>

            <TextButton
              customStyles={adTextButtonStyles}
              label="Clear All"
              handleClick={handleDeleteAllChips}
              isDisabled={chips.length > 0 ? false : true}
              disableReason="No keywords added"
            />
          </Box>
        </Box>

        <Box
          data-test={KeywordTrackerDataTestIds.BULK_UPLOAD_CONTAINER}
          className={styles.bulkUploadContainer}
        >
          <div
            className={styles.deleteFile}
            style={{
              visibility: uploadFile ? 'visible' : 'hidden',
            }}
            onClick={removeUploadedFile}
          >
            <XIcon size={'1.6rem'} color="red" />
          </div>
          <Dropzone
            accept={{
              'text/csv': ['.csv'],
            }}
            multiple={false}
            onDrop={(acceptedFiles) => {
              try {
                if (acceptedFiles[0].type !== 'text/csv') {
                  throw new Error();
                }
                setUploadFile(acceptedFiles[0]);
                setDisableUpload(false);
                setIsUploadDisabled(false);
                setIsTextFieldDisabled(true);

                if (!acceptedFiles.length) {
                  setIsUploadDisabled(false);
                  setIsTextFieldDisabled(true);
                }
              } catch (err) {
                dispatch(
                  showErrorToastMessage({
                    title: 'Wrong File Type',
                    description: 'Only CSV files are allowed',
                  })
                );
              }
            }}
            disabled={isUploadDisabled}
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                className={`${styles.bulkUploadBox} ${
                  isUploadDisabled ? styles.disabled : ''
                }`}
              >
                <input {...getInputProps()} disabled={isUploadDisabled} />
                <NoteIcon size={30} color="#77469b" />

                {uploadFile === null ? (
                  <React.Fragment>
                    <Typography
                      variant="caption"
                      fontSize="1.2rem"
                      fontWeight={700}
                      color="#77469b"
                      lineHeight="1.5rem"
                      letterSpacing="-0.02rem"
                    >
                      Bulk Upload
                    </Typography>

                    <Typography
                      variant="caption"
                      fontSize="1.2rem"
                      fontWeight={500}
                      color="#77469b"
                      lineHeight="1.16rem"
                      letterSpacing="-0.016rem"
                    >
                      + Click or drag to upload file
                    </Typography>
                  </React.Fragment>
                ) : (
                  <Typography
                    variant="caption"
                    fontSize="1.2rem"
                    fontWeight={700}
                    color="#4CA6F3"
                    lineHeight="1.5rem"
                    letterSpacing="-0.02rem"
                  >
                    {uploadFile.name}
                  </Typography>
                )}
              </Box>
            )}
          </Dropzone>

          <Typography
            data-test={KeywordTrackerDataTestIds.DOWNLOAD_FILE_CONTAINER}
            onClick={handleDownload}
            variant="caption"
            fontSize="1.2rem"
            fontWeight={700}
          >
            <Link
              className={styles.downloadLink}
              underline="always"
              href={BULK_UPLOAD_SAMPLE_FILE}
              download="sample-add-keywords-bulk.csv"
            >
              Download Template
            </Link>
            , for the bulk upload
          </Typography>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default AddKeywordPage;
