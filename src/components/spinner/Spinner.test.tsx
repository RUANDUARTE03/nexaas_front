import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '.';

type SpinnerProps = {
  spinning: boolean;
  children: JSX.Element;
};

function renderSpinner({
  children,
  spinning,
}: SpinnerProps) {
  return render(
    <Spinner children={children} spinning={spinning} />
  );
}

describe('Tests component Spinner', () => {
  it('Should render component correctly', () => {
    renderSpinner({
      children: <h1>Spinner</h1>,
      spinning: false,
    });
  });

  it('Should show spinner if props spinning to equal true', () => {
    const wrapper = renderSpinner({
      children: <h1>Spinner</h1>,
      spinning: true,
    });

    const containerSpinner = wrapper.getByTestId(
      'container-spinner'
    );
    expect(containerSpinner).toBeInTheDocument();
  });

  it('Should render children', () => {
    const wrapper = renderSpinner({
      children: <h1>Spinner</h1>,
      spinning: false,
    });

    wrapper.getByText('Spinner');
  });
});
