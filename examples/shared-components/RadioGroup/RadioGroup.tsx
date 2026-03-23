import React from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  Radio,
  Typography,
} from '@mui/material';

import RadioChecked from '@/components/SvgIcons/RadioChecked';
import RadioUnchecked from '@/components/SvgIcons/RadioUnchecked';
import colors from '@/styles/themes/colors';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
}

export interface RadioGroupProps {
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  disabled?: boolean;
}

const RadioGroup = ({ options, onChange, value, label, labelPlacement, disabled }: RadioGroupProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      {label && (
        <FormLabel>
          <Typography variant="body2" color={colors.textPlaceholder}>
            {label}
          </Typography>
        </FormLabel>
      )}
      <MuiRadioGroup onChange={handleChange} value={value} row>
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={
              <Typography variant="body2" color={colors.textTertiary}>
                {option.label}
              </Typography>
            }
            control={<Radio icon={<RadioUnchecked />} checkedIcon={<RadioChecked />} />}
            labelPlacement={labelPlacement}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
};

export default RadioGroup;
