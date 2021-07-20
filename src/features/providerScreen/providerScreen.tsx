import React from 'react';
import Header from '../../components/header';
import Styles from './providerScreen.module.scss';

export default function ProviderScreen() {
  return (
    <div className={Styles.container}>
      <Header
        navigation={[
          {
            title: 'Fornecedores',
          },
        ]}
      />
      <h1>ProviderScreen</h1>
    </div>
  );
}
