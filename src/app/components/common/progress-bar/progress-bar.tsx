import { displayValue, formatNum } from '@/utils';
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  styled,
} from '@mui/material';
interface StyledLinearProgressProps extends LinearProgressProps {
  barColor: string;
  bgColor: string;
}

interface CustomLinearProgressProps {
  value: number;
  barColor?: string;
  bgColor?: string;
  label: string;
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) =>
    !['barColor', 'bgColor'].includes(prop.toString()),
})<StyledLinearProgressProps>(({ barColor, bgColor }) => ({
  height: '1rem',
  borderRadius: '0.5rem',
  backgroundColor: bgColor,
  '& .MuiLinearProgress-bar': {
    backgroundColor: barColor,
    borderRadius: '0.5rem',
  },
}));

const CustomLinearProgress = ({
  value = 75,
  barColor = '#59BF82',
  bgColor = '#F5F6F7',
  label,
}: CustomLinearProgressProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          fontSize: '0.9rem',
          color: '#77469b',
          margin: '0.2rem 0',
          fontWeight: '500',
        }}
      >
        <span>{label}</span>
        <span>{displayValue(formatNum(value))}</span>
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <StyledLinearProgress
          variant="determinate"
          value={value}
          barColor={barColor}
          bgColor={bgColor}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default CustomLinearProgress;
