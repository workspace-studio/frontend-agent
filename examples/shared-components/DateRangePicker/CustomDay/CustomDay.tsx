import { Stack, useMediaQuery } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface CustomDayProps extends PickersDayProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDayClick: (date: Dayjs) => void;
  hoverDate?: Dayjs | null;
  onDayHover?: (date: Dayjs | null) => void;
  shouldDisableDate?: (date: Dayjs) => boolean;
  size?: 'compact' | 'default';
}

const CustomDay = ({
  day,
  outsideCurrentMonth,
  startDate,
  endDate,
  onDayClick,
  hoverDate,
  onDayHover,
  shouldDisableDate,
  size = 'compact',
  ...other
}: CustomDayProps) => {
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const hasHover = !!onDayHover;

  const isWeekendOrCustomDisabled = shouldDisableDate ? shouldDisableDate(day) : false;
  const isDisabled = outsideCurrentMonth || isWeekendOrCustomDisabled;

  const isStart = startDate?.isSame(day, 'day');
  const isEnd = endDate?.isSame(day, 'day');
  const isHoverEnd = hasHover && !endDate && hoverDate?.isSame(day, 'day');

  const isInActualRange = hasHover
    ? startDate && endDate && day.isSameOrAfter(startDate, 'day') && day.isSameOrBefore(endDate, 'day')
    : startDate && endDate && day.isAfter(startDate, 'day') && day.isBefore(endDate, 'day');

  const isInHoverRange =
    hasHover &&
    startDate &&
    !endDate &&
    hoverDate &&
    !hoverDate.isSame(startDate, 'day') &&
    hoverDate.isAfter(startDate) &&
    day.isAfter(startDate) &&
    day.isSameOrBefore(hoverDate);

  const isBackwardHover =
    hasHover && startDate && !endDate && hoverDate && hoverDate.isBefore(startDate) && day.isSame(hoverDate, 'day');

  const isInRange = isInActualRange || isInHoverRange;
  const isSelected = isStart || isEnd || isInRange;

  const isCompact = size === 'compact';

  const handleClick = () => {
    if (hasHover) {
      if (!isDisabled) onDayClick(day);
    } else {
      onDayClick(day);
    }
  };

  const handleMouseEnter = () => {
    if (!hasHover || !supportsHover) return;

    if (!isDisabled && !isStart && !isEnd && !(startDate && endDate)) {
      onDayHover!(day);
    }
  };

  const handleMouseLeave = () => {
    if (!hasHover || !supportsHover) return;

    if (!isStart && !isEnd && !isDisabled && !(startDate && endDate)) {
      onDayHover!(null);
    }
  };

  const getBackgroundColor = () => {
    if (isBackwardHover) return 'transparent';

    if (!startDate && isHoverEnd) return 'transparent';

    if (isStart || isEnd || (isHoverEnd && startDate)) return colors.accentColor;

    if (isInRange) return colors.accentLight;

    return 'transparent';
  };

  const getBorderRadius = () => {
    if (!startDate && isHoverEnd) return '100%';

    if (isStart || isEnd || (isHoverEnd && startDate)) return '100%';

    if (isInRange || isInHoverRange) return '0px';

    return '100%';
  };

  const getTextColor = () => {
    if (hasHover) {
      if (isDisabled && !outsideCurrentMonth) return colors.textDisabled;

      if (!startDate && isHoverEnd) return colors.textPrimary;

      if (isStart || isEnd || (isHoverEnd && startDate)) return colors.white;

      if (isInRange) return colors.textPrimary;

      return colors.textPrimary;
    }

    if (isStart || isEnd) return colors.white;

    return isInRange ? colors.black : colors.textLabel;
  };

  const showRangeBg = hasHover
    ? startDate && (isInRange || (isHoverEnd && startDate && !isBackwardHover)) && !outsideCurrentMonth && !isStart
    : startDate && endDate && (isStart || isEnd || isInRange) && !outsideCurrentMonth;

  const rangeStyles = showRangeBg
    ? {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: isStart ? '50%' : '-50%',
          height: '100%',
          width: '100%',
          backgroundColor: colors.accentLight,
          zIndex: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }
    : undefined;

  const shouldShowHover =
    hasHover &&
    !isStart &&
    !isEnd &&
    (!isHoverEnd || !startDate || isBackwardHover) &&
    !isDisabled &&
    !(startDate && endDate);

  const getHoverStyles = () => {
    if (!hasHover) return { backgroundColor: colors.accentHover };

    if (shouldShowHover) return { backgroundColor: colors.accentHover, color: colors.textPrimary };

    return {};
  };

  const getSelectedHoverStyles = () => {
    if (hasHover && shouldShowHover) return { backgroundColor: colors.accentHover, color: colors.textPrimary };

    return { backgroundColor: getBackgroundColor(), color: getTextColor() };
  };

  return (
    <Stack flex={1} position="relative" justifyContent="center" alignItems="center" sx={rangeStyles}>
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={!!isSelected}
        disabled={hasHover ? isDisabled : undefined}
        onMouseEnter={hasHover ? handleMouseEnter : undefined}
        onMouseLeave={hasHover ? handleMouseLeave : undefined}
        onClick={handleClick}
        sx={{
          position: 'relative',
          zIndex: 2,
          margin: 'auto',
          p: '6px',
          minWidth: isCompact ? '22px' : '36px',
          minHeight: isCompact ? '22px' : '36px',
          fontSize: isCompact ? '12px' : '13px',
          fontWeight: isCompact ? 600 : 700,
          ...(!isCompact && typography.body2),
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          borderRadius: getBorderRadius(),
          '&:hover': getHoverStyles(),
          '&.Mui-selected': {
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            borderRadius: getBorderRadius(),
            fontWeight: isCompact ? 600 : 700,
            '&:hover': getSelectedHoverStyles(),
            ...(hasHover && {
              '&.Mui-disabled': {
                backgroundColor: getBackgroundColor(),
                color: colors.textPrimary,
                fontWeight: 700,
                opacity: '1 !important',
                cursor: 'not-allowed',
                textDecoration: 'none',
              },
            }),
          },
          '&.Mui-selected.MuiPickersDay-dayOutsideMonth': {
            backgroundColor: 'transparent',
            color: colors.textDisabled,
            pointerEvents: 'none',
          },
        }}
      />
    </Stack>
  );
};

export default CustomDay;
