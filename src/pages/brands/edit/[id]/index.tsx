import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const i18nConfig = require('../../../../../next-i18next.config.js');

export const getServerSideProps: GetServerSideProps =
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(
        locale,
        ['create-edit-brand', 'store-menu', 'profile-menu'],
        i18nConfig
      )),
    },
  });

export { default } from '../../../../features/brands-page/create-edit-brand';
