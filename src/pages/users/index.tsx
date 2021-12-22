import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const i18nConfig = require('../../../next-i18next.config.js');

export { default } from '../../features/user-page';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      [
        'user',
        'store-menu',
        'profile-menu',
        'delete-modal',
      ],
      i18nConfig
    )),
  },
});
