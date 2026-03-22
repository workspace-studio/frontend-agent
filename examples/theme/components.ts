import type { ThemeOptions } from '@mui/material';

import colors from './colors';
import typography from './typography';

const overrides: ThemeOptions['components'] = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
        '&:active': { boxShadow: 'none' },
      },
      sizeSmall: {
        paddingInline: '8px',
        height: 30,
      },
      sizeMedium: {
        ...typography.body2,
        paddingInline: '12px',
        height: 36,
      },
      sizeLarge: {
        ...typography.body1,
        paddingInline: '16px',
        height: 48,
        borderRadius: 12,
      },
      contained: {
        backgroundColor: colors.orange500,
        color: colors.white,
        '&:hover': { backgroundColor: colors.orange600 },
        '&:active': { backgroundColor: colors.orange700 },
        '&:disabled': { backgroundColor: colors.orange200, color: colors.orange300 },
      },
      outlined: {
        borderColor: colors.black100,
        color: colors.grayBlue600,
        '&:hover': { backgroundColor: colors.grayBlue50, borderColor: colors.grayBlue200 },
        '&:disabled': { backgroundColor: colors.white, borderColor: colors.black100, color: colors.black200 },
      },
      text: {
        backgroundColor: 'transparent',
        color: colors.orange500,
        '&:hover': { backgroundColor: 'rgba(28, 37, 46, 0.05)' },
        '&:disabled': { backgroundColor: 'transparent', color: colors.black200 },
      },
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      rounded: { borderRadius: 12, padding: 16 },
      outlined: { borderColor: colors.grayBlue100 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'filled' },
  },
  MuiFilledInput: {
    defaultProps: { disableUnderline: true },
    styleOverrides: {
      root: {
        borderRadius: 12,
        color: colors.grayBlue600,
        border: `1px solid ${colors.grayBlue200}`,
        backgroundColor: colors.white,
        overflow: 'hidden',
        '&:hover': { borderColor: colors.grayBlue400, backgroundColor: colors.white },
        '&.Mui-focused': { borderColor: colors.grayBlue600, backgroundColor: colors.white },
        '&.Mui-error': { backgroundColor: colors.white, borderColor: colors.red600, color: colors.red600 },
        '&.Mui-disabled': { backgroundColor: colors.white, borderColor: colors.grayBlue100 },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { padding: 0, maxWidth: 704, maxHeight: '90vh' },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: { padding: '16px 24px', color: colors.grayBlue950 },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: { padding: '16px 24px', color: colors.grayBlue500 },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: { padding: '16px 24px', gap: 16 },
    },
  },
  MuiTypography: {
    defaultProps: { variant: 'body2' },
  },
  MuiChip: {
    styleOverrides: {
      root: { padding: '6px 4px', borderRadius: 8, height: 'auto' },
      label: { ...typography.body2, paddingLeft: 2, paddingRight: 2, overflow: 'visible' },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        ...typography.body2,
        fontWeight: 500,
        color: colors.grayBlue400,
        '&:hover': { color: colors.grayBlue700 },
        '&.Mui-selected': { color: colors.orange500 },
      },
    },
  },
};

export default overrides;
