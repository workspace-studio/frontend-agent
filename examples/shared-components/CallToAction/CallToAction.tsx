import { useTranslation } from 'react-i18next';

import { Button, Grid2 as Grid, Skeleton, Stack, Typography } from '@mui/material';

import Plus from '@/components/SvgIcons/Plus';
import colors from '@/styles/themes/colors';

interface CallToActionProps {
  label: string;
  totalCount: number;
  callback: () => void;
  showCreateButton?: boolean;
  isLoading?: boolean;
}

const CallToAction = ({
  label,
  totalCount,
  callback,
  showCreateButton = true,
  isLoading = false,
}: CallToActionProps) => {
  const { t } = useTranslation(['common', 'actions']);

  return (
    <Grid justifyContent="space-between" alignItems="flex-start" flexDirection="column">
      <Stack gap={0.5} mb={{ xs: 2, md: 0 }} mt={{ xs: 1, lg: 0 }}>
        <Typography variant="h1">{label}</Typography>
        {isLoading ? (
          <Skeleton variant="text" width={100} height={20} />
        ) : (
          <Typography variant="body1" color={colors.orange500}>
            {t('common:result', { count: totalCount })}
          </Typography>
        )}
      </Stack>
      {showCreateButton && (
        <Button
          startIcon={<Plus fill={colors.white} />}
          onClick={callback}
          sx={{ display: { xs: 'flex', md: 'none' } }}
          fullWidth
          style={{ marginBottom: 16 }}
          size="large"
        >
          {t('actions:create')}
        </Button>
      )}
    </Grid>
  );
};

export default CallToAction;
