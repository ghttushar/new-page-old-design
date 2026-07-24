import styles from './floating-toast.module.scss';

interface IFloatingToastProps {
  message: string;
}

const FloatingToast = (props: IFloatingToastProps) => {
  const { message } = props;

  return (
    <div className={styles.floatingToast}>
      <p>{message}</p>
    </div>
  );
};

export default FloatingToast;
