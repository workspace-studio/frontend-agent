import React from 'react';

import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import QueryBar from '@/components/QueryBar';
import Table from '@/components/Table';
import Plus from '@/components/SvgIcons/Plus';
import { toggleCreateModal } from '@/valtio/entities/entities.actions';
import { useEntitiesStore } from '@/valtio/entities/entities.store';

import styles from './EntityList.module.scss';

const EntityList = () => {
  const { entities, totalCount, isLoading } = useEntitiesStore();
  const { t } = useTranslation('entities');

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container disableGutters className={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">{t('title')}</Typography>
        <Button onClick={() => toggleCreateModal(true)} startIcon={<Plus />}>
          {t('actions.create')}
        </Button>
      </Stack>

      <QueryBar placeholder={t('search.placeholder')} />

      <Table data={entities} />

      <Pagination totalCount={totalCount} />
    </Container>
  );
};

export default EntityList;
