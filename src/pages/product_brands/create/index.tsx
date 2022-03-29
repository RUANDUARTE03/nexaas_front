import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export { default } from '../../../features/brands-page/create-edit-brand';
const i18nConfig = require('../../../../next-i18next.config.js');

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['create-edit-brand', 'store-menu', 'profile-menu'],
      i18nConfig
    )),
  },
});
