import React from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import Checkbox from '@/components/Checkbox';

import styles from './TableToolbar.module.scss';

interface TableToolbarProps {
  selectedRows: string[];
  rowsCount: number;
  onSelectAllRows: (event: React.ChangeEvent<HTMLInputElement>) => void;
  actions?: (selectedRows: string[]) => React.ReactNode;
}

const TableToolbar = ({ selectedRows, rowsCount, onSelectAllRows, actions }: TableToolbarProps) => {
  const selectedRowsLenght = selectedRows.length;
  const isIndeterminate = selectedRowsLenght > 0 && selectedRowsLenght < rowsCount;
  const isChecked = rowsCount > 0 && selectedRowsLenght === rowsCount;
  const { t } = useTranslation('common');

  if (!selectedRowsLenght) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" className={styles.container}>
      <Checkbox indeterminate={isIndeterminate} checked={isChecked} onChange={onSelectAllRows} />
      <Typography variant="body2" color="primary" ml={1} flexGrow={1}>
        {selectedRowsLenght} {t('selected')}
      </Typography>
      {actions && actions(selectedRows)}
    </Stack>
  );
};

export default TableToolbar;
