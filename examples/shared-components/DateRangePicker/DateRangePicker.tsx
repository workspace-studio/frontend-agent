import React, { useState } from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Button, IconButton, Menu, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import Calendar from '@/components/SvgIcons/Calendar';
import { CalendarQuickFilter, CalendarQuickFilterKey } from '@/config/calendarQuickFilters.config';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';

import CustomDateCalendar from './CustomDateCalendar';
import DateRangeQuickSelect from './DateRangeQuickSelect';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  handleDateChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  filters?: Record<CalendarQuickFilterKey, CalendarQuickFilter>;
  monthsShown?: 1 | 2;
}

const DateRangePicker = ({ startDate, endDate, handleDateChange, filters, monthsShown = 1 }: DateRangePickerProps) => {
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down(768));

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handlePrevMonth = () => setCurrentMonth(prev => prev.subtract(2, 'month'));

  const handleNextMonth = () => setCurrentMonth(prev => prev.add(2, 'month'));

  const handleDayClick = (date: Dayjs) => {
    if (startDate && startDate.isSame(date, 'day')) return;

    if (!startDate || (startDate && endDate)) {
      handleDateChange([date, null]);
    } else if (date.isBefore(startDate, 'day')) {
      handleDateChange([date, null]);
    } else {
      handleDateChange([startDate, date]);
      handleClose();
    }

    setSelectedFilterKey(null);
  };

  return (
    <>
      <Button
        id="calendar-button"
        aria-controls={open ? 'calendar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<Calendar fill={colors.grayBlue950} size={20} />}
        fullWidth={customBreakpoint}
        sx={{
          justifyContent: customBreakpoint ? 'space-between' : 'center',
          borderColor: colors.grayBlue200,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          color={startDate && endDate ? colors.grayBlue600 : colors.black100}
        >
          {startDate && endDate
            ? `${DateTime.formatHR(startDate)} - ${DateTime.formatHR(endDate)}`
            : `${DateTime.formatHR(DateTime.now())} - ${DateTime.formatHR(DateTime.addWeek(DateTime.now()))}`}
        </Typography>
      </Button>
      <Menu
        id="calendar-menu"
        aria-labelledby="calendar-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          marginBlock: 1,
          borderRadius: 1.5,
          '& .MuiMenu-list': {
            paddingTop: 2,
            paddingBottom: customBreakpoint ? 0 : 2,
            paddingInline: '16px !important',
          },
          '& .MuiPopover-paper': {
            width: '95%',
            maxWidth: '958px',
            boxShadow: '0px 4px 14px 0px rgba(0, 0, 0, 0.15)',
            '@media (max-width: 765px)': {
              width: '80% !important',
              left: '50% !important',
              transform: 'translateX(-50%) !important',
            },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Stack
          direction={customBreakpoint ? 'column' : 'row'}
          spacing={customBreakpoint ? 2 : 0}
          width="100%"
          height="100%"
        >
          {filters && (
            <Stack
              borderRight={customBreakpoint ? 'none' : `1px solid ${colors.grayBlue200}`}
              borderBottom={customBreakpoint ? `1px solid ${colors.grayBlue200}` : 'none'}
              paddingRight={customBreakpoint ? 0 : 2}
              paddingBottom={customBreakpoint ? 2 : 0}
              flex={1}
              maxWidth={customBreakpoint ? '100%' : 174}
            >
              <DateRangeQuickSelect
                filters={filters}
                selectedKey={selectedFilterKey as CalendarQuickFilterKey}
                onSelect={(key, [start, end]) => {
                  const startDayjs = dayjs(start);

                  setSelectedFilterKey(key);
                  handleDateChange([startDayjs, dayjs(end)]);
                  setCurrentMonth(startDayjs.startOf('month'));
                }}
              />
            </Stack>
          )}
          <Stack
            direction={customBreakpoint ? 'column' : 'row'}
            spacing={customBreakpoint ? 0 : 4}
            alignItems="center"
            pl={customBreakpoint ? 0 : 4}
            height="100%"
            flex={1}
          >
            <Stack width="100%" position="relative" height="100%">
              <IconButton onClick={handlePrevMonth} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                <ChevronLeft sx={{ fontSize: 24, color: colors.grayBlue400 }} />
              </IconButton>
              {monthsShown === 1 && (
                <IconButton onClick={handleNextMonth} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                  <ChevronRight sx={{ fontSize: 24, color: colors.grayBlue400 }} />
                </IconButton>
              )}
              <CustomDateCalendar
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                onDayClick={handleDayClick}
              />
            </Stack>
            {monthsShown === 2 && (
              <Stack width="100%" position="relative" height="100%">
                <IconButton onClick={handleNextMonth} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                  <ChevronRight sx={{ fontSize: 24, color: colors.grayBlue400 }} />
                </IconButton>
                <CustomDateCalendar
                  currentMonth={currentMonth.add(1, 'month')}
                  startDate={startDate}
                  endDate={endDate}
                  onDayClick={handleDayClick}
                />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Menu>
    </>
  );
};

export default DateRangePicker;
