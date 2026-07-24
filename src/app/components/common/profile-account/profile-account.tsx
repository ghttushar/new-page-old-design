import Typography from '@mui/material/Typography';
import { useAppSelector } from 'src/redux/hooks';
import { selectAccount, selectUser } from 'src/redux/slices/auth/auth.slice';
import styles from './profile-account.module.scss';

export default function ProfileAccount() {
  const account = useAppSelector(selectAccount);
  const user = useAppSelector(selectUser);
  return (
    <div className={styles.profileAccountContainer}>
      <Typography
        fontSize="1.4rem"
        fontWeight={700}
        lineHeight={'2rem'}
        maxWidth={'18rem'}
      >
        {account?.brandName}
      </Typography>
    </div>
  );
}
