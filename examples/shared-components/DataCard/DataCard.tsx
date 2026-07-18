import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, ChipProps, Divider, Grid, Stack, Typography } from '@mui/material';

import Avatar from '@/components/Avatar';
import MeatballsMenu from '@/components/MeatballsMenu';
import StatusChip from '@/components/StatusChip';
import colors from '@/styles/themes/colors';

import styles from './DataCard.module.scss';

export interface DataCardItem {
  text: string;
  content?: React.ReactNode;
  icon?: ElementType;
  label?: string;
  avatar?: React.ReactNode;
  isAssigneeGrid?: boolean;
  assignees?: Array<{ name: string; isLead?: boolean }>;
  leadAssignee?: boolean;
}

export interface DataCardProps {
  title: string;
  chipLabel: ChipProps['label'];
  chipColor: ChipProps['color'];
  items: DataCardItem[];
  secondaryChipLabel?: ChipProps['label'];
  secondaryChipColor?: ChipProps['color'];
  customChip?: React.ReactNode;
  rowActions?: (itemIndex: number) => React.ReactNode;
  rowIndex: number;
  dataId?: string;
  date?: string;
  onCardClick?: (event: React.MouseEvent<HTMLElement>) => void;
  showSkeleton?: boolean;
  twoColumnLayout?: boolean;
  isConstrained?: boolean;
}

const DataCard = ({
  chipLabel,
  chipColor,
  title,
  items,
  secondaryChipLabel,
  secondaryChipColor,
  customChip,
  rowActions,
  rowIndex,
  dataId,
  date,
  onCardClick,
  twoColumnLayout = false,
  isConstrained = false,
}: DataCardProps) => {
  const { t } = useTranslation('common');
  const titleWithoutChip = !chipLabel && !secondaryChipLabel && title;

  const renderSingleColumnItems = () => (
    <Stack spacing={1.5} maxWidth={isConstrained ? '70%' : '100%'}>
      {items.map(({ text, icon: Icon, avatar }, index) => (
        <Stack key={text} direction="row" alignItems="center" gap={1}>
          {Icon && (
            <Box sx={{ flexShrink: 0, width: '16px', height: '16px' }}>
              <Icon width={16} height={16} fill={colors.textPlaceholder} />
            </Box>
          )}
          {avatar && <Box sx={{ flexShrink: 0 }}>{avatar}</Box>}
          <Typography variant="body2" color={colors.textSecondary}>
            {text}
          </Typography>
          {index === items.length - 1 && date && (
            <Stack className={styles.date} gap={0.5}>
              <Typography variant="body2" color={colors.textTertiary} textAlign="end">
                {t('start-date')}
              </Typography>
              <Typography variant="body2" color={colors.textSecondary}>
                {date}
              </Typography>
            </Stack>
          )}
        </Stack>
      ))}
    </Stack>
  );

  const renderTwoColumnItems = () => (
    <Stack spacing={1.5}>
      {/* eslint-disable react/no-array-index-key */}
      {items.map(({ label, text, content, avatar, isAssigneeGrid, assignees }, index) => {
        if (isAssigneeGrid && assignees) {
          return (
            <Stack key={index} spacing={1} direction="row" justifyContent="space-between">
              <Typography variant="body2" color={colors.textTertiary} width="40%">
                {label}
              </Typography>
              {assignees.length > 0 ? (
                <Grid container spacing={1} direction="column" width="60%">
                  {assignees
                    .sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0))
                    .map((assignee, assigneeIndex) => (
                      <Grid size={12} key={`${assignee}-${assigneeIndex}`}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar name={assignee.name} size="small" />
                          <Typography variant="body2" color={colors.textSecondary}>
                            {assignee.name}
                          </Typography>
                          {assignee.isLead && <StatusChip label="Lead" color="primary" />}
                        </Stack>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Typography variant="body2" color={colors.textSecondary}>
                  -
                </Typography>
              )}
            </Stack>
          );
        }

        return (
          <Stack key={index} direction="row" spacing={1}>
            <Typography variant="body2" color={colors.textTertiary} width="40%">
              {label || '-'}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} width="60%" flexWrap="wrap">
              {avatar && <Box>{avatar}</Box>}
              {content ?? (
                <Typography variant="body2" color={colors.textSecondary}>
                  {text || '-'}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );

  return (
    <Box
      className={styles.container}
      onClick={onCardClick}
      data-id={dataId}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        {titleWithoutChip ? (
          <Typography variant="body1" fontWeight={600} color={colors.textPrimary} sx={{ wordBreak: 'break-word' }}>
            {title}
          </Typography>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <StatusChip label={chipLabel} color={chipColor} />
            {secondaryChipLabel && <StatusChip label={secondaryChipLabel} color={secondaryChipColor} />}
            {customChip && customChip}
          </Stack>
        )}
        {rowActions && (
          <MeatballsMenu
            anchorOriginVertical="top"
            transformOriginVertical="top"
            sx={{
              '& .MuiPaper-root': {
                width: 'fit-content',
                boxShadow: '0px 4px 35px 0px rgba(0, 0, 0, 0.15)',
              },
            }}
            size="small"
          >
            {typeof rowActions === 'function' ? rowActions(rowIndex) : rowActions}
          </MeatballsMenu>
        )}
      </Stack>
      {!titleWithoutChip && (
        <Typography variant="body1" fontWeight={600} color={colors.textPrimary} sx={{ wordBreak: 'break-word' }} mt={1}>
          {title}
        </Typography>
      )}
      <Divider className={styles.divider} />
      {twoColumnLayout ? renderTwoColumnItems() : renderSingleColumnItems()}
      {date && twoColumnLayout && (
        <Stack gap={0.5} sx={{ mt: 'auto', pt: 2 }}>
          <Typography variant="body2" color={colors.textTertiary}>
            {t('start-date')}
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} textAlign="start">
            {date}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default DataCard;
