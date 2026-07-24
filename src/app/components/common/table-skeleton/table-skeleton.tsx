import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { tableSkeletonStyle } from './table-skeleton-styles';

export default function TableSkeleton() {
  return (
    <Box
      sx={{
        width: '95%',
        height: '35rem',
        alignItems: 'center',
      }}
    >
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        height={35}
        sx={tableSkeletonStyle}
      />
    </Box>
  );
}
