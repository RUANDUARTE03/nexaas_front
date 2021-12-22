/* eslint-disable react/jsx-indent */
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
  dataMenuPromotions,
} from './dataMenu';
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
  const [showArrow, setShowArrow] = useState<boolean>(true);

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
        dataMenuPromotions,
        dataMenuSettings
      ).map((item) =>
        item.redirects.map((itemRedirects) => {
          if (indexOf(itemRedirects, local) === -1) {
            if (itemRedirects === local) {
              setSubMenuActive([item.label]);
              setCategoryActive(item.label);
            }
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
    const drawerIsOpen: boolean =
      isExpandedDrawerHover || isExpandedDrawer;

    // When drawer is closed
    const showBorderDrawerClosed: boolean =
      !drawerIsOpen && label === categoryActive;

    // When drawer is open
    const showBorderDrawerOpen: boolean =
      drawerIsOpen &&
      label === categoryActive &&
      !subMenuActive.includes(label);

    // Uniq border drawer
    const uniqBorderDrawer: boolean =
      showBorderDrawerClosed || showBorderDrawerOpen;

    // Drawer when collapse to equal true
    const shouldDrawerActive: boolean =
      drawerBottom && label === categoryActive;

    const showBorder: boolean =
      uniqBorderDrawer ||
      (shouldDrawerActive && !isOpenDrawerSmall);

    const showLabel: boolean =
      !drawerBottom || isOpenDrawerSmall;

    return (
      <div
        data-testid="container-subMenu"
        className={`ch-menu-submenu  ${
          subMenuActive.includes(label) &&
          drawerIsOpen &&
          'is-open'
        } ${Styles.menuContainer}`}
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
          {showBorder && (
            <div
              className={`${Styles.borderActive} ${
                isOpenDrawerSmall &&
                Styles.borderActiveExpanded
              }`}
            />
          )}

          <div className={Styles.containerIconLeft}>
            <i
              className={`ch-icon fal fa-${icon} ${
                categoryActive === label &&
                Styles.iconLeftActive
              }`}
            />
          </div>

          {showLabel && (
            <span
              style={{ fontSize: 14, paddingLeft: '4px' }}
              className={`ch-menu-item-label ${
                subMenuActive.includes(label) ||
                (label === categoryActive &&
                  Styles.subMenuIsActiveTitle)
              }`}
            >
              {label}
            </span>
          )}

          {showArrow &&
          ((!drawerBottom &&
            (!!isExpandedDrawerHover ||
              isExpandedDrawer)) ||
            isOpenDrawerSmall) ? (
            <i
              className={`ch-icon fal fa-angle-right ${
                subMenuActive.includes(label) &&
                Styles.iconDirectionActive
              } ${Styles.animationReverse}`}
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
    const isActiveSubCategory: boolean =
      subCategoryActive === href;

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
            isActiveSubCategory && Styles.isActive
          }`}
        />
        <span
          className={`ch-menu-item-label ${
            isActiveSubCategory &&
            Styles.subMenuIsActiveTitle
          }`}
        >
          {label}
        </span>
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
          <div
            className={`ch-menu-item ${Styles.subMenuItem}`}
          >
            {showByVersion({
              href,
              directNewVersion,
              label,
              newVersion,
            })}
          </div>
        ) : (
          <a
            className={`ch-menu-item ${Styles.subMenuItem}`}
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
        <div className={`ch-brand-name ${Styles.logoFont}`}>
          OMS
        </div>
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
          dataMenuPromotions,
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
            <i
              className={`ch-icon fal fa-${
                isOpenDrawerSmall
                  ? 'times'
                  : 'ellipsis-h-alt'
              }`}
              style={{ color: 'white' }}
            />
          </button>
        </label>
      )}
      <span className="ch-toggle-icon" />
      {!drawerBottom && (
        <button
          data-testid="btn-action-expandedDrawer"
          className={Styles.containerIconDirection}
          onClick={() => {
            setIsExpandedDrawer(
              (isExpanded) => !isExpanded
            );
            setIsExpandedDrawerHover(false);
            setDrawerBottom(false);
            setIsOpenDrawerSmall(true);
            setShowArrow(
              (actualShowArrow) => !actualShowArrow
            );
          }}
          type="button"
        >
          <Image
            width="20"
            height="20"
            src="/iconDrawerOpenNexaas.png"
            alt="drawerOpen"
            className={
              isExpandedDrawer
                ? Styles.iconDrawer
                : Styles.iconDrawerRotated
            }
          />
          {/* <FontAwesomeIcon
            className={`ch-icon ${Styles.iconDirectionDrawer}`}
            icon={isExpandedDrawer ? 'reply' : 'share'}
          /> */}
        </button>
      )}
    </div>
  );
}
