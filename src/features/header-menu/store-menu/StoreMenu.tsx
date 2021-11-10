import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Styles from './StoreMenu.module.scss';

const storesUrls = {
  myFinance: 'https://sandbox.conta.fintera.com.br/',
  analytics: 'https://homologation.analytics.nexaas.com/',
  pdVend: 'https://app.qa.plug-and-play.pdvend.com.br/',
  emites: 'https://app.homologation.emites.com.br/',
  cobrato: 'https://sandbox.cobrato.com',
};

export default function StoreMenu() {
  const { t } = useTranslation('store-menu');

  return (
    <div>
      <div
        className={Styles.storeMenuContainer}
        style={{ fontSize: '1rem' }}
      >
        <div className={Styles.menuTitle}>
          <h6>{t('goTo')}</h6>
        </div>

        <a
          href={storesUrls.myFinance}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            width="50"
            height="50"
            src="/logo-myfinance.png"
            alt="profile"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Myfinance
            </strong>
            <span>{t('myFinance')}</span>
          </div>
        </a>

        <a
          href={storesUrls.analytics}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            width="50"
            height="50"
            src="/logo-analytics.png"
            alt="analytics"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Analytics
            </strong>
            <span>{t('analytics')}</span>
          </div>
        </a>

        <a
          href={storesUrls.pdVend}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            width="50"
            height="50"
            src="/logo-pdvend.png"
            alt="pdvend"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              PDVend
            </strong>
            <span>{t('pdVend')}</span>
          </div>
        </a>

        <a
          href={storesUrls.emites}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            width="50"
            height="50"
            src="/logo-emites.png"
            alt="emites"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Emites
            </strong>
            <span>{t('emites')}</span>
          </div>
        </a>

        <a
          href={storesUrls.cobrato}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            width="50"
            height="50"
            src="/logo-cobrato.png"
            alt="cobrato"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Cobrato
            </strong>
            <span>{t('cobrato')}</span>
          </div>
        </a>
      </div>
    </div>
  );
}
