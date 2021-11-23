import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps =
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale, [
        'create-edit-organization',
        'store-menu',
        'profile-menu',
      ])),
    },
  });

export { default } from '../../../../features/organization-page/create-edit-organization';
