import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export { default } from '../../../features/organization-page/create-edit-organization';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'create-edit-organization',
      'store-menu',
      'profile-menu',
    ])),
  },
});
