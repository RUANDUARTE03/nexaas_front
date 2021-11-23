import React from 'react';
import { render } from '@testing-library/react';
import Content from './Content';

type ContentProps = {
  children: JSX.Element;
};

function renderScreen({ children }: ContentProps) {
  return render(<Content children={children} />);
}

describe('Tests Content Component', () => {
  it('Should render succesfuly', () => {
    renderScreen({
      children: <h1>Teste</h1>,
    });
  });
});
