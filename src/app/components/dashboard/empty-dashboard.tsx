import { PlusIcon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { pickFunFact, rememberFunFact } from '@/constants/dashboard/fun-facts';
import styles from './dashboard.module.scss';

const EASE = [0.22, 0.8, 0.3, 1] as const;

/** A card floating above the board, bobbing gently on its own beat. */
function Floater({ x, y, delay, children }: { x: number; y: number; delay: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
      transition={reduce ? { duration: 0 } : {
        opacity: { duration: 0.5, delay },
        y: { duration: 4.2, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <g transform={`translate(${x} ${y})`}>{children}</g>
    </motion.g>
  );
}

/** An empty board with dashed slots, and three small nuggets hovering over it, waiting to land. */
function EmptyArt() {
  const slots = [[52, 108], [168, 108], [284, 108], [52, 170], [168, 170], [284, 170]];
  return (
    <svg viewBox="0 0 420 240" className={styles.emptyArt} aria-hidden focusable="false">
      <rect className={styles.emptyBoard} x="32" y="92" width="356" height="136" rx="16" />
      {slots.map(([sx, sy]) => <rect key={`${sx}-${sy}`} className={styles.emptySlot} x={sx} y={sy} width="96" height="48" rx="9" />)}

      {/* A ring split by category */}
      <Floater x={46} y={20} delay={0.25}>
        <rect className={styles.artCard} width="104" height="64" rx="10" />
        <circle cx="30" cy="32" r="15" className={styles.emptyRingTrack} />
        <circle cx="30" cy="32" r="15" className={styles.emptyRing} strokeDasharray="62 94" transform="rotate(-90 30 32)" />
        <rect className={styles.artLineDark} x="54" y="22" width="38" height="5" rx="2.5" />
        <rect className={styles.artLine} x="54" y="33" width="28" height="4" rx="2" />
        <rect className={styles.artLine} x="54" y="42" width="34" height="4" rx="2" />
      </Floater>

      {/* A rising line */}
      <Floater x={158} y={4} delay={0.4}>
        <rect className={styles.artCard} width="104" height="64" rx="10" />
        <rect className={styles.artLineDark} x="12" y="12" width="40" height="5" rx="2.5" />
        <path className={styles.artGainArea} d="M12 54 L12 44 L30 41 L46 45 L62 34 L78 36 L92 24 L92 54 Z" />
        <polyline className={styles.artGainLine} points="12,44 30,41 46,45 62,34 78,36 92,24" />
      </Floater>

      {/* A ranked list */}
      <Floater x={270} y={22} delay={0.55}>
        <rect className={styles.artCard} width="104" height="64" rx="10" />
        {[0.9, 0.62, 0.38].map((share, i) => (
          <g key={share}>
            <rect className={i === 0 ? styles.artLineDark : styles.artLine} x="12" y={12 + i * 16} width="34" height="4" rx="2" />
            <rect className={styles.artRankTrack} x="52" y={12 + i * 16} width="40" height="4" rx="2" />
            <rect className={i === 0 ? styles.artRankBar : styles.artRankBarSoft} x="52" y={12 + i * 16} width={40 * share} height="4" rx="2" />
          </g>
        ))}
      </Floater>
    </svg>
  );
}

/**
 * What an empty dashboard shows: a drawing of a board waiting for its first nuggets, a fun fact or pun that changes on
 * every visit, and Add nugget in the middle. Once a nugget is added, the button moves up to the header (`layoutId`).
 */
export default function EmptyDashboard({ onAdd, onTemplates, hasTemplates }: {
  onAdd: () => void; onTemplates: () => void; hasTemplates: boolean;
}) {
  const reduce = useReducedMotion();
  const [fact] = useState(() => pickFunFact());
  useEffect(() => { rememberFunFact(fact.index); }, [fact.index]);
  const rise = (delay: number) => (reduce
    ? {}
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: EASE } });

  return (
    <section className={styles.empty} aria-label="Your dashboard is empty">
      <motion.div {...rise(0.1)}><EmptyArt /></motion.div>
      <motion.div className={styles.emptyCopy} {...rise(0.3)}>
        <span className={styles.emptyFactLabel}>{fact.kind === 'fact' ? 'Fun fact' : 'Pun of the day'}</span>
        <p className={styles.emptyFact}>{fact.text}</p>
      </motion.div>
      <motion.div className={styles.emptyActions} {...rise(0.45)}>
        <motion.button layoutId="add-nugget" type="button" className={`${styles.btnPrimary} ${styles.btnInvite} ${styles.emptyAdd}`} onClick={onAdd}>
          <PlusIcon size={15} weight="bold" />Add nugget
        </motion.button>
        {hasTemplates && <button type="button" className={styles.emptyLink} onClick={onTemplates}>or start from a template</button>}
      </motion.div>
    </section>
  );
}
