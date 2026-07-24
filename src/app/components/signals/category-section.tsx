import styles from './category-section.module.scss';

interface Props {
  label: string;
  count: number;
  children: React.ReactNode;
}

export function CategorySection({ label, count, children }: Props) {
  if (count === 0) return null;
  return (
    <section className={styles.categorySection}>
      {children}
    </section>
  );
}