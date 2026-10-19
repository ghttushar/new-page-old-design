import { MoonStarsIcon, SunHorizonIcon, SunIcon, type Icon } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DASHBOARD_USER_NAME, pickGreeting, rememberGreeting } from '@/constants/dashboard/greetings';
import useNow from '@/hooks/use-now.hook';
import styles from './dashboard.module.scss';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Morning, afternoon, evening or night, with an icon to match. */
function partOfDay(hour: number): { label: string; Icon: Icon } {
  if (hour >= 5 && hour < 12) return { label: 'morning', Icon: SunHorizonIcon };
  if (hour >= 12 && hour < 17) return { label: 'afternoon', Icon: SunIcon };
  if (hour >= 17 && hour < 21) return { label: 'evening', Icon: SunHorizonIcon };
  return { label: 'night', Icon: MoonStarsIcon };
}

/** The greeting, word by word, with the user's name set apart. */
function Greeting({ text, name }: { text: string; name: string }) {
  const reduce = useReducedMotion();
  const at = text.indexOf(name);
  const parts = at < 0
    ? [{ t: text, name: false }]
    : [{ t: text.slice(0, at), name: false }, { t: name, name: true }, { t: text.slice(at + name.length), name: false }];
  let i = 0;
  return (
    <h2 className={styles.greeting} aria-label={text}>
      {parts.map((p, pi) => p.t.split(/(\s+)/).filter(Boolean).map((w, wi) => {
        if (/^\s+$/.test(w)) return <span key={`${pi}-${wi}`}>{' '}</span>;
        const delay = 0.18 + (i++) * 0.045;
        return (
          <motion.span
            key={`${pi}-${wi}`} aria-hidden className={p.name ? styles.greetName : styles.greetWord}
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: EASE }}
          >{w}</motion.span>
        );
      }))}
    </h2>
  );
}

/**
 * The top of the dashboard: a tear-off calendar page for today, a greeting that changes on every visit,
 * and the part of the day with a live clock.
 */
export default function DashboardHello() {
  const reduce = useReducedMotion();
  const now = new Date(useNow(10000));
  const [greeting] = useState(() => pickGreeting());
  useEffect(() => { rememberGreeting(greeting.index); }, [greeting.index]);

  const { label, Icon } = partOfDay(now.getHours());
  const [clock, meridiem] = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).split(' ');
  const [hh, mm] = clock.split(':');
  const fullDate = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={styles.hello}>
      <motion.div
        className={styles.cal} aria-hidden
        initial={reduce ? false : { opacity: 0, rotateX: -75 }} animate={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className={styles.calMonth}>{now.toLocaleDateString(undefined, { month: 'short' })}</span>
        <span className={styles.calDay}>{now.getDate()}</span>
        <span className={styles.calWeek}>{now.toLocaleDateString(undefined, { weekday: 'short' })}</span>
      </motion.div>

      <div className={styles.helloText}>
        <Greeting text={greeting.text} name={DASHBOARD_USER_NAME} />
        <motion.p
          className={styles.helloMeta}
          initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.55 }}
        >
          <time className={styles.clock} dateTime={now.toISOString()} aria-label={`${fullDate}, ${clock} ${meridiem}`}>
            <Icon size={15} weight="duotone" className={styles.clockIcon} aria-label={label} />
            {hh}<i aria-hidden>:</i>{mm}<small>{meridiem}</small>
          </time>
          <span className={styles.helloDate}>{now.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </motion.p>
      </div>
    </div>
  );
}
