import { FormControl, Stack } from '@mui/material';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'i18next';

import Calendar from '@/components/SvgIcons/Calendar';
import { DATE_FORMAT_HR } from '@/config/date-time.config';
import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';
import DateTime from '@/utils/static/DateTime';

export interface DatePickerBaseProps extends MuiDatePickerProps {
  hasDefaultValue?: boolean;
  calendarHeaderFormat?: string;
  toolbarFormat?: string;
}

export const calendarHeaderSx = {
  position: 'relative' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 0',
  minHeight: 'auto',
  margin: 0,
  '& .MuiPickersCalendarHeader-labelContainer': {
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '16px',
    fontWeight: 700,
    color: colors.grayBlue950,
    margin: 0,
    textTransform: 'capitalize' as const,
    pointerEvents: 'none' as const,
  },
  '& .MuiPickersCalendarHeader-switchViewButton': { display: 'none' },
  '& .MuiPickersArrowSwitcher-root': { width: '100%', display: 'flex', justifyContent: 'space-between' },
  '& .MuiPickersArrowSwitcher-spacer': { display: 'none' },
  '& .MuiPickersArrowSwitcher-button': { padding: '4px', color: colors.grayBlue400 },
};

export const pickerDaySx = {
  borderRadius: '50%',
  ...typography.body2,
  fontWeight: 600,
  color: colors.grayBlue950,
  minWidth: 36,
  minHeight: 36,
  margin: 'auto',
  p: '6px',
  '&:hover': { backgroundColor: colors.orange200 },
  '&.Mui-selected': {
    backgroundColor: colors.orange500,
    color: colors.white,
    '&:hover': { backgroundColor: colors.orange600 },
  },
  '&.MuiPickersDay-today:not(.Mui-selected)': {
    backgroundColor: colors.grayBlue50,
    color: colors.grayBlue950,
    border: 'none',
  },
  '&.Mui-disabled': { backgroundColor: 'transparent', color: colors.black200, fontWeight: 400, pointerEvents: 'none' },
};

export const getHeaderSlotProps = (calendarHeaderFormat?: string) => ({
  ...(calendarHeaderFormat && { format: calendarHeaderFormat }),
  sx: calendarHeaderSx,
});

export const CustomDaySlot = (dayProps: PickersDayProps) => (
  <Stack flex={1} justifyContent="center" alignItems="center">
    <PickersDay {...dayProps} sx={pickerDaySx} />
  </Stack>
);

const DatePicker = ({
  hasDefaultValue = true,
  value,
  onChange,
  disabled,
  calendarHeaderFormat,
  toolbarFormat,
  label,
  format,
  views,
  openTo,
  minDate,
  maxDate,
  referenceDate,
  ...props
}: DatePickerBaseProps) => {
  const getResolvedValue = () => {
    if (hasDefaultValue) return value?.isValid?.() ? value : DateTime.now();

    return value?.isValid?.() ? value : null;
  };

  const resolvedValue = getResolvedValue();

  // eslint-disable-next-line no-console
  console.log('DatePicker render', { label, hasDefaultValue, valueValid: value?.isValid?.(), resolvedValue: resolvedValue?.format?.() });
  const headerSlotProps = getHeaderSlotProps(calendarHeaderFormat);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      <FormControl fullWidth>
        <MuiDatePicker
          format={format || DATE_FORMAT_HR}
          value={resolvedValue}
          onChange={onChange}
          disabled={disabled}
          label={label}
          views={views}
          openTo={openTo}
          minDate={minDate}
          maxDate={maxDate}
          referenceDate={referenceDate}
          slots={{
            openPickerIcon: Calendar,
            day: CustomDaySlot,
          }}
          slotProps={{
            mobilePaper: { sx: { margin: 0 } },
            openPickerIcon: { fill: disabled ? colors.grayBlue200 : colors.grayBlue600 },
            toolbar: {
              ...(toolbarFormat && { toolbarFormat }),
              sx: {
                '& .MuiDatePickerToolbar-title': {
                  ...typography.h3,
                  color: colors.black900,
                },
              },
            },
            field: { clearable: true },
            actionBar: {
              sx: {
                display: 'flex',
                flexDirection: 'row !important',
                gap: 1,
                '& .MuiButton-root': { flex: 1 },
              },
            },
            textField: {
              sx: {
                '& .MuiPickersInputBase-sectionsContainer': {
                  color: disabled ? colors.grayBlue200 : colors.grayBlue600,
                },
              },
            },
            calendarHeader: headerSlotProps,
            popper: {
              sx: {
                '& .MuiPaper-root': { padding: 2, margin: 0, borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)' },
                '& .MuiDateCalendar-root': { width: '100%', maxHeight: 'none', height: 'auto' },
                '& .MuiPickersSlideTransition-root': { minHeight: '260px' },
              },
              modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
            },
            layout: {
              sx: {
                '& .MuiDayCalendar-weekDayLabel': {
                  ...typography.body2,
                  color: colors.black600,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                },
                '& .MuiDayCalendar-header > *': {
                  flex: 1,
                  textTransform: 'capitalize',
                },
                '& .MuiPickersDay-hiddenDaySpacingFiller': { flex: 1 },
                '& .MuiDayCalendar-weekContainer': { margin: 0 },
                '& .MuiDayCalendar-monthContainer': { display: 'flex', flexDirection: 'column', gap: '8px' },
              },
            },
          }}
          {...props}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export default DatePicker;
