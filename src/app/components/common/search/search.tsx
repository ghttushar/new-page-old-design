import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { searchButtonStyles, searchStyles } from './search-styles';

interface ISearchProps {
  searchText: string;
  handleSearchText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
  width?: string;
  height?: string;
  placeHolder?: string;
  borderRadius?: string;
}

export default function Search({
  searchText,
  handleSearchText,
  handleSearchClick,
  width,
  height,
  placeHolder = 'Search',
  borderRadius = '0.4rem',
}: ISearchProps) {
  return (
    <TextField
      id="search"
      variant="outlined"
      type="text"
      name="search"
      placeholder={placeHolder}
      sx={{ ...searchStyles(width, height, borderRadius) }}
      value={searchText}
      onChange={handleSearchText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              disableRipple
              aria-label="search"
              title="Search"
              size="large"
              sx={{ ...searchButtonStyles(height, borderRadius) }}
              onClick={handleSearchClick}
            >
              <MagnifyingGlassIcon size={16} color="#A2A2A2" weight="bold" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
