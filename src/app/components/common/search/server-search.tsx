import { outlinedTextBoxAltStyles } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { GlobalDataTestIds } from 'cypress/enums/global';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectSearchText,
  setSearchText,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { getSearchPlaceholder } from 'src/utils/advertising.utils';

interface ISearchProps {
  isNewDesign: boolean;
}

export const Search = styled('div', {
  shouldForwardProp: (prop) => !['isNewDesign'].includes(prop as string),
})<ISearchProps>(({ theme, isNewDesign }) => ({
  ...outlinedTextBoxAltStyles(),
  position: 'relative',
  backgroundColor: '#ffffff',
  height: '2.5rem',
  marginLeft: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  borderColor: '#d1d5db',
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1rem',
    fontWeight: 500,
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
}));

interface ISearchClearProps {
  title: string;
  height?: string;
  width?: string;
  handleCustomSearchChange?: () => void;
  isNewDesign?: boolean;
}

export default function ServerSearch({
  title,
  height,
  width,
  handleCustomSearchChange,
  isNewDesign = false,
}: ISearchClearProps) {
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(selectSearchText);

  const [searchValue, setSearchValue] = useState<string>(searchText);
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    dispatch(setSearchText(searchValue.trim()));
    if (handleCustomSearchChange) handleCustomSearchChange();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    dispatch(setSearchText(''));
  };

  useEffect(() => {
    setSearchPlaceholder(getSearchPlaceholder(title));
  }, [title]);

  useEffect(() => setSearchValue(searchText), [searchText]);

  return (
    <Search
      sx={{
        height: height ? height : '3rem',
        width: width ? width : '30rem',
      }}
      isNewDesign={isNewDesign}
      data-test={GlobalDataTestIds.SEARCH_WRAPPER}
    >
      <SearchIconWrapper>
        <MagnifyingGlassIcon
          size={14}
          weight="bold"
          color="#23272D"
          opacity={'40%'}
        />
      </SearchIconWrapper>
      <StyledInputBase
        sx={{ width: width || '30rem' }}
        placeholder={`${searchPlaceholder}`}
        value={searchValue}
        onChange={handleChange}
        onKeyUp={handleKeyPress}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={
          searchValue.trim().length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h6
                style={{
                  color: '#77469B',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
                onClick={handleSearch}
              >
                Search
              </h6>
              <h6
                style={{
                  color: '#77469B',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginRight: '1rem',
                }}
                onClick={handleClearSearch}
              >
                Clear
              </h6>
            </div>
          )
        }
      />
    </Search>
  );
}
