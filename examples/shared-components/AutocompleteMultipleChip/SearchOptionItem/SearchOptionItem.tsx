import { Box, Stack, Typography } from '@mui/material';
import cx from 'clsx';

import Check from '@/components/SvgIcons/Check';
import colors from '@/styles/themes/colors';

import styles from './SearchOptionItem.module.scss';

interface SearchOptionItemProps {
  label: string;
  selected: boolean;
  icon?: React.ReactNode;
  props?: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
}

const SearchOptionItem = ({ label, selected, icon: Icon, props }: SearchOptionItemProps) => {
  const { key, ...restProps } = props || {};

  return (
    <Box component="li" key={key} {...restProps} className={cx(styles.container, { [styles.active]: selected })}>
      <Stack direction="row" alignItems="center" gap={1}>
        {Icon && Icon}
        <Typography variant="body2">{label}</Typography>
      </Stack>
      {selected && <Check height={20} width={20} fill={colors.orange500} />}
    </Box>
  );
};

export default SearchOptionItem;
