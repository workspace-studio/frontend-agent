import React, { JSX } from 'react';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Box,
  Button,
  ButtonProps,
  DialogProps,
  Icon,
  IconButton,
  Stack,
  SwipeableDrawer,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

import Close from '@/components/SvgIcons/Close';
import colors from '@/styles/themes/colors';

import styles from './SwipeableModal.module.scss';

interface SwipeableModalProps extends DialogProps {
  title: string | undefined;
  onOpen: () => void;
  onClose: () => void;
  description?: string;
  onConfirm?: () => void;
  confirmBtnText?: string;
  ConfirmBtnProps?: ButtonProps;
  hideConfirmButton?: boolean;
  onCancel?: () => void;
  cancelBtnText?: string;
  CancelBtnProps?: ButtonProps;
  hideCancelButton?: boolean;
  titleActions?: JSX.Element | null;
  stickyHeader?: React.ReactNode;
  icon?: React.ReactNode;
  customButton?: React.ReactNode;
  scrollRef?: React.Ref<HTMLDivElement>;
  arrowBack?: boolean;
  onBack?: () => void;
  removePadding?: boolean;
  noTitle?: boolean;
  closeButtonSx?: SxProps<Theme>;
}

const SwipeableModal = ({
  open,
  title,
  onOpen,
  onClose,
  description,
  onConfirm,
  confirmBtnText = 'Confirm',
  ConfirmBtnProps,
  hideConfirmButton = false,
  onCancel,
  cancelBtnText = 'Cancel',
  CancelBtnProps,
  hideCancelButton = false,
  titleActions,
  stickyHeader,
  customButton,
  arrowBack,
  onBack,
  removePadding,
  scrollRef,
  children,
  noTitle,
  closeButtonSx,
}: SwipeableModalProps) => (
  <SwipeableDrawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    onOpen={onOpen}
    keepMounted
    title={title}
    disableScrollLock={false}
    sx={{
      '&.MuiDrawer-root': {
        zIndex: 1300,
      },
      '.MuiDrawer-paper ': {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '98dvh',
        overflowY: 'hidden',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
      },
    }}
  >
    <Box className={styles.puller} />
    <Stack
      component="div"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      className={styles.swipeableContainer}
      sx={{ flexShrink: 0 }}
      position={noTitle ? 'absolute' : 'relative'}
      top={noTitle ? 16 : 'auto'}
      right={noTitle ? 8 : 'auto'}
      zIndex={noTitle ? 1300 : 'auto'}
    >
      {arrowBack && (
        <IconButton size="large" onClick={onBack} sx={{ color: colors.black400 }}>
          <KeyboardBackspaceIcon />
        </IconButton>
      )}
      <Stack>
        <Typography variant="h2">{title}</Typography>
        {description && (
          <Typography variant="body1" color={colors.grayBlue500}>
            {description}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        {titleActions && <Box flex="none">{titleActions}</Box>}
        <IconButton
          size="large"
          onClick={onClose}
          sx={{
            color: noTitle ? colors.white : colors.grayBlue400,
            ...closeButtonSx,
          }}
        >
          <Icon>
            <Close />
          </Icon>
        </IconButton>
      </Stack>
    </Stack>
    {stickyHeader && <Box sx={{ flexShrink: 0, paddingInline: { xs: 2, md: 0 } }}>{stickyHeader}</Box>}
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        padding: 3,
        minHeight: 0,

        '@media (max-width: 768px)': {
          padding: removePadding ? 0 : 2,
          paddingTop: noTitle ? 3 : undefined,
        },
      }}
    >
      {children}
    </Box>
    {(!hideCancelButton || !hideConfirmButton) && (
      <Stack direction="column" spacing={1} className={styles.swipeableContainer} sx={{ flexShrink: 0 }}>
        {customButton ? (
          <Box sx={{ width: '100%' }}>{customButton}</Box>
        ) : (
          !hideConfirmButton && (
            <Button onClick={onConfirm} fullWidth size="large" {...ConfirmBtnProps}>
              {confirmBtnText}
            </Button>
          )
        )}
        {!hideCancelButton && (
          <Button onClick={onCancel} size="large" color="secondary" fullWidth {...CancelBtnProps}>
            {cancelBtnText}
          </Button>
        )}
      </Stack>
    )}
  </SwipeableDrawer>
);

export default SwipeableModal;
