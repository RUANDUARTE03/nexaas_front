import React from 'react';
import BtnActions from '../btnActions';
import Styles from './actions.module.scss';

type actionsProps = {
  actions: {
    icon?: null | React.ReactElement;
    disabled?: boolean;
    label: string;
    className: string;
    actionButton: string;
  }[];
};

export default function Actions({ actions }: actionsProps) {
  return (
    <div className={Styles.container}>
      {actions.map((ac) => (
        <BtnActions
          icon={ac.icon}
          label={ac.label}
          className={ac.className}
          disabled={!!ac.disabled}
          actionButton={ac.actionButton}
        />
      ))}
    </div>
  );
}
