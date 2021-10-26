/* eslint-disable react/jsx-curly-newline */
import RCDropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import { useState, useMemo } from 'react';
import Styles from './dropdown.module.scss';

/* eslint-disable react/jsx-curly-newline */

interface DropdownProps {
  children: JSX.Element;
  overlay: JSX.Element;
  showOnHover?: boolean;
}

export default function Dropdown({
  children,
  overlay,
  showOnHover,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const overlayWrapped = useMemo(
    () => (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setVisible(false)}
      >
        {overlay}
      </div>
    ),
    [overlay]
  );

  return (
    <RCDropdown
      onVisibleChange={(visibleChanged) =>
        setVisible(visibleChanged)
      }
      overlay={overlayWrapped}
      overlayClassName={visible ? Styles.overlayMenu : null}
      trigger={!showOnHover ? ['click'] : null}
    >
      {children}
    </RCDropdown>
  );
}
