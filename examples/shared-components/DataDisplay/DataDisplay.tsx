import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid } from '@mui/material';
import cx from 'clsx';

import DataCard, { DataCardProps } from '@/components/DataCard';
import EmptyStateWrapper from '@/components/EmptyStateWrapper';
import Table, { TableProps } from '@/components/Table';
import { ViewType } from '@/config/constants.config';
import { UserRole } from '@/models/user.model';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import UserCard from '@/views/Users/partials/UserCard';

import styles from './DataDisplay.module.scss';

interface CardItem {
  id: string;
  title: string;
  items: DataCardProps['items'];
  chipLabel?: DataCardProps['chipLabel'];
  chipColor?: DataCardProps['chipColor'];
  secondaryChipLabel?: DataCardProps['secondaryChipLabel'];
  secondaryChipColor?: DataCardProps['secondaryChipColor'];
  customChip?: React.ReactNode;
  date?: string;
  roles?: UserRole[];
}

interface DataDisplayProps extends TableProps {
  cardData: CardItem[];
  onCardClick?: DataCardProps['onCardClick'];
  twoColumnLayout?: boolean;
  noResultIcon?: ElementType;
  noResultsMessage?: string;
  noResultDescription?: string;
  viewType?: ViewType;
  isUsersDisplay?: boolean;
  isConstrained?: boolean;
  reduceEmptyStatePadding?: boolean;
}

const DataDisplay = ({
  columns,
  rows,
  variant = 'data',
  rowActions,
  directActions,
  onRowClick,
  showSkeleton,
  sortDirection,
  sortBy,
  onSort,
  toolbarActions,
  noResultIcon,
  noResultsMessage,
  noResultDescription,
  groupBy,
  defaultSelectedRows,
  cardData,
  onCardClick,
  twoColumnLayout = false,
  viewType = ViewType.TABLE,
  isUsersDisplay = false,
  isConstrained = false,
  reduceEmptyStatePadding = false,
}: DataDisplayProps) => {
  const { isMobile } = useBreakpoint();
  const { t } = useTranslation(['common']);

  const isCardView = viewType === 'card' || isMobile;
  const noResults = !cardData.length && !showSkeleton;

  if (isCardView) {
    return (
      <Grid
        container
        spacing={2}
        className={cx(styles.cardContainer, {
          [styles.usersDisplay]: isUsersDisplay,
        })}
      >
        {cardData?.map((card, index) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
            {isUsersDisplay ? (
              <UserCard
                title={card.title}
                chipLabel={card.chipLabel}
                chipColor={card.chipColor}
                onCardClick={onCardClick}
                dataId={card.id}
                rowIndex={index}
                rowActions={rowActions}
                items={card.items}
                roles={card.roles}
              />
            ) : (
              <DataCard
                chipLabel={card.chipLabel}
                chipColor={card.chipColor}
                secondaryChipLabel={card.secondaryChipLabel}
                secondaryChipColor={card.secondaryChipColor}
                customChip={card.customChip}
                title={card.title}
                items={card.items}
                dataId={card.id}
                onCardClick={onCardClick}
                showSkeleton={showSkeleton}
                rowActions={rowActions}
                rowIndex={index}
                date={card.date}
                twoColumnLayout={twoColumnLayout}
                isConstrained={isConstrained}
              />
            )}
          </Grid>
        ))}
        {noResults && (
          <EmptyStateWrapper
            emptyIcon={noResultIcon}
            emptyTitle={noResultsMessage || t('common:no-records')}
            emptyDescription={noResultDescription}
            reduceEmptyStatePadding={reduceEmptyStatePadding}
          />
        )}
      </Grid>
    );
  }

  return (
    <Table
      variant={variant}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSort={onSort}
      onRowClick={onRowClick}
      rowActions={rowActions}
      directActions={directActions}
      defaultSelectedRows={defaultSelectedRows || []}
      showSkeleton={showSkeleton}
      columns={columns}
      rows={rows}
      toolbarActions={toolbarActions}
      noResultIcon={noResultIcon}
      noResultsMessage={noResultsMessage}
      noResultDescription={noResultDescription}
      groupBy={groupBy}
      isUsersDisplay={isUsersDisplay}
      reduceEmptyStatePadding={reduceEmptyStatePadding}
    />
  );
};

export default DataDisplay;
