import { useEffect } from 'react';
import styles from './HorizontalMenu.module.scss';

/* eslint-disable jsx-a11y/no-static-element-interactions */
interface HorizontalMenuProps {
  breadcumb: {
    text: string | HTMLElement;
    click?: () => void;
  }[];
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
      window.removeEventListener(
        'scroll',
        () => scrollCallBack
      );
    };
  }, []);

  return (
    <header
      id="header"
      className={`${styles.horizontalMenu}`}
    >
      <div className={styles.breadcumb}>
        {breadcumb.map((bread, index) => {
          return (
            <div
              key={index}
              onClick={bread.click ? bread.click : () => {}}
              className={bread.click ? styles.bread : ''}
            >
              {bread.text}
              <p>{bread.click && '/'}</p>
            </div>
          );
        })}
      </div>
      <div>{children}</div>
    </header>
  );
}
