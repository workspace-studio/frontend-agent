import { Box, CircularProgress } from '@mui/material';

interface LoaderProps {
  height?: string;
}

const Loader = ({ height = '100vh' }: LoaderProps) => (
  <Box display="flex" justifyContent="center" alignItems="center" height={height}>
    <CircularProgress />
  </Box>
);

export default Loader;
