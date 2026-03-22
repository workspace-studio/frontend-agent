import { useTranslation } from 'react-i18next';

import { Stack, Theme, Typography, useMediaQuery } from '@mui/material';

import DateRangePickerAccordion from '@/components/DateRangePicker/DateRangePickerAccordion';
import { CalendarQuickFilter, CalendarQuickFilterKey } from '@/config/calendarQuickFilters.config';
import colors from '@/styles/themes/colors';

interface DateRangeQuickSelectProps {
  selectedKey: CalendarQuickFilterKey | null;
  onSelect: (key: CalendarQuickFilterKey, range: [Date, Date]) => void;
  filters: Record<CalendarQuickFilterKey, CalendarQuickFilter>;
}

interface FilterItemProps {
  keyId: CalendarQuickFilterKey;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const FilterItem = ({ keyId, label, isSelected, onClick }: FilterItemProps) => (
  <Stack
    component="div"
    key={keyId}
    onClick={onClick}
    sx={{
      backgroundColor: isSelected ? colors.grayBlue100 : colors.white,
      color: colors.grayBlue950,
      borderRadius: '10px',
      cursor: 'pointer',
      padding: '12px 8px',
      '&:hover': { backgroundColor: colors.grayBlue50 },
      '&:active': { backgroundColor: colors.grayBlue100 },
      '&:disabled': { backgroundColor: colors.grayBlue50 },
    }}
  >
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

const DateRangeQuickSelect = ({ selectedKey, onSelect, filters }: DateRangeQuickSelectProps) => {
  const { t } = useTranslation('common');
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down(768));

  const handleSelect = (key: CalendarQuickFilterKey, getValue: () => [string, string]) => {
    const [start, end] = getValue();

    onSelect(key, [new Date(start), new Date(end)]);
  };

  const renderFilterList = () => (
    <Stack mt={0.5} spacing={0.5}>
      {(Object.keys(filters) as CalendarQuickFilterKey[]).map(key => {
        const { label, getValue } = filters[key];

        return (
          <FilterItem
            keyId={key}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={t(label as any)}
            isSelected={key === selectedKey}
            onClick={() => handleSelect(key, getValue)}
          />
        );
      })}
    </Stack>
  );

  return customBreakpoint ? (
    <DateRangePickerAccordion title="Filters">{renderFilterList()}</DateRangePickerAccordion>
  ) : (
    <Stack>{renderFilterList()}</Stack>
  );
};

export default DateRangeQuickSelect;
