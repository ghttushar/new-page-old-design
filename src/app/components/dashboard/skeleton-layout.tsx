import { motion, useReducedMotion } from 'motion/react';
import styles from './dashboard.module.scss';

type TileKind = 'kpi' | 'list' | 'feed';

/** Where each placeholder sits on the 12-column grid, in the same sizes real widgets start at. */
const TILES: { kind: TileKind; col: string; row: string }[] = [
  { kind: 'kpi', col: '1 / span 4', row: '1 / span 7' },
  { kind: 'kpi', col: '5 / span 4', row: '1 / span 7' },
  { kind: 'list', col: '9 / span 4', row: '1 / span 10' },
  { kind: 'feed', col: '1 / span 8', row: '8 / span 10' },
];

function TileBody({ kind }: { kind: TileKind }) {
  if (kind === 'kpi') {
    return (
      <>
        <i className={styles.skFigure} />
        <i className={styles.skLine} style={{ width: '34%' }} />
        <div className={styles.skRows}>
          {[72, 48, 30].map((w) => (
            <div key={w} className={styles.skSplit}><i className={styles.skLine} style={{ width: '40%' }} /><i className={styles.skBar} style={{ width: `${w}%` }} /></div>
          ))}
        </div>
      </>
    );
  }
  if (kind === 'list') {
    return (
      <div className={styles.skRows}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skMsg}><i className={styles.skIcon} /><span><i className={styles.skLine} style={{ width: '46%' }} /><i className={styles.skLine} style={{ width: '82%' }} /></span></div>
        ))}
      </div>
    );
  }
  return (
    <div className={styles.skRows}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.skFeed}>
          <i className={styles.skLine} style={{ width: 34 }} />
          <span><i className={styles.skLine} style={{ width: `${62 - i * 6}%` }} /><i className={styles.skLine} style={{ width: '30%' }} /></span>
          <i className={styles.skLine} style={{ width: 44 }} />
        </div>
      ))}
    </div>
  );
}

/** What a new dashboard shows: the outline of one, settling in tile by tile, until widgets are added. */
export default function SkeletonLayout() {
  const reduce = useReducedMotion();
  return (
    <div className={styles.skeleton} aria-hidden>
      {TILES.map((t, i) => (
        <motion.div
          key={i}
          className={styles.skTile}
          style={{ gridColumn: t.col, gridRow: t.row }}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 + i * 0.08, ease: [0.22, 0.8, 0.3, 1] }}
        >
          <div className={styles.skHead}>
            <span><i className={styles.skLine} style={{ width: 96 }} /><i className={styles.skLine} style={{ width: 150 }} /></span>
            <i className={styles.skChip} />
          </div>
          <TileBody kind={t.kind} />
        </motion.div>
      ))}
    </div>
  );
}
