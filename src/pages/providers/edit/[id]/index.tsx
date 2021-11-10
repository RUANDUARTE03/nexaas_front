import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export { default } from '../../../../features/providerScreen/createOrEditProvider';

export const getServerSideProps: GetServerSideProps =
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale, [
        'create-edit-provider',
        'store-menu',
        'profile-menu',
      ])),
    },
  });
