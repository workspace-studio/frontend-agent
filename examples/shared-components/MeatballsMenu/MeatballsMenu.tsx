import React, { PropsWithChildren, useState } from 'react';

import { IconButton, IconButtonProps, Menu, SxProps } from '@mui/material';

import VerticalDots from '@/components/SvgIcons/VerticalDots';
import colors from '@/styles/themes/colors';

export type originPosition = number | 'center' | 'top' | 'bottom';

interface MeatballsMenuProps extends PropsWithChildren {
  anchorOriginVertical?: originPosition;
  transformOriginVertical?: originPosition;
  sx?: SxProps;
  size?: IconButtonProps['size'];
}

const MeatballsMenu = ({
  children,
  anchorOriginVertical,
  transformOriginVertical,
  sx,
  size = 'medium',
}: MeatballsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={size}
        sx={{
          backgroundColor: open ? 'rgba(28, 37, 46, 0.10);' : 'transparent',
        }}
      >
        <VerticalDots width={20} height={20} fill={open ? colors.iconActive : colors.textPlaceholder} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        anchorOrigin={{
          vertical: anchorOriginVertical || 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: transformOriginVertical || 'center',
          horizontal: 'right',
        }}
        sx={sx}
      >
        {children}
      </Menu>
    </>
  );
};

export default MeatballsMenu;
