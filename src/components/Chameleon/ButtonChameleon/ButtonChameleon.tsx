import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fas);

type ButtonChameleonProps = {
  label: string;
  onClick: () => void;
  icon: boolean;
  primary?: boolean;
  negative?: boolean;
  outline?: boolean;
};

export default function ButtonChameleon({
  label,
  onClick,
  icon = false,
  primary,
  negative,
  outline,
}: ButtonChameleonProps) {
  return (
    <button
      type="button"
      className={`ch-button ${
        primary && 'ch-button--primary'
      } ${negative && 'ch-button--negative'} ${
        outline && 'ch-button--outline'
      } ${icon && 'has-icon'}`}
      onClick={onClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon="plus"
          style={{ marginRight: 8 }}
        />
      )}
      {label}
    </button>
  );
}
