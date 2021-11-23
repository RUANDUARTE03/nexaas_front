import React from 'react';
import { render } from '@testing-library/react';
import HorizontalMenu from './HorizontalMenu';

type HorizontalMenuProps = {
  breadcump: string;
  children: JSX.Element;
};

function HorizontalMenuComponent({
  breadcump,
  children,
}: HorizontalMenuProps) {
  return render(
    <HorizontalMenu
      breadcumb={breadcump}
      children={children}
    />
  );
}

describe('Tests component HorizontalMenu', () => {
  it('Should render component corretly', () => {
    HorizontalMenuComponent({
      breadcump: 'stringTest',
      children: <h1>Children</h1>,
    });
  });

  it('Should show children and breadcump', () => {
    const wrapper = HorizontalMenuComponent({
      breadcump: 'stringTest',
      children: <h1>ShowChildren</h1>,
    });

    wrapper.getByText('ShowChildren');
    wrapper.getByText('stringTest');
  });
});
