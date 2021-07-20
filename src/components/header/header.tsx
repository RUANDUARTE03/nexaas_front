import React from 'react';
import Typography from '@material-ui/core/Typography';
import Styles from './header.module.scss';

type HeaderProps = {
  navigation: {
    title: string;
    link?: () => void;
  }[];
};

export default function Header({ navigation }: HeaderProps) {
  return (
    <div className={Styles.container}>
      <div className={Styles.bodyBarNavigation}>
        {navigation.map((nav) => (
          <Typography variant="subtitle1">{nav.title}</Typography>
        ))}
      </div>
      <div className={Styles.bodyActions} />
    </div>
  );
}
