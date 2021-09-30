import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { AiOutlineUser } from 'react-icons/ai';
import { IoExitOutline } from 'react-icons/io5';
import Styles from './ProfileMenu.module.scss';

import { GET_SESSION_PROFILE } from '../../../graphql/queries/session';
import Spinner from '../../../components/spinner';
/* 
import { routes } from '../../../utils/routes';
import router from 'next/router';
 */
export default function ProfileMenu() {
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userProfileImage, setUserProfileImage] =
    useState();

  const {
    data: dataGet,
    loading: loadingGetProvider,
    error: errorsGetProvider,
  } = useQuery(GET_SESSION_PROFILE);

  useEffect(() => {
    if (dataGet && dataGet.session) {
      const { fullName, email, picture } =
        dataGet.session.profile;

      setUserName(fullName);
      setUserEmail(email);
      setUserProfileImage(picture);
    }
  }, [dataGet]);

  if (errorsGetProvider) {
    return (
      <h2>
        Ocorreu um erro inesperado, tente novamente mais
        tarde
      </h2>
    );
  }

  return (
    <Spinner spinning={loadingGetProvider}>
      <ul
        className={Styles.profileMenuContainer}
        style={{ fontSize: '14px' }}
      >
        <div
          tabIndex={0}
          role="button"
          className={`${Styles.menuItem} ${Styles.roundedImage}`}
        >
          <img
            src={userProfileImage}
            alt="profile"
            className={Styles.leftMenuItem}
          />
          <div className={Styles.profileName}>
            <span className={Styles.titleFont}>
              {userName}
            </span>
            <small>{userEmail}</small>
          </div>
        </div>
        <div
          tabIndex={-1}
          role="button"
          className={Styles.menuItem}
          /* onClick={() => {
            router.push(routes.providers.create.index);
          }} */
        >
          <AiOutlineUser
            size={16}
            className={Styles.leftMenuItem}
          />
          <span>Meu perfil</span>
        </div>
        <div
          tabIndex={-2}
          role="button"
          className={Styles.menuItem}
          /* onClick={() => {
            router.push(routes.providers.create.index);
          }} */
        >
          <IoExitOutline
            size={16}
            className={Styles.leftMenuItem}
          />
          <span>Sair de Estoka desenvolvimento</span>
        </div>
      </ul>
    </Spinner>
  );
}
