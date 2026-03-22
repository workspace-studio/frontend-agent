import React, { useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import Error from '@/components/SvgIcons/Toast/Error';
import Info from '@/components/SvgIcons/Toast/Info';
import Success from '@/components/SvgIcons/Toast/Success';
import Warning from '@/components/SvgIcons/Toast/Warning';
import { resetToast } from '@/valtio/global/global.actions';
import { useGlobalStore } from '@/valtio/global/global.store';

const Toast: React.FC = () => {
  const { toast } = useGlobalStore();

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        resetToast();
      }, 3000);
    }
  }, [toast]);

  if (!toast) {
    return null;
  }

  const customIconMapping = {
    success: <Success size={24} />,
    error: <Error />,
    warning: <Warning />,
    info: <Info />,
  };

  return (
    <Snackbar open={Boolean(toast)}>
      <Alert severity={toast?.status} iconMapping={customIconMapping}>
        {toast?.text}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
