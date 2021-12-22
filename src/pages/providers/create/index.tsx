import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const i18nConfig = require('../../../../next-i18next.config.js');

export { default } from '../../../features/provider-screen/create-edit-provider';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      [
        'create-edit-provider',
        'store-menu',
        'profile-menu',
      ],
      i18nConfig
    )),
  },
});
