import React from 'react';
import '../styles/styleGlobal.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../graphql/apolloClient';

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

export default MyApp;
