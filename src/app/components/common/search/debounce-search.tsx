import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import React from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from './search-clear';

interface ISearchClearProps {
  placeholder?: string;
  searchText: string;
  setSearchText: (value: string) => void;
  height?: string;
}

export default function SearchText({
  placeholder,
  height,
  searchText,
  setSearchText,
}: ISearchClearProps) {
  const handleClearSearch = () => {
    setSearchText('');
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Search
      sx={{
        height: height ? height : 'initial',
        width: '30rem',
        borderRadius: '0.6rem',
      }}
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
        placeholder={placeholder ?? 'Search...'}
        value={searchText}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={
          searchText.length > 0 && (
            <h6
              style={{
                color: '#77469B',
                fontWeight: 700,
                cursor: 'pointer',
                marginRight: '1rem',
              }}
              onClick={() => {
                handleClearSearch();
                setSearchText('');
              }}
            >
              Clear
            </h6>
          )
        }
      />
    </Search>
  );
}
