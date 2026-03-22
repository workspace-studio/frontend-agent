import { Box, ButtonBase, SvgIcon, Tooltip } from '@mui/material';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import cx from 'clsx';

import styles from './ToolbarItem.module.scss';

export interface ToolbarItemProps extends ButtonBaseProps {
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  variant?: 'toolbar' | 'menu';
}

const ToolbarItem = ({
  icon,
  label,
  active,
  disabled,
  className,
  onClick,
  title,
  variant = 'toolbar',
  ...other
}: ToolbarItemProps) => {
  const baseClass = variant === 'menu' ? styles.menuItem : styles.toolbarItem;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick?.(event);
  };

  if (!title) {
    return (
      <ButtonBase
        className={cx(baseClass, active && styles.active, disabled && styles.disabled, className)}
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={e => e.preventDefault()}
        {...other}
      >
        {icon && <SvgIcon className={styles.icon}>{icon}</SvgIcon>}
        {label && (
          <Box component="span" className={variant === 'toolbar' ? styles.label : undefined} sx={{ lineHeight: 1 }}>
            {label}
          </Box>
        )}
      </ButtonBase>
    );
  }

  return (
    <Tooltip title={title} arrow placement="top" enterDelay={300} enterNextDelay={100}>
      <Box component="span">
        <ButtonBase
          className={cx(baseClass, active && styles.active, disabled && styles.disabled, className)}
          disabled={disabled}
          onClick={handleClick}
          onMouseDown={e => e.preventDefault()}
          {...other}
        >
          {icon && <SvgIcon className={styles.icon}>{icon}</SvgIcon>}
          {label && (
            <Box component="span" className={variant === 'toolbar' ? styles.label : undefined} sx={{ lineHeight: 1 }}>
              {label}
            </Box>
          )}
        </ButtonBase>
      </Box>
    </Tooltip>
  );
};

export default ToolbarItem;
