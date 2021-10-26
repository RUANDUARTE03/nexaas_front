import React from 'react';
import { render } from '@testing-library/react';
import ButtonChameleon from './ButtonChameleon';

type ButtonChameleonProps = {
  label: string;
  onClick: () => void;
  icon: boolean;
  primary?: boolean;
  negative?: boolean;
  outline?: boolean;
  dataTestId?: string;
};

const renderComponentButtonChameleon = ({
  label,
  onClick,
  icon = false,
  primary = false,
  negative = false,
  outline = false,
  dataTestId,
}: ButtonChameleonProps) => {
  return render(
    <ButtonChameleon
      label={label}
      onClick={onClick}
      dataTestId={dataTestId}
      icon={icon}
      primary={primary}
      negative={negative}
      outline={outline}
    />
  );
};

describe('Tests button chameleon', () => {
  it('Should call onClick', () => {
    const onClickSubmit = jest.fn();
    const wrapper = renderComponentButtonChameleon({
      label: 'LABEL_BTN',
      onClick: onClickSubmit,
      icon: false,
      primary: false,
      negative: false,
      outline: false,
      dataTestId: 'btn_click_action',
    });

    wrapper.getByTestId('btn_click_action').click();
    expect(onClickSubmit).toHaveBeenCalledTimes(1);
  });

  it('Should show label received in props', () => {
    const wrapper = renderComponentButtonChameleon({
      label: 'LABEL_TEST',
      onClick: jest.fn(),
      icon: false,
      primary: false,
      negative: false,
      outline: false,
      dataTestId: 'btn_click_action',
    });

    wrapper.getByText('LABEL_TEST');
  });

  it('Should check if class is correctly', () => {
    const wrapper = renderComponentButtonChameleon({
      label: 'LABEL_TEST',
      onClick: jest.fn(),
      icon: true,
      primary: true,
      negative: true,
      outline: true,
      dataTestId: 'btn_click_action',
    });

    expect(wrapper.container.firstChild).toHaveClass(
      'ch-button--primary'
    );
    expect(wrapper.container.firstChild).toHaveClass(
      'ch-button--negative'
    );
    expect(wrapper.container.firstChild).toHaveClass(
      'ch-button--outline'
    );
    expect(wrapper.container.firstChild).toHaveClass(
      'has-icon'
    );
  });

  it('If props icon to equal true, should render icon', () => {
    const wrapper = renderComponentButtonChameleon({
      label: 'LABEL_TEST',
      onClick: jest.fn(),
      icon: true,
      primary: false,
      negative: false,
      outline: false,
      dataTestId: 'btn_click_action',
    });

    expect(
      wrapper.container.firstChild.firstChild
    ).toHaveClass('icon-plus-btn');
  });
});
