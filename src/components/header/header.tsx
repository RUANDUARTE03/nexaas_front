import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import Styles from './header.module.scss';

type HeaderProps = {
  navigation: {
    title: string;
    link?: string;
  }[];
};

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export default function Header({
  navigation,
}: HeaderProps) {
  const router = useRouter();
  return (
    <div className={Styles.container}>
      <div className={Styles.bodyBarNavigation}>
        {navigation.map((nav, index) => (
          <>
            {index !== 0 && (
              <p className={Styles.separator}>/</p>
            )}
            <div
              className={`${
                index !== navigation.length - 1
                  ? Styles.btnClickRedirect
                  : null
              }`}
              onClick={() => {
                nav.link ? router.push(nav.link) : null;
              }}
            >
              <Typography variant="subtitle1">
                {nav.title}
              </Typography>
            </div>
          </>
        ))}
      </div>
      <div className={Styles.bodyActions} />
    </div>
  );
}
