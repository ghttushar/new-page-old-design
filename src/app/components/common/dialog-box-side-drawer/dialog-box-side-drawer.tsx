import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { BootstrapDialog } from './dialog-box-side-drawer-styles';

type TTitleAlignment = 'flex-start' | 'flex-end';

interface IDialogBoxSideDrawerProps {
  openDialog: boolean;
  handleCloseDialog: () => void;
  title: string;
  titleAlign?: TTitleAlignment;
  headerChildren?: React.ReactNode;
  bodyChildren?: React.ReactNode;
}

export default function DialogBoxSideDrawer({
  openDialog,
  handleCloseDialog,
  title,
  titleAlign,
  headerChildren,
  bodyChildren,
}: IDialogBoxSideDrawerProps) {
  return (
    <BootstrapDialog
      onClose={handleCloseDialog}
      aria-labelledby="side-drawer-dialog-title"
      aria-describedby="side-drawer-dialog-description"
      open={openDialog}
      sx={{
        '.MuiPaper-root': {
          maxHeight: 'unset',
        },
      }}
    >
      <BootstrapDialogTitle id="side-drawer-dialog-title">
        <Typography
          fontSize="2.4rem"
          fontWeight={700}
          sx={{ height: 'auto', alignSelf: titleAlign ? titleAlign : 'center' }}
        >
          {title}
        </Typography>
        <DialogActions
          sx={{
            padding: '0 !important',
            alignSelf: 'flex-start',
          }}
        >
          {headerChildren}
        </DialogActions>
      </BootstrapDialogTitle>
      <Divider />
      <DialogContent
        id="side-drawer-dialog-description"
        sx={{ p: '2.5rem 2rem !important' }}
      >
        {bodyChildren}
      </DialogContent>
    </BootstrapDialog>
  );
}

interface IDialogTitleProps {
  id: string;
  children?: React.ReactNode;
}

function BootstrapDialogTitle(props: IDialogTitleProps) {
  const { children, ...other } = props;

  return (
    <DialogTitle
      sx={{
        height: '7.5rem',
        m: 0,
        p: '1rem 1rem 1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      {...other}
    >
      {children}
    </DialogTitle>
  );
}
