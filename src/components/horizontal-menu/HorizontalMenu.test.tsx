import React from 'react';
import { render } from '@testing-library/react';
import HorizontalMenu from './HorizontalMenu';

type HorizontalMenuProps = {
  breadcumb: {
    text: string;
    click?: () => void;
  }[];
  children: JSX.Element;
};

function HorizontalMenuComponent({
  breadcumb,
  children,
}: HorizontalMenuProps) {
  return render(
    <HorizontalMenu
      breadcumb={breadcumb}
      children={children}
    />
  );
}

describe('Tests component HorizontalMenu', () => {
  it('Should render component corretly', () => {
    HorizontalMenuComponent({
      breadcumb: [{ text: 'breadcumb' }],
      children: <h1>Children</h1>,
    });
  });

  it('Should show children and breadcump', () => {
    const wrapper = HorizontalMenuComponent({
      breadcumb: [{ text: 'breadcumb' }],
      children: <h1>ShowChildren</h1>,
    });

    wrapper.getByText('ShowChildren');
    wrapper.getByText('breadcumb');
  });
});
