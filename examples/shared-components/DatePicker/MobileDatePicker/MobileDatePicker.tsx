import { FormControl } from '@mui/material';
import { LocalizationProvider, MobileDatePicker as MuiMobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'i18next';

import { CustomDaySlot, DatePickerBaseProps, getHeaderSlotProps } from '@/components/DatePicker/DatePicker';
import Calendar from '@/components/SvgIcons/Calendar';
import { DATE_FORMAT_HR } from '@/config/date-time.config';
import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';
import DateTime from '@/utils/static/DateTime';

const MobileDatePicker = ({
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
        <MuiMobileDatePicker
          format={format || DATE_FORMAT_HR}
          value={resolvedValue}
          onChange={onChange}
          disabled={disabled}
          label={label}
          views={views}
          openTo={openTo}
          minDate={minDate}
          maxDate={maxDate}
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
          }}
          {...props}
        />
      </FormControl>
    </LocalizationProvider>
  );
};

export default MobileDatePicker;
