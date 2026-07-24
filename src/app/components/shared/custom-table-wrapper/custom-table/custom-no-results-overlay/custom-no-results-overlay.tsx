import styles from './custom-no-results-overlay.module.scss';

/* eslint-disable-next-line */
export interface CustomNoResultsOverlayProps {
  noResultsOverlay?: JSX.Element;
}

export function CustomNoResultsOverlay(props: CustomNoResultsOverlayProps) {
  const { noResultsOverlay } = props;
  return (
    <div className={`${styles.customNoResultsOverlay} `}>
      <div className={styles.container}>
        {noResultsOverlay ? (
          noResultsOverlay
        ) : (
          <div className={styles.content}>
            <p className={styles.text}>No Data Found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomNoResultsOverlay;
