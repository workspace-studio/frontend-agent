import React, { useMemo } from 'react';

import { ExpandMoreRounded } from '@mui/icons-material';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Autocomplete as MuiAutocomplete,
  TextField,
  TextFieldProps as TextFieldPropsType,
  Typography,
} from '@mui/material';

export interface AutocompleteOption {
  id: string;
  label: string;
}

export interface AutocompleteProps {
  value: string;
  options: AutocompleteOption[];
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
  filteredOptions?: AutocompleteOption[];
  TextFieldProps?: TextFieldPropsType;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  options,
  onChange,
  onInputChange,
  label,
  disabled,
  renderOption,
  filteredOptions,
  TextFieldProps,
}) => {
  const selectedValue = useMemo(
    () => (value ? options.find(option => option.id === value) : undefined),
    [options, value]
  );

  const handleIsOptionEqualToValue = (option: AutocompleteOption, inputValue: AutocompleteOption) =>
    option.id === inputValue.id && option.label === inputValue.label;

  const getOptionDisabled = (option: AutocompleteOption) =>
    filteredOptions?.every(filteredOption => filteredOption.id !== option.id) || false;

  const handleChange = (_: React.SyntheticEvent, newValue: AutocompleteOption | null) => {
    onChange(newValue?.id || '');
  };

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    if (onInputChange) {
      onInputChange(newInputValue);
    }
  };

  return (
    <FormControl fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <MuiAutocomplete
        value={selectedValue || null}
        options={options}
        onChange={handleChange}
        noOptionsText="No matches"
        popupIcon={<ExpandMoreRounded />}
        onInputChange={handleInputChange}
        isOptionEqualToValue={handleIsOptionEqualToValue}
        getOptionDisabled={getOptionDisabled}
        disabled={disabled}
        renderInput={params => {
          const { slotProps, ...restTextFieldProps } = TextFieldProps || {};

          return (
            <TextField
              {...params}
              {...restTextFieldProps}
              slotProps={{
                ...params.slotProps,
                ...slotProps,
                input: {
                  ...params.slotProps?.input,
                  ...slotProps?.input,
                },
              }}
            />
          );
        }}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            {renderOption ? renderOption(option) : <Typography variant="body2">{option.label}</Typography>}
          </MenuItem>
        )}
      />
    </FormControl>
  );
};

export default Autocomplete;
