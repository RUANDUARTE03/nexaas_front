import React from 'react';
import { render } from '@testing-library/react';
import DeleteModal from '.';

type DeleteModalProps = {
  title: string;
  children: JSX.Element;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

function renderScreen({
  title,
  children,
  open,
  onClose,
  onSubmit,
}: DeleteModalProps) {
  return render(
    <DeleteModal
      title={title}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      {children}
    </DeleteModal>
  );
}

describe('Tests delete modal component', () => {
  it('Should render succesfully', () => {
    renderScreen({
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      title: 'title for test',
      open: true,
      children: <span>Teste</span>,
    });
  });

  it('Should show title and children received in props', () => {
    const wrapper = renderScreen({
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      title: 'title for test',
      open: true,
      children: <span>Teste children</span>,
    });

    expect(
      wrapper.getByText('title for test')
    ).toBeInTheDocument();

    expect(
      wrapper.getByText('Teste children')
    ).toBeInTheDocument();
  });

  it.each(['onClose', 'onSubmit'])(
    'Should call action the buttons before onClick',
    (action) => {
      const fnOnClose = jest.fn();
      const fnOnSubmit = jest.fn();
      const wrapper = renderScreen({
        onClose: fnOnClose,
        onSubmit: fnOnSubmit,
        title: 'title for test',
        open: true,
        children: <span>Teste children</span>,
      });

      if (action === 'onClose') {
        wrapper
          .getByTestId('btn-action-close-modal')
          .click();
        expect(fnOnClose).toHaveBeenCalledTimes(1);
      } else {
        wrapper
          .getByTestId('btn-action-submit-modal')
          .click();
        expect(fnOnSubmit).toHaveBeenCalledTimes(1);
      }
    }
  );
});
