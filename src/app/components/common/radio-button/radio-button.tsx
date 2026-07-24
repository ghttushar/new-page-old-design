import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import { IUser } from 'src/interfaces/auth.interfaces';
import { avatarStyle, radioStyles } from './radio-button-styles';
import styles from './radio-button.module.scss';

interface IRadioButtonProps {
  user: IUser;
  data: any;
}

export default function RadioButton(props: IRadioButtonProps) {
  const { user, data } = props;

  return (
    <FormControlLabel
      className={styles.radioContainer}
      value={data.accountId._id}
      control={<Radio disableRipple sx={radioStyles} />}
      labelPlacement="start"
      label={
        <div className={styles.labelContainerStyle}>
          <Avatar
            sx={avatarStyle}
            alt={`${data.accountId.brandName.toUpperCase()}`}
            src="/path/to/avatar.jpg"
          />
          <div>
            <Typography fontSize="1.4rem" fontWeight={600}>
              {data.accountId.brandName}
            </Typography>
            <Typography fontSize="1.2rem" fontWeight={400}>
              {user.email}
            </Typography>
          </div>
        </div>
      }
    />
  );
}
