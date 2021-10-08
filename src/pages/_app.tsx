import React, { useState } from 'react';
import '@nexaas/chameleon/dist/chameleon.css';
import '../styles/styleGlobal.css';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../graphql/apolloClient';
import Navigation from '../components/Navigation';
import { storeWrapper } from '../store';
import Content from '../components/content';

function MyApp({ Component, pageProps }) {
  const [insertML, setInsertML] = useState<boolean>(false);
  const [drawerBottom, setDrawerBottom] =
    useState<boolean>(false);
  const apolloClient = useApollo(
    pageProps.initialApolloState
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Navigation
        setExpanded={(exp) => {
          setInsertML(exp);
        }}
        setDrawerB={(db) => {
          setDrawerBottom(db);
        }}
      />
      <div
        className={`${
          drawerBottom
            ? ''
            : insertML
            ? 'nex_container'
            : 'nex_container_collapse'
        }`}
      >
        <Content>
          <Component {...pageProps} />
        </Content>
      </div>
    </ApolloProvider>
  );
}

export default storeWrapper.withRedux(MyApp);
