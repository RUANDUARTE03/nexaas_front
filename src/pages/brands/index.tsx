import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const i18nConfig = require('../../../next-i18next.config.js');

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      [
        'brand',
        'store-menu',
        'profile-menu',
        'delete-modal',
      ],
      i18nConfig
    )),
  },
});
export { default } from '../../features/brands-page';
