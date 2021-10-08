import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Dropdown from '../../components/dropdown';
import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import {
  GET_CURRENT_ORGANIZATION,
  GET_SESSION_PROFILE,
} from '../../graphql/queries/session';
import { Organization } from '../organization-page/models/Organization';
import Styles from './HeaderMenu.module.scss';
import OrganizationMenu from './organization-menu';
import ProfileMenu from './profile-menu/ProfileMenu';
import StoreMenu from './store-menu/StoreMenu';

interface HeaderMenuProps {
  breadcumb: string;
}

export default function HeaderMenu({
  breadcumb,
}: HeaderMenuProps) {
  const [userProfileImage, setUserProfileImage] =
    useState();
  const [currentOrg, setCurrentOrg] = useState();
  const [organizations, setOrganizations] = useState<
    Organization[]
  >([]);

  const { data: dataGet } = useQuery(GET_SESSION_PROFILE);
  const { data: orgGet } = useQuery(
    GET_CURRENT_ORGANIZATION
  );
  useEffect(() => {
    if (dataGet && dataGet.session) {
      const { picture } = dataGet.session.profile;

      setUserProfileImage(picture);
    }
  }, [dataGet]);

  useEffect(() => {
    if (orgGet && orgGet.session) {
      orgGet.session.organizations.forEach((org) => {
        if (org.current) {
          setCurrentOrg(org);
        }
      });

      setOrganizations(orgGet.session.organizations);
    }
  }, [orgGet]);

  return (
    <HorizontalMenu breadcumb={breadcumb}>
      <div className={Styles.headerMenu}>
        <div className={Styles.menuItem}>
          <Dropdown
            overlay={
              <OrganizationMenu
                organizations={organizations}
              />
            }
          >
            <span
              className={Styles.organizationMenu}
              style={{ color: '#47494c' }}
            >
              {currentOrg?.name}
              <MdKeyboardArrowDown size={24} />
            </span>
          </Dropdown>
        </div>
        <div className={Styles.menuItem}>
          <Dropdown overlay={<StoreMenu />}>
            <BsGrid3X3Gap size={24} />
          </Dropdown>
        </div>
        <div className={Styles.menuItem}>
          <Dropdown overlay={<ProfileMenu />}>
            <img
              className={Styles.imageSize}
              src={userProfileImage}
              alt="profile"
            />
          </Dropdown>
        </div>
      </div>
    </HorizontalMenu>
  );
}
