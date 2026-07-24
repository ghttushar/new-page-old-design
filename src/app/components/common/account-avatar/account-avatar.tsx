import { useEffect, useState } from 'react';
import { IUser } from 'src/interfaces/auth.interfaces';
import styles from './account-avatar.module.scss';

interface IAccountAvatarProps {
  user: IUser;
}

export default function AccountAvatar({ user }: IAccountAvatarProps) {
  const [avatarName, setAvatarName] = useState<string>('');

  useEffect(() => {
    let avatar = '';
    if (user.firstName) avatar = user.firstName[0]?.toUpperCase();
    if (user.lastName) avatar += user.lastName[0]?.toUpperCase();

    setAvatarName(avatar);
  }, [user.firstName, user.lastName]);

  return <div className={styles.accountAvatar}>{avatarName}</div>;
}
