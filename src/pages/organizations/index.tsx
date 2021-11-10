import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'organization',
      'store-menu',
      'profile-menu',
      'delete-modal'
    ])),
  },
});
export { default } from '../../features/organization-page';
