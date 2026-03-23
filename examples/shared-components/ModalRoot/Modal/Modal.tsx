import { JSX } from 'react';

import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

import Close from '@/components/SvgIcons/Close';
import colors from '@/styles/themes/colors';

interface ModalProps extends DialogProps {
  title: string | undefined;
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
  noTitle?: boolean;
  closeButtonSx?: SxProps<Theme>;
}

const Modal = ({
  open,
  title,
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
  scrollRef,
  children,
  noTitle,
  closeButtonSx,
  ...props
}: ModalProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    {...props}
    sx={{
      '& .MuiDialog-paper': {
        overflow: customButton ? 'visible' : 'hidden',
      },
    }}
  >
    <DialogTitle
      component="div"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={2}
      position={noTitle ? 'absolute' : 'relative'}
      top={noTitle ? 8 : 'auto'}
      right={noTitle ? 8 : 'auto'}
      zIndex={noTitle ? 1300 : 'auto'}
    >
      <Stack>
        <Typography variant="h2" sx={{ wordBreak: 'break-word' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color={colors.textTertiary}>
            {description}
          </Typography>
        )}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
        {titleActions && <Box flex="none">{titleActions}</Box>}
        <IconButton
          size="large"
          onClick={onClose}
          sx={{
            color: noTitle ? colors.white : colors.textPlaceholder,
            ...closeButtonSx,
          }}
        >
          <Icon>
            <Close />
          </Icon>
        </IconButton>
      </Stack>
    </DialogTitle>
    {stickyHeader && (
      <Box
        sx={{
          px: { xs: 0, sm: 3 },
          flexShrink: 0,
        }}
      >
        {stickyHeader}
      </Box>
    )}
    {children && (
      <DialogContent
        ref={scrollRef}
        sx={{
          pb: 3,
          mt: noTitle ? '16px' : undefined,
        }}
      >
        {children}
      </DialogContent>
    )}
    {(!hideCancelButton || !hideConfirmButton) && (
      <DialogActions disableSpacing sx={{ gap: customButton ? 1 : 2 }}>
        {!hideCancelButton && (
          <Button onClick={onCancel} size="large" color="secondary" fullWidth {...CancelBtnProps}>
            {cancelBtnText}
          </Button>
        )}
        {customButton ? (
          <Box sx={{ width: '100%' }}>{customButton}</Box>
        ) : (
          !hideConfirmButton && (
            <Button onClick={onConfirm} fullWidth size="large" {...ConfirmBtnProps}>
              {confirmBtnText}
            </Button>
          )
        )}
      </DialogActions>
    )}
  </Dialog>
);

export default Modal;
