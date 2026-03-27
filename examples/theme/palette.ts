import{ ThemeOptions } from '@mui/material';

import colors from './colors';

const palette: ThemeOptions['palette'] = {
  primary: {
    main: colors.orange500,
    contrastText: colors.white,
  },
  secondary: {
    main: colors.black900,
    contrastText: colors.white,
  },
  error: {
    main: colors.orange500,
  },
  warning: {
    main: colors.yellow300,
  },
  success: {
    main: colors.green300,
  },
  info: {
    main: colors.black500,
  },
};

export default palette;
