import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  IconProp,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { concat, indexOf } from 'lodash';
import Styles from './navigation.module.scss';
import {
  dataMenuInstallment,
  dataMenuRegisters,
  dataMenuSellers,
  dataMenuSupplies,
  dataMenuSettings,
} from './DataMenu';
import useWindowSize from '../../utils/hooks/useWindowSize';

library.add(fas);

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
type NavigationProps = {
  setExpanded: (expanded: boolean) => void;
  setDrawerB: (drawerB: boolean) => void;
};

export default function Navigation({
  setExpanded,
  setDrawerB,
}: NavigationProps) {
  const router = useRouter();
  const size: ApplicationWindow.Size = useWindowSize();
  const [isExpandedDrawer, setIsExpandedDrawer] =
    useState<boolean>(true);
  const [isExpandedDrawerHover, setIsExpandedDrawerHover] =
    useState<boolean>(false);
  const [drawerBottom, setDrawerBottom] =
    useState<boolean>(false);
  const [isOpenDrawerSmall, setIsOpenDrawerSmall] =
    useState<boolean>(false);
  const [subMenuActive, setSubMenuActive] = useState<
    string[]
  >([]);
  const [categoryActive, setCategoryActive] =
    useState<string>('');
  const [subCategoryActive, setSubCategoryActive] =
    useState<string>('');

  useEffect(() => {
    if (isExpandedDrawer || isExpandedDrawerHover) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [
    isExpandedDrawer,
    isExpandedDrawerHover,
    setExpanded,
  ]);

  useEffect(() => {
    if (size.width > 768) {
      setDrawerBottom(false);
      setDrawerB(false);
    } else {
      setDrawerBottom(true);
      setDrawerB(true);
    }
  }, [size, setExpanded, setDrawerB]);

  useEffect(() => {
    if (window.location) {
      const local = window.location.pathname;
      setSubCategoryActive(local);

      concat(
        dataMenuSellers,
        dataMenuSupplies,
        dataMenuRegisters,
        dataMenuInstallment,
        dataMenuSettings
      ).map((item) =>
        item.redirects.map((itemRedirects) => {
          if (indexOf(itemRedirects, local) === -1) {
            setCategoryActive(item.label);
          }
        })
      );
    }
  }, []);

  const changeSubMenu = ({ label }: { label: string }) => {
    const checkIsActive = subMenuActive.includes(label);
    if (checkIsActive) {
      const removeSubMenu = subMenuActive.filter(
        (sma) => sma !== label
      );
      setSubMenuActive(removeSubMenu);
    } else {
      const joined = [];
      subMenuActive.map((sma) => joined.push(sma));
      joined.push(label);
      setSubMenuActive(joined);
    }
  };

  const subMenu = ({
    label,
    icon,
    items,
  }: {
    label: string;
    icon: IconProp;
    items: {
      href: string;
      newVersion: boolean;
      directNewVersion?: string;
      label: string;
    }[];
  }) => {
    return (
      <div
        data-testid="container-subMenu"
        className={`ch-menu-submenu  ${
          subMenuActive.includes(label) && 'is-open'
        }`}
      >
        <button
          data-testid="btn-subMenu"
          onClick={() => {
            changeSubMenu({ label });
          }}
          type="button"
          className={`ch-menu-item has-icon has-iconRight ${
            Styles.btnMenuItem
          } ${!isOpenDrawerSmall && Styles.nexMenuSubmenu}`}
        >
          <div className={Styles.containerIconLeft}>
            <FontAwesomeIcon
              className={`ch-icon ${Styles.iconLeft} ${
                categoryActive === label &&
                Styles.iconLeftActive
              }`}
              icon={icon}
            />
          </div>
          <span className="ch-menu-item-label">
            {label}
          </span>
          {(!drawerBottom &&
            (!!isExpandedDrawerHover ||
              isExpandedDrawer)) ||
          isOpenDrawerSmall ? (
            <FontAwesomeIcon
              className={`ch-icon ${
                Styles.animationReverse
              } ${
                subMenuActive.includes(label) &&
                Styles.iconDirectionActive
              }`}
              icon="angle-right"
            />
          ) : null}
        </button>
        <div className="ch-menu">
          {items.map((item, index) => {
            return (
              <div key={index}>
                {menuItem({
                  href: item.href,
                  newVersion: item.newVersion,
                  directNewVersion: item.directNewVersion,
                  label: item.label,
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const showByVersion = ({
    href,
    newVersion = false,
    directNewVersion,
    label,
  }: {
    href: string;
    newVersion: boolean;
    directNewVersion: string;
    label: string;
  }) => {
    return (
      <button
        data-testid="btn-click-itemSubMenu"
        onClick={() => {
          newVersion &&
            directNewVersion &&
            router.push(directNewVersion);
        }}
        type="button"
      >
        <div
          className={`${
            subCategoryActive === href && Styles.isActive
          }`}
        />
        <span className="ch-menu-item-label">{label}</span>
      </button>
    );
  };

  const menuItem = ({
    href,
    newVersion = false,
    directNewVersion,
    label,
  }: {
    href: string;
    newVersion: boolean;
    directNewVersion: string;
    label: string;
  }) => {
    return (
      <>
        {newVersion ? (
          <div className="ch-menu-item">
            {showByVersion({
              href,
              directNewVersion,
              label,
              newVersion,
            })}
          </div>
        ) : (
          <a
            className="ch-menu-item"
            href={`${process.env.NEXT_PUBLIC_REDIRECT_URL}${href}`}
          >
            {showByVersion({
              href,
              directNewVersion,
              label,
              newVersion,
            })}
          </a>
        )}
      </>
    );
  };

  /* eslint-disable global-require */
  return (
    <div
      data-testid="container-template"
      className={`ch-template-nav ${
        isOpenDrawerSmall && 'is-open'
      } ${isExpandedDrawer && 'is-expanded'} ${
        isExpandedDrawerHover && 'is-hovered'
      }`}
      onMouseEnter={() => {
        setIsExpandedDrawerHover(true);
      }}
      onMouseLeave={() => {
        setIsExpandedDrawerHover(false);
      }}
    >
      <a className="ch-brand" href="/">
        <Image
          className={`${Styles.imageLogo}`}
          layout="fill"
          src="/icon_estoka.png"
          alt=""
        />
        <div className="ch-brand-name">OMS</div>
      </a>
      <div
        className={`ch-menu ${
          drawerBottom && Styles.nexMenu
        }`}
      >
        {concat(
          dataMenuSellers,
          dataMenuSupplies,
          dataMenuRegisters,
          dataMenuInstallment,
          dataMenuSettings
        ).map((item) => {
          return (
            <div key={item.label}>
              {subMenu({
                label: item.label,
                icon: item.icon,
                items: item.items,
              })}
            </div>
          );
        })}
      </div>
      {!!drawerBottom && (
        <label
          className={`ch-toggle ${
            Styles.containerDrawerSmall
          } ${
            isOpenDrawerSmall &&
            Styles.containerDrawerSmallOpened
          }`}
        >
          <button
            data-testid="btn-action-isOpenDraweSmall"
            type="button"
            className={Styles.containerIconLeft}
            onClick={() => {
              setIsOpenDrawerSmall(!isOpenDrawerSmall);
            }}
          >
            <FontAwesomeIcon
              className={`ch-icon ${Styles.iconLeft}`}
              icon={
                isOpenDrawerSmall ? 'times' : 'ellipsis-h'
              }
            />
          </button>
        </label>
      )}
      {!drawerBottom && (
        <button
          data-testid="btn-action-expandedDrawer"
          className={Styles.containerIconDirection}
          onClick={() => {
            setIsExpandedDrawer(!isExpandedDrawer);
          }}
          type="button"
        >
          <FontAwesomeIcon
            className={`ch-icon ${Styles.iconDirectionDrawer}`}
            icon={isExpandedDrawer ? 'reply' : 'share'}
          />
        </button>
      )}
    </div>
  );
}
