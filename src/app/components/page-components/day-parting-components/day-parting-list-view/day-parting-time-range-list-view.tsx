import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import TextButton from 'src/app/components/common/text-button/text-button';
import { TIME_FORMAT_2, TIME_FORMAT_3 } from 'src/constants/datetime.constants';
import { DaypartingTimeRangeTypeEnum } from 'src/enums/day-parting.enums';
import { IDaypartingTimeRange } from 'src/interfaces/day-parting.interfaces';
import { formatNum } from 'src/utils';
import { getFormattedTimezoneTimeRange } from 'src/utils/datetime.utils';

interface IDayPartingTimeRangeListViewProps {
  type: string;
  ranges: IDaypartingTimeRange[];
  timeRangeType?: string;
}

export default function DayPartingTimeRangeListView({
  type,
  ranges,
  timeRangeType,
}: IDayPartingTimeRangeListViewProps) {
  const [open, setOpen] = useState(false);

  const label = `${formatNum(ranges.length, false)} Ranges`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {type === DaypartingTimeRangeTypeEnum.ALL_DAY ? (
        <p style={{ fontSize: '1.1rem' }}>All Day</p>
      ) : ranges.length === 1 ? (
        <p>
          {getFormattedTimezoneTimeRange(
            ranges[0].startTime,
            ranges[0].endTime,
            TIME_FORMAT_2,
            TIME_FORMAT_3
          )}
        </p>
      ) : (
        <div>
          <TextButton
            label={label}
            handleClick={handleOpen}
            isVisible={true}
            isDisabled={timeRangeType === DaypartingTimeRangeTypeEnum.ALL_DAY}
            disableReason={`The selected time range is "all day", the scheduler will run for 24hrs within the given date range.`}
          />
          <HoverTimeRangeListDialog
            open={open}
            onClose={handleClose}
            rangeList={ranges}
          />
        </div>
      )}
    </div>
  );
}

interface IHoverTimeRangeListDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  rangeList: IDaypartingTimeRange[];
}

function HoverTimeRangeListDialog(props: IHoverTimeRangeListDialogProps) {
  const { onClose, open, rangeList } = props;

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: 'center' }}>Hours of Day</DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DialogContentText>
          {rangeList.length > 0 &&
            rangeList.map((range, index) => (
              <div key={index}>
                <Typography>
                  {getFormattedTimezoneTimeRange(
                    range.startTime,
                    range.endTime,
                    TIME_FORMAT_2,
                    TIME_FORMAT_3
                  )}
                </Typography>
                <Divider sx={{ margin: '0.5rem 0' }} />
              </div>
            ))}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
