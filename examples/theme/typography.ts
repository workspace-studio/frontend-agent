import type { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  allVariants: {
    lineHeight: 'normal',
  },
  fontFamily: 'Inter, sans-serif',
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '110%',
    fontFamily: 'Poppins, sans-serif',
  },
  h2: {
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: 'Poppins, sans-serif',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'Poppins, sans-serif',
  },
  body1: {
    fontSize: '16px',
  },
  body2: {
    fontSize: '14px',
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'none',
  },
};

export default typography;
