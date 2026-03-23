import React from 'react';

import { ExpandMoreOutlined } from '@mui/icons-material';
import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Typography } from '@mui/material';

import colors from '@/styles/themes/colors';

interface DateRangePickerAccordionProps {
  title: string;
  children: React.ReactNode;
}

const DateRangePickerAccordion = ({ title, children }: DateRangePickerAccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    sx={{
      margin: 0,
    }}
  >
    <AccordionSummary
      sx={{
        backgroundColor: colors.white,
        color: colors.textPrimary,
        borderRadius: '10px',
        cursor: 'pointer',
        padding: '12px 8px',

        '&:hover': {
          backgroundColor: colors.bgHover,
        },
        '&[aria-expanded="true"]': {
          backgroundColor: colors.bgSubtle,
        },
      }}
      expandIcon={<ExpandMoreOutlined sx={{ color: colors.textPlaceholder, fontSize: '24px' }} />}
    >
      <Typography variant="body2" color={colors.textPrimary}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ padding: 0, margin: 0 }}>{children}</AccordionDetails>
  </MuiAccordion>
);

export default DateRangePickerAccordion;
