import Loader from '../loader/loader';
import styles from './loader-wrapper.module.scss';

export default function LoaderWrapper() {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayLoader}>
        <Loader />
      </div>
    </div>
  );
}
