import React from 'react';
import '@nexaas/chameleon/dist/chameleon.css';
import '../styles/styleGlobal.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../graphql/apolloClient';
import { storeWrapper } from '../store';

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(
    pageProps.initialApolloState
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default storeWrapper.withRedux(MyApp);
