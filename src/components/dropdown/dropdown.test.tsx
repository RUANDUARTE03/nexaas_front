import React from 'react';
import Dropdown from '.';
import { render } from '@testing-library/react';

interface DropdownProps {
  children: JSX.Element;
  overlay: JSX.Element;
  showOnHover?: boolean;
}

function renderDropdown({
  children,
  overlay,
  showOnHover,
}: DropdownProps) {
  return render(
    <Dropdown overlay={overlay} showOnHover={showOnHover}>
      {children}
    </Dropdown>
  );
}

describe('Tests dropdown component', () => {
  it('Should render succesfully', () => {
    renderDropdown({
      overlay: <div />,
      children: <div />,
      showOnHover: false,
    });
  });
});
