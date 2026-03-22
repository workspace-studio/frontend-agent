import { SxProps, Theme } from '@mui/material';
import { LocalizationProvider, DateCalendar as MuiDateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import i18n from 'i18next';

import CustomDay from '@/components/DateRangePicker/CustomDay';
import theme from '@/styles/themes';
import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';

interface CustomDateCalendarProps {
  currentMonth: Dayjs;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDayClick: (date: Dayjs) => void;
  hoverDate?: Dayjs | null;
  onDayHover?: (date: Dayjs | null) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  shouldDisableDate?: (date: Dayjs) => boolean;
  size?: 'compact' | 'default';
}

const compactCalendarStyles: SxProps<Theme> = {
  width: '100%',
  overflow: 'visible',
  height: 'fit-content',
  maxHeight: 'fit-content',
  minWidth: '100%',
  [theme.breakpoints.up(1024)]: {
    minWidth: '336px',
  },
  '& .MuiDayCalendar-header': {
    pb: '12px',
  },
  '& .MuiDayCalendar-header > *': {
    flex: 1,
    fontSize: '12px',
    fontWeight: 600,
    color: colors.black600,
    margin: 'auto',
    p: '6px',
    minWidth: '22px',
    minHeight: '22px',
  },
  '& .MuiPickersDay-hiddenDaySpacingFiller': {
    flex: 1,
    margin: 'auto',
    p: '6px',
    minWidth: '22px',
    minHeight: '22px',
  },
  '& .MuiDayCalendar-monthContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  '& .MuiDayCalendar-weekContainer': {
    margin: 0,
  },
  '& .MuiPickersSlideTransition-root': {
    height: 'auto',
    paddingBottom: '24px',
    minHeight: '290px',
    overflow: 'visible',
  },
};

const defaultCalendarStyles: SxProps<Theme> = {
  width: '100%',
  overflow: 'visible',
  height: 'fit-content',
  maxHeight: 'fit-content',
  minWidth: { xs: '100%', sm: '336px' },
  maxWidth: { xs: '100%', sm: 'none' },
  '& .MuiDayCalendar-header': {
    pb: { xs: '8px', sm: '12px' },
  },
  '& .MuiDayCalendar-header > *': {
    flex: 1,
    ...typography.body2,
    color: colors.black600,
    margin: 'auto',
    p: { xs: '4px', sm: '6px' },
    minWidth: { xs: '18px', sm: '22px' },
    minHeight: { xs: '18px', sm: '22px' },
    textTransform: 'capitalize',
  },
  '& .MuiPickersDay-hiddenDaySpacingFiller': {
    flex: 1,
    margin: 'auto',
    p: { xs: '4px', sm: '6px' },
    minWidth: { xs: '18px', sm: '22px' },
    minHeight: { xs: '18px', sm: '22px' },
  },
  '& .MuiDayCalendar-monthContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: '8px', sm: '12px' },
  },
  '& .MuiDayCalendar-weekContainer': {
    margin: 0,
  },
  '& .MuiPickersSlideTransition-root': {
    height: 'auto',
    minHeight: { xs: '240px', sm: '276px' },
    overflow: 'visible',
  },
};

const compactHeaderStyles: SxProps<Theme> = {
  position: 'relative',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 'auto',
  margin: 0,
  '& .MuiPickersCalendarHeader-labelContainer': {
    margin: 'auto',
    flexDirection: 'row',
    gap: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiPickersCalendarHeader-label': {
    fontWeight: 600,
    fontSize: '18px',
    whiteSpace: 'nowrap',
    color: colors.black,
    margin: 0,
    cursor: 'default',
  },
  '& .MuiPickersArrowSwitcher-root': {
    display: 'none',
  },
};

const defaultHeaderStyles: SxProps<Theme> = {
  position: 'relative',
  padding: { xs: '4px 0', sm: '8px 0' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 'auto',
  margin: 0,
  '& .MuiPickersCalendarHeader-labelContainer': {
    margin: '0 auto',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    flexDirection: 'row',
    gap: { xs: '2px', sm: '4px' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
  },
  '& .MuiPickersCalendarHeader-label': {
    ...typography.h3,
    fontSize: { xs: '16px', sm: '18px' },
    fontWeight: 600,
    whiteSpace: 'nowrap',
    color: colors.black900,
    margin: 0,
    cursor: 'default',
  },
  '& .MuiPickersArrowSwitcher-root': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  '& .MuiPickersArrowSwitcher-button': {
    padding: { xs: '2px', sm: '4px' },
    '&:hover': {
      backgroundColor: colors.orange50,
    },
  },
  '& .MuiPickersArrowSwitcher-spacer': {
    display: 'none',
  },
};

const CustomDateCalendar = ({
  currentMonth,
  startDate,
  endDate,
  onDayClick,
  hoverDate,
  onDayHover,
  onPreviousMonth,
  onNextMonth,
  shouldDisableDate,
  size = 'compact',
}: CustomDateCalendarProps) => {
  const isCompact = size === 'compact';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      <MuiDateCalendar
        key={currentMonth.format('YYYY-MM')}
        value={null}
        referenceDate={currentMonth}
        views={['day']}
        dayOfWeekFormatter={date => date.format('ddd')}
        disableHighlightToday
        sx={isCompact ? compactCalendarStyles : defaultCalendarStyles}
        slots={{
          ...(isCompact && {
            leftArrowIcon: () => null,
            rightArrowIcon: () => null,
          }),
          // eslint-disable-next-line react/no-unstable-nested-components
          day: props => (
            <CustomDay
              {...props}
              startDate={startDate}
              endDate={endDate}
              onDayClick={onDayClick}
              hoverDate={hoverDate}
              onDayHover={onDayHover}
              shouldDisableDate={shouldDisableDate}
              size={size}
            />
          ),
        }}
        slotProps={{
          calendarHeader: {
            sx: isCompact ? compactHeaderStyles : defaultHeaderStyles,
          },
          ...(onPreviousMonth && {
            previousIconButton: {
              onClick: onPreviousMonth,
            },
          }),
          ...(onNextMonth && {
            nextIconButton: {
              onClick: onNextMonth,
            },
          }),
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateCalendar;
