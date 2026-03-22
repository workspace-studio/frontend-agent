import React from 'react';

import { ExpandMoreRounded } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import cx from 'clsx';

export interface SelectOption {
  id: string;
  label: string | React.ReactElement;
}

export interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent) => void;
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  sx?: SxProps<Theme>;
}

const Select = ({ value, options, onChange, placeholder, label, error, sx }: SelectProps) => {
  const displayValue = value === 'all' ? '' : value;

  return (
    <FormControl fullWidth variant="filled">
      {label && <InputLabel id={label}>{label}</InputLabel>}
      <MuiSelect
        labelId={label}
        onChange={onChange}
        value={displayValue}
        IconComponent={ExpandMoreRounded}
        error={!!error}
        displayEmpty={!label}
        sx={sx}
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
        className={cx({
          'has-value': value && value !== '' && value !== 'all',
          'has-label': !!label,
        })}
        renderValue={selected => {
          if (!selected || selected === '' || value === 'all') {
            return (
              <Typography variant="body1" sx={{ color: 'inherit' }}>
                {placeholder}
              </Typography>
            );
          }

          const option = options.find(opt => opt.id === selected);

          return option?.label || selected;
        }}
      >
        <MenuItem disabled value="" sx={{ '&.Mui-selected': { backgroundColor: 'transparent' } }}>
          <Typography variant="body1">{placeholder}</Typography>
        </MenuItem>
        {options.map(option => (
          <MenuItem key={option.id} value={option.id}>
            <Typography
              variant="body1"
              sx={{
                fontStyle: option.id === 'all' ? 'italic' : 'normal',
              }}
            >
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText error={!!error}>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
