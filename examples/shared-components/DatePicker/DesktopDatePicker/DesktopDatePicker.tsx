import { FormControl } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker as MuiDesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'i18next';

import { CustomDaySlot, DatePickerBaseProps, getHeaderSlotProps } from '@/components/DatePicker/DatePicker';
import Calendar from '@/components/SvgIcons/Calendar';
import { DATE_FORMAT_HR } from '@/config/date-time.config';
import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';
import DateTime from '@/utils/static/DateTime';

const gridBaseSx = {
  '& .MuiDayCalendar-header > *': {
    flex: 1,
    ...typography.body2,
    color: colors.textLabel,
    fontWeight: 600,
    margin: 'auto',
    textTransform: 'capitalize',
  },
  '& .MuiPickerDay-fillerCell': { flex: 1, margin: 'auto' },
  '& .MuiDayCalendar-weekContainer': { margin: 0 },
  '& .MuiDayCalendar-monthContainer': { display: 'flex', flexDirection: 'column', gap: '8px' },
};

const popperSx = {
  '& .MuiPaper-root': { padding: 2, margin: 0, borderRadius: '12px', boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.15)' },
  '& .MuiDateCalendar-root': { width: '100%', maxHeight: 'none', height: 'auto' },
  '& .MuiPickersSlideTransition-root': { minHeight: '260px' },
};

const layoutSx = {
  '& .MuiDayCalendar-weekDayLabel': {
    ...typography.body2,
    color: colors.textLabel,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  ...gridBaseSx,
};

const DesktopDatePicker = ({
  hasDefaultValue = true,
  value,
  onChange,
  disabled,
  calendarHeaderFormat,
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
    if (hasDefaultValue) return value || DateTime.now();

    return value?.isValid?.() ? value : null;
  };

  const resolvedValue = getResolvedValue();
  const headerSlotProps = getHeaderSlotProps(calendarHeaderFormat);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      <FormControl fullWidth>
        <MuiDesktopDatePicker
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
          slots={{ openPickerIcon: Calendar, day: CustomDaySlot }}
          slotProps={{
            openPickerIcon: { fill: disabled ? colors.borderColor : colors.textSecondary },
            field: { clearable: true },
            textField: {
              sx: {
                '& .MuiPickersInputBase-sectionsContainer': {
                  color: disabled ? colors.borderColor : colors.textSecondary,
                },
              },
            },
            calendarHeader: headerSlotProps,
            popper: {
              sx: popperSx,
              modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
            },
            layout: { sx: layoutSx },
          }}
          {...props}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export default DesktopDatePicker;
