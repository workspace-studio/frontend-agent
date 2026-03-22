import React, { ElementType, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Table as MuiTable,
  Skeleton,
  SxProps,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme,
  Typography,
} from '@mui/material';
import cx from 'clsx';

import Checkbox from '@/components/Checkbox';
import EmptyStateWrapper from '@/components/EmptyStateWrapper';
import MeatballsMenu from '@/components/MeatballsMenu';
import { SortDirection } from '@/config/constants.config';
import { TableColumn } from '@/config/table-columns.config';
import colors from '@/styles/themes/colors';

import TableToolbar from './TableToolbar';

import styles from './Table.module.scss';

export interface TableProps {
  columns: TableColumn[];
  rows: ({ key: string; isSystemUser?: boolean } & Record<string, React.ReactNode>)[];
  variant?: 'basic' | 'data';
  toolbarActions?: (selectedRows: string[]) => React.ReactNode;
  rowActions?: (itemIndex: number) => React.ReactNode;
  directActions?: (itemIndex: number) => React.ReactNode;
  onRowClick?: React.MouseEventHandler<HTMLElement>;
  showSkeleton?: boolean;
  sortDirection?: SortDirection;
  sortBy?: string;
  onSort?: (sortBy: string, sortDirection: SortDirection) => void;
  noResultsMessage?: string;
  noResultIcon?: ElementType;
  noResultDescription?: string;
  groupBy?: string;
  defaultSelectedRows?: string[];
  reduceEmptyStatePadding?: boolean;
  isUsersDisplay?: boolean;
  sx?: SxProps<Theme>;
}

const Table = ({
  columns,
  rows,
  variant = 'data',
  toolbarActions,
  rowActions,
  directActions,
  onRowClick,
  showSkeleton,
  sortDirection,
  sortBy,
  onSort,
  noResultIcon,
  noResultsMessage,
  noResultDescription,
  groupBy,
  defaultSelectedRows = [],
  reduceEmptyStatePadding = false,
  isUsersDisplay = false,
  sx,
}: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>(defaultSelectedRows);

  const { t } = useTranslation(['table', 'common']);

  useEffect(() => {
    setSelectedRows(defaultSelectedRows);
  }, [defaultSelectedRows]);

  const isBasicVariant = variant === 'basic';

  const noResults = !rows.length && !showSkeleton;

  const handleSelectAllRows = () => {
    const selectableRows = rows.filter(row => !row.isSystemUser).map(row => row.key);
    const allSelected = selectedRows.length === selectableRows.length && selectableRows.length > 0;

    if (allSelected) {
      setSelectedRows([]);

      return;
    }

    setSelectedRows(selectableRows);
  };

  const handleSelectRow = (event: React.MouseEvent<HTMLButtonElement>, rowKey: string) => {
    event.stopPropagation();

    const newSelected = selectedRows.includes(rowKey)
      ? selectedRows.filter(value => value !== rowKey)
      : [...selectedRows, rowKey];

    setSelectedRows(newSelected);
  };

  const handleSort = (id: string) => {
    if (!onSort) {
      return;
    }

    const isAsc = sortBy === id && sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';

    onSort(id, direction);
  };

  const selectableRowsCount = rows.filter(row => !row.isSystemUser).length;

  return (
    <Box position="relative" sx={sx}>
      <TableToolbar
        selectedRows={selectedRows}
        rowsCount={rows.length}
        onSelectAllRows={handleSelectAllRows}
        actions={toolbarActions}
      />
      <TableContainer
        className={cx(styles.container, {
          [styles.usersDisplay]: isUsersDisplay,
        })}
      >
        <MuiTable>
          <TableHead>
            <TableRow>
              {variant === 'data' && (
                <TableCell padding="checkbox" className={styles.checkbox}>
                  <Checkbox
                    indeterminate={!!selectedRows.length && selectedRows.length < selectableRowsCount}
                    checked={selectedRows.length === selectableRowsCount && selectableRowsCount > 0}
                    disabled={selectableRowsCount === 0}
                    onChange={handleSelectAllRows}
                  />
                </TableCell>
              )}
              {columns.map(({ id, label, sortable }) => (
                <TableCell key={id} sortDirection={sortBy === id ? sortDirection : false}>
                  {sortable && sortDirection ? (
                    <TableSortLabel
                      active={sortBy === id}
                      direction={sortBy === id ? sortDirection : 'asc'}
                      onClick={() => handleSort(id)}
                    >
                      <Typography variant="body2" color={colors.grayBlue500}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {t(label as any)}
                      </Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography variant="body2" color={colors.grayBlue500}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {t(label as any)}
                    </Typography>
                  )}
                </TableCell>
              ))}
              {(rowActions || directActions) && <TableCell sx={{ width: '52px' }} />}
            </TableRow>
          </TableHead>
          <TableBody className={cx({ [styles.basic]: isBasicVariant, [styles.noResults]: noResults })}>
            {rows.map((row, rowIndex) => {
              const isNewGroup = groupBy && (rowIndex === 0 || row[groupBy] !== rows[rowIndex - 1][groupBy]);

              return (
                <React.Fragment key={row.key}>
                  {isNewGroup && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className={styles.group}>
                        <Typography variant="body2">{row[groupBy]}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow data-id={row.key} onClick={onRowClick} className={cx({ [styles.clickable]: onRowClick })}>
                    {variant === 'data' && (
                      <TableCell padding="checkbox" className={styles.checkbox}>
                        <Checkbox
                          checked={selectedRows.includes(row.key)}
                          disabled={row.isSystemUser}
                          onClick={event => handleSelectRow(event, row.key)}
                        />
                      </TableCell>
                    )}
                    {columns.map(column => {
                      const content = row[column.id];
                      const cell =
                        typeof content === 'string' ? <Typography variant="body2">{content}</Typography> : content;

                      return (
                        <TableCell key={column.id}>
                          {showSkeleton ? <Skeleton variant="text">{cell}</Skeleton> : cell}
                        </TableCell>
                      );
                    })}
                    {directActions && (
                      <TableCell align="center">
                        {typeof directActions === 'function' ? directActions(rowIndex) : directActions}
                      </TableCell>
                    )}
                    {!directActions && rowActions && (
                      <TableCell align="center">
                        <MeatballsMenu>
                          {typeof rowActions === 'function' ? rowActions(rowIndex) : rowActions}
                        </MeatballsMenu>
                      </TableCell>
                    )}
                  </TableRow>
                </React.Fragment>
              );
            })}
            {noResults && (
              <TableRow>
                <TableCell colSpan={12}>
                  <EmptyStateWrapper
                    emptyIcon={noResultIcon}
                    emptyTitle={noResultsMessage || t('common:no-records')}
                    emptyDescription={noResultDescription}
                    reduceEmptyStatePadding={reduceEmptyStatePadding}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Box>
  );
};

export default Table;
