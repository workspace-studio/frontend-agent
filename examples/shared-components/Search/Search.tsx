import { ChangeEvent, useEffect, useRef, useState } from 'react';

import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton, InputAdornment, SxProps, TextField, Theme } from '@mui/material';
import debounce from 'lodash.debounce';

import SearchIcon from '@/components/SvgIcons/Search';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disableDebounce?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const Search = ({ value, onChange, placeholder, disableDebounce = false, fullWidth, sx }: SearchProps) => {
  const [searchValue, setSearchValue] = useState(value);
  const { isMobile } = useBreakpoint();
  const onChangeRef = useRef(onChange);
  const debouncedRef = useRef(debounce((val: string) => onChangeRef.current(val), 500));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setSearchValue(newValue);

    if (disableDebounce) {
      onChange(newValue);
    } else {
      debouncedRef.current(newValue);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    debouncedRef.current.cancel();
    onChange('');
  };

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  return (
    <TextField
      value={searchValue}
      variant="outlined"
      placeholder={placeholder}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon size={24} fill={colors.borderColor} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ visibility: searchValue ? 'visible' : 'hidden' }}>
              <IconButton aria-label="Clear" onClick={handleClear} size="small">
                <ClearOutlinedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          inputProps: {
            inputMode: 'search',
          },
        },
      }}
      fullWidth={fullWidth || isMobile}
      sx={sx}
    />
  );
};

export default Search;
