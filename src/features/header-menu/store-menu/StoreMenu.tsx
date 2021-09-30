import Image from 'next/image';
import Styles from './StoreMenu.module.scss';
import AnalyticsLogo from '../../../assets/logo-analytics.png';
import CobratoLogo from '../../../assets/logo-cobrato.png';
import EmitesLogo from '../../../assets/logo-emites.png';
import MyFinanceLogo from '../../../assets/logo-myfinance.png';
import PdVendLogo from '../../../assets/logo-pdvend.png';

const storesUrls = {
  myFinance: 'https://sandbox.conta.fintera.com.br/',
  analytics: 'https://homologation.analytics.nexaas.com/',
  pdVend: 'https://app.qa.plug-and-play.pdvend.com.br/',
  emites: 'https://app.homologation.emites.com.br/',
  cobrato: 'https://sandbox.cobrato.com',
};

export default function StoreMenu() {
  return (
    <div>
      <div
        className={Styles.storeMenuContainer}
        style={{ fontSize: '1rem' }}
      >
        <div className={Styles.menuTitle}>
          <h6>Ir para...</h6>
        </div>

        <a
          href={storesUrls.myFinance}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            src={MyFinanceLogo}
            alt="profile"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Myfinance
            </strong>
            <span>Gestão Financeira</span>
          </div>
        </a>

        <a
          href={storesUrls.analytics}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            src={AnalyticsLogo}
            alt="analytics"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Analytics
            </strong>
            <span>Inteligência de Dados</span>
          </div>
        </a>

        <a
          href={storesUrls.pdVend}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            src={PdVendLogo}
            alt="pdvend"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              PDVend
            </strong>
            <span>Vendas Móveis</span>
          </div>
        </a>

        <a
          href={storesUrls.emites}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            src={EmitesLogo}
            alt="emites"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Emites
            </strong>
            <span>Gestão Tributária</span>
          </div>
        </a>

        <a
          href={storesUrls.cobrato}
          target="_blank"
          className={Styles.menuItem}
          rel="noreferrer"
        >
          <Image
            src={CobratoLogo}
            alt="cobrato"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.storeName}>
            <strong className={Styles.titleFont}>
              Cobrato
            </strong>
            <span>Meios de Pagamento</span>
          </div>
        </a>
      </div>
    </div>
  );
}
