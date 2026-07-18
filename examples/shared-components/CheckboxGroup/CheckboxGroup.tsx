import React from 'react';

import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Typography } from '@mui/material';

import CheckboxChecked from '@/components/SvgIcons/CheckboxChecked';
import CheckboxUnchecked from '@/components/SvgIcons/CheckboxUnchecked';

export interface CheckboxOption {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  value: string[];
  options: CheckboxOption[];
  onChange: (value: string[]) => void;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, onChange, value, label, labelPlacement }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: selectedValue, checked } = event.target;

    if (checked) {
      onChange([...value, selectedValue]);
    } else {
      onChange(value.filter(val => val !== selectedValue));
    }
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      {label && <FormLabel sx={{ pb: 0 }}>{label}</FormLabel>}
      <Grid container>
        {options.map(option => (
          <Grid key={option.value} size={{ xs: 6, sm: 4 }}>
            <FormControlLabel
              value={option.value}
              label={<Typography variant="body2">{option.label}</Typography>}
              control={
                <Checkbox
                  checked={value.includes(option.value)}
                  icon={<CheckboxUnchecked />}
                  checkedIcon={<CheckboxChecked />}
                  onChange={handleChange}
                  sx={{ mr: 0.5 }}
                />
              }
              labelPlacement={labelPlacement}
              sx={{ mt: 1, mb: 1, ml: 0 }}
            />
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
};

export default CheckboxGroup;
