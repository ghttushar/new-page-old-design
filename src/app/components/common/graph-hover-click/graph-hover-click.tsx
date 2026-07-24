import { CornersOutIcon } from '@phosphor-icons/react';
import styles from './graph-hover-click.module.scss';

export function GraphHoverClick() {
  return (
    <div className={styles.container}>
      <CornersOutIcon
        size={'2.4rem'}
        className={styles.icon}
        color="white"
        weight="bold"
      />
    </div>
  );
}

export default GraphHoverClick;
