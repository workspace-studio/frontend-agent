import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AutocompleteRenderOptionState,
  ButtonBase,
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Autocomplete as MuiAutocomplete,
  TextField,
  TextFieldProps as TextFieldPropsType,
} from '@mui/material';
import cx from 'clsx';

import Close from '@/components/SvgIcons/Close';

import SearchOptionItem from './SearchOptionItem';

import styles from './AutocompleteMultipleChip.module.scss';

export interface AutocompleteOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  group?: string;
}

export interface AutocompleteMultipleChipProps {
  value: string[];
  options: AutocompleteOption[];
  onChange: (value: string[]) => void;
  placeholder: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  renderOption?: (option: AutocompleteOption, state: AutocompleteRenderOptionState) => React.ReactNode;
  filteredOptions?: AutocompleteOption[];
  TextFieldProps?: TextFieldPropsType;
  valueField?: 'id' | 'label';
  error?: boolean;
  helperText?: string;
  limitTags?: number;
  wrapChips?: boolean;
}

const AutocompleteMultipleChip = ({
  inputValue,
  value,
  options,
  onChange,
  placeholder,
  onInputChange,
  disabled,
  filteredOptions,
  valueField = 'id',
  label,
  error,
  helperText,
  limitTags = 4,
  wrapChips = false,
}: AutocompleteMultipleChipProps) => {
  const { t } = useTranslation('common');
  const [isFocused, setIsFocused] = useState(false);

  const selectedOptions = options.filter(option => value.includes(option[valueField]));
  const selectedSet = new Set(value);

  const uniqueOptions = options.reduce((acc, option) => {
    if (!acc.some(existing => existing.id === option.id)) {
      acc.push(option);
    }

    return acc;
  }, [] as AutocompleteOption[]);

  const selected = uniqueOptions.filter(option => selectedSet.has(option[valueField]));
  const nonSelected = uniqueOptions.filter(option => !selectedSet.has(option[valueField]));
  const sortedOptions = [...selected, ...nonSelected];

  const hasValue = selectedOptions.length > 0;

  const handleChange = (_event: React.SyntheticEvent, newValue: AutocompleteOption[]) => {
    onChange(newValue.map(option => option[valueField]));
  };

  const handleClearValues = () => {
    onChange([]);

    if (onInputChange) {
      onInputChange('');
    }
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string, reason: string) => {
    if (reason === 'input' && onInputChange) {
      onInputChange(newInputValue);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isOptionEqualToValue = (option: AutocompleteOption, optionValue: AutocompleteOption) =>
    option.id === optionValue.id;

  const getOptionDisabled = (option: AutocompleteOption) =>
    filteredOptions?.every(filteredOption => filteredOption.id !== option.id) ?? false;

  return (
    <FormControl
      fullWidth
      error={error}
      className={cx(styles.formControl, {
        [styles.focused]: isFocused,
        [styles.withValue]: hasValue,
        [styles.disabled]: disabled,
      })}
    >
      {label && <FormLabel>{label}</FormLabel>}
      {hasValue && !disabled && (
        <div className={cx(styles.clearButton, { [styles.noLabel]: !label })}>
          <InputAdornment position="end">
            <IconButton onClick={handleClearValues} size="small" className={styles.iconButton}>
              <Close size={20} />
            </IconButton>
          </InputAdornment>
        </div>
      )}
      <MuiAutocomplete
        multiple
        disableClearable
        disableCloseOnSelect
        limitTags={limitTags}
        forcePopupIcon={false}
        value={selectedOptions}
        options={sortedOptions}
        inputValue={inputValue}
        classes={{ root: cx(styles.root, { [styles.wrapChips]: wrapChips }), paper: styles.paper }}
        onChange={handleChange}
        onInputChange={handleInputChange}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionDisabled={getOptionDisabled}
        getOptionLabel={option => option.label}
        noOptionsText={t('no-matches')}
        disabled={disabled}
        renderValue={(selectedValues, getItemProps) =>
          selectedValues.map((option, index) => {
            const { key, onDelete, ...chipProps } = getItemProps({ index });

            return (
              <Chip
                key={key}
                label={option.label}
                onDelete={onDelete}
                deleteIcon={
                  <ButtonBase onClick={onDelete}>
                    <Close size={16} />
                  </ButtonBase>
                }
                {...chipProps}
              />
            );
          })
        }
        renderInput={params => (
          <TextField
            {...params}
            className={styles.input}
            placeholder={hasValue ? '' : placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            error={error}
            helperText={helperText}
            slotProps={{
              input: {
                ...params.slotProps?.input,
              },
            }}
          />
        )}
        renderOption={(props, option, state) => {
          const { ...otherProps } = props;

          return (
            <SearchOptionItem
              key={option.id}
              label={option.label}
              icon={option.icon}
              selected={state.selected}
              props={otherProps}
            />
          );
        }}
        slotProps={{
          clearIndicator: {
            sx: { display: 'none' },
          },
          popper: {
            placement: 'bottom-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          },
        }}
      />
    </FormControl>
  );
};

export default AutocompleteMultipleChip;
