import { useState } from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { ClickAwayListener, IconButton, Tooltip as MuiTooltip } from '@mui/material';

import colors from '@/styles/themes/colors';

interface TooltipProps {
  title: string;
}

const Tooltip = ({ title }: TooltipProps) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <MuiTooltip onClose={handleTooltipClose} open={open} title={title}>
        <IconButton sx={{ color: colors.textPlaceholder }}>
          <InfoOutlined onClick={handleTooltipOpen} />
        </IconButton>
      </MuiTooltip>
    </ClickAwayListener>
  );
};

export default Tooltip;
