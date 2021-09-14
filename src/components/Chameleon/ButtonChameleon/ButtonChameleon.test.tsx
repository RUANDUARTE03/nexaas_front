import React from 'react';
import { render } from '@testing-library/react';
import ButtonChameleon from './ButtonChameleon';

type ButtonChameleonProps = {
  label: string;
  className?: string;
  onClick: () => void;
  version: 'v1' | 'v2' | 'v3';
  icon?: React.ReactElement;
};

const renderComponentButtonChameleon = ({
  label,
  onClick,
  version,
  className,
  icon,
}: ButtonChameleonProps) => {
  return render(
    <ButtonChameleon
      label={label}
      onClick={onClick}
      version={version}
      className={className}
      icon={icon}
    />
  );
};

it('Should call onClick', () => {
  const onClickSubmit = jest.fn();
  const wrapper = renderComponentButtonChameleon({
    label: 'LABEL_BTN',
    onClick: onClickSubmit,
    version: 'v1',
  });

  wrapper.getByTestId('btn_click_action').click();
  expect(onClickSubmit).toHaveBeenCalledTimes(1);
});

it('Should show label received in props', () => {
  const wrapper = renderComponentButtonChameleon({
    label: 'LABEL_TEST',
    onClick: jest.fn(),
    version: 'v1',
  });

  wrapper.getByText('LABEL_TEST');
});
