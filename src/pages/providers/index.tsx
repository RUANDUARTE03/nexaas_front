import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const i18nConfig = require('../../../next-i18next.config.js');

export { default } from '../../features/provider-screen';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      [
        'provider',
        'store-menu',
        'profile-menu',
        'delete-modal',
      ],
      i18nConfig
    )),
  },
});
