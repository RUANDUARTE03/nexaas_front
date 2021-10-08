import { useEffect } from 'react';
import styles from './HorizontalMenu.module.scss';

interface HorizontalMenuProps {
  breadcumb: string;
  children: JSX.Element;
}

export default function HorizontalMenu({
  breadcumb,
  children,
}: HorizontalMenuProps) {
  useEffect(() => {
    const header = document.getElementById('header');
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener(
      'scroll',
      () => {
        if (window.pageYOffset > sticky) {
          header.classList.add(styles.isSticky);
        } else {
          header.classList.remove(styles.isSticky);
        }
      }
    );
    return () => {
      window.removeEventListener('scroll', scrollCallBack);
    };
  }, []);

  return (
    <header
      id="header"
      className={`${styles.horizontalMenu}`}
    >
      <div className={styles.breadcumb}>{breadcumb}</div>
      <div>{children}</div>
    </header>
  );
}
