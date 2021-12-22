import React, { useState } from 'react';
import '@nexaas/chameleon/dist/chameleon.css';
import '../styles/styleGlobal.css';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import NextCors from 'nextjs-cors';
import { useApollo } from '../graphql/apolloClient';
import { storeWrapper } from '../store';
import Navigation from '../components/navigation';

const nextI18NextConfig = require('../../next-i18next.config.js');

async function handler(req, res) {
  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  // Rest of the API logic
  res.json({ message: 'Hello NextJs Cors!' });
}

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
        <Component {...pageProps} />
      </div>
    </ApolloProvider>
  );
}

export default storeWrapper.withRedux(
  appWithTranslation(MyApp, nextI18NextConfig)
);
