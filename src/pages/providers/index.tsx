import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export { default } from '../../features/providerScreen';

export const getStaticProps: GetStaticProps = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'provider',
      'store-menu',
      'profile-menu',
      'delete-modal'
    ])),
  },
});
