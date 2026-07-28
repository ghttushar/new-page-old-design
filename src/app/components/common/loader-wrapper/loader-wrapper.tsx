import styles from './loader-wrapper.module.scss';

export default function LoaderWrapper() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
}
