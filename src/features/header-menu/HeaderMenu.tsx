import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { BsGrid3X3Gap } from 'react-icons/bs';
import Dropdown from '../../components/dropdown';
import HorizontalMenu from '../../components/HorizontalMenu/HorizontalMenu';
import { GET_SESSION_PROFILE } from '../../graphql/queries/session';
import Styles from './HeaderMenu.module.scss';
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

  const { data: dataGet } = useQuery(GET_SESSION_PROFILE);

  useEffect(() => {
    if (dataGet && dataGet.session) {
      const { picture } = dataGet.session.profile;

      setUserProfileImage(picture);
    }
  }, [dataGet]);

  return (
    <HorizontalMenu breadcumb={breadcumb}>
      <div className={Styles.headerMenu}>
        <div className={Styles.menuItem}>
          <Dropdown overlay={<ProfileMenu />}>
            <img
              className={Styles.imageSize}
              src={userProfileImage}
              alt="profile"
            />
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
