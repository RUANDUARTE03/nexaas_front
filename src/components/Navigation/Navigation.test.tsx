import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Navigation from '.';

jest.mock('next/image', () => (props: any) => (
  <img {...props} />
));

type NavigationProps = {
  setExpanded: (expanded: boolean) => void;
  setDrawerB: (drawerB: boolean) => void;
};

function renderNavigation({
  setDrawerB,
  setExpanded,
}: NavigationProps) {
  return render(
    <Navigation
      setDrawerB={setDrawerB}
      setExpanded={setExpanded}
    />
  );
}

describe('Test component Navigation', () => {
  it('Should render correctly', () => {
    renderNavigation({
      setDrawerB: () => {},
      setExpanded: () => {},
    });
  });
  it('Should call actions the subMenu', () => {
    const wrapper = renderNavigation({
      setDrawerB: () => {},
      setExpanded: () => {},
    });

    wrapper.getAllByTestId('btn-subMenu')[0].click();

    expect(
      wrapper.getAllByTestId('container-subMenu')[0]
    ).toHaveClass('is-open');

    wrapper
      .getAllByTestId('btn-click-itemSubMenu')[0]
      .click();

    wrapper.getAllByTestId('btn-subMenu')[0].click();

    expect(
      wrapper.getAllByTestId('container-subMenu')[0]
    ).not.toHaveClass('is-open');
  });

  it('Should call expanded drawer when click button', () => {
    const wrapper = renderNavigation({
      setDrawerB: () => {},
      setExpanded: () => {},
    });

    wrapper
      .getByTestId('btn-action-expandedDrawer')
      .click();
  });

  it('Should render actions when events mouse', () => {
    const wrapper = renderNavigation({
      setDrawerB: () => {},
      setExpanded: () => {},
    });

    fireEvent.mouseEnter(
      wrapper.getByTestId('container-template'),
      {
        key: 'Enter',
        keyCode: 13,
      }
    );
    fireEvent.mouseLeave(
      wrapper.getByTestId('container-template'),
      {
        key: 'Enter',
        keyCode: 13,
      }
    );
  });
});
