import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputChameleon from '.';
import userEvent from '@testing-library/user-event';

type optionsProps = {
  value: string | number;
  label: string;
};

type InputChameleonProps = {
  label: string;
  value: string | number;
  onChange: (e: any) => void;
  mode: 'text' | 'select';
  onKeyUp?: (e: any) => void;
  options?: optionsProps[];
  required?: boolean;
  type?: 'text' | 'number';
};

const mockOptions: optionsProps[] = [
  { value: 'valueOne', label: 'one' },
  { value: 'valueTwo', label: 'two' },
  { value: 'valueThree', label: 'three' },
];

function renderScreen({
  label,
  value,
  onChange,
  mode,
  type,
  required = false,
  onKeyUp,
  options,
}: InputChameleonProps) {
  return render(
    <InputChameleon
      label={label}
      value={value}
      onChange={onChange}
      mode={mode}
      type={type}
      required={required}
      onKeyUp={onKeyUp}
      options={options}
    />
  );
}

describe('Tests input chameleon', () => {
  it('Should render succesfully', () => {
    renderScreen({
      label: 'label test',
      value: 'string;',
      onChange: () => {},
      mode: 'text',
    });
  });

  it('Should render label to equal props', () => {
    const wrapper = renderScreen({
      label: 'label test',
      value: 'string;',
      onChange: () => {},
      mode: 'text',
      required: true,
    });

    expect(
      wrapper.getByText('label test')
    ).toBeInTheDocument();
    expect(wrapper.getByText('*')).toBeInTheDocument();
  });

  it('Should call onKeyUp', async () => {
    const wrapper = renderScreen({
      label: 'label test',
      value: 'string',
      onChange: () => {},
      mode: 'text',
      required: true,
      onKeyUp: () => {},
    });

    fireEvent.keyUp(wrapper.getAllByRole('textbox')[0], {
      key: 'Enter',
      keyCode: 13,
    });
  });

  it('Should render mode select', () => {
    renderScreen({
      label: 'label test',
      value: '',
      onChange: () => {},
      mode: 'select',
      options: mockOptions,
    });
  });

  it('Should render options', () => {
    const wrapper = renderScreen({
      label: 'label test',
      value: '',
      onChange: () => {},
      mode: 'select',
      required: true,
      options: mockOptions,
    });

    wrapper.getByText('one');
    wrapper.getByText('two');
    wrapper.getByText('three');
  });
});
