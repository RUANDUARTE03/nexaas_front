import styles from './HorizontalMenu.module.scss';

interface HorizontalMenuProps {
  breadcumb: string;
  children: JSX.Element;
}

export default function HorizontalMenu({
  breadcumb,
  children,
}: HorizontalMenuProps) {
  return (
    <header className={styles.horizontalMenu}>
      <div className={styles.breadcumb}>{breadcumb}</div>
      <div>{children}</div>
    </header>
  );
}
