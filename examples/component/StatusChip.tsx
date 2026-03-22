import { Chip, ChipProps } from '@mui/material';
import cx from 'clsx';

import styles from './StatusChip.module.scss';

interface StatusChipProps extends ChipProps {
  truncateLabel?: boolean;
}

const StatusChip = ({ color, label, truncateLabel }: StatusChipProps) => (
  <Chip
    color={color}
    label={label}
    classes={{ root: cx(styles.root, { [styles.label]: truncateLabel }) }}
    className={cx(color && styles[color])}
  />
);

export default StatusChip;
