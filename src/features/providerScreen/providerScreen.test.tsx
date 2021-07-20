import React from 'react';
import { render } from '@testing-library/react';
import ProviderScreen from './providerScreen';

it('Should render correctly', () => {
  const wrapper = render(<ProviderScreen />);
  expect(wrapper).toBeDefined();
});
