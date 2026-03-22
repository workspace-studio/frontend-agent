import React, { JSX } from 'react';

import { ButtonProps, DialogProps, SxProps, Theme, useMediaQuery } from '@mui/material';

import Modal from './Modal';
import SwipeableModal from './SwipeableModal';

interface ModalRootProps extends DialogProps {
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
  width?: number;
  height?: number;
  arrowBack?: boolean;
  onBack?: () => void;
  noTitle?: boolean;
  closeButtonSx?: SxProps<Theme>;
}

const ModalRoot = ({
  open,
  title,
  onClose,
  width,
  arrowBack,
  onBack,
  stickyHeader,
  children,
  height,
  noTitle,
  closeButtonSx,
  ...props
}: ModalRootProps) => {
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (customBreakpoint) {
    return (
      <SwipeableModal
        open={open}
        onClose={onClose}
        onOpen={onClose}
        title={title}
        noTitle={noTitle}
        closeButtonSx={closeButtonSx}
        arrowBack={arrowBack}
        onBack={onBack}
        stickyHeader={stickyHeader}
        {...props}
      >
        {children}
      </SwipeableModal>
    );
  }

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      stickyHeader={stickyHeader}
      noTitle={noTitle}
      closeButtonSx={closeButtonSx}
      slotProps={{ paper: { sx: { maxWidth: width, maxHeight: `${height}vh` } } }}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalRoot;
