import { useAppDispatch } from '@/services/hooks';
import {
  logoutError,
  logoutLoading,
  logoutResult,
} from '@/services/logout-service/slice';
import { logoutSend } from '@/services/logout-service/thunks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import type { SyntheticEvent } from 'react';

import styles from './ProfileRootPage.module.css';

export const ProfileRootPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const exitLoading = useSelector(logoutLoading);
  const exitError = useSelector(logoutError);
  const exitSuccess = useSelector(logoutResult);

  const logoutHandler = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    try {
      await dispatch(logoutSend());
    } finally {
      void navigate('/login', { replace: true });
    }
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <div className={styles.profileFlex}>
          <ul className={styles.menuList}>
            <li className={`${styles.menuItem} text text_type_main-default`}>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : '')}
                to=""
                end
              >
                Профиль
              </NavLink>
            </li>
            <li className={`${styles.menuItem} text text_type_main-default`}>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : '')}
                to="orders"
              >
                История заказов
              </NavLink>
            </li>
            <li className={`${styles.menuItem} text text_type_main-default`}>
              <Link to="/login" onClick={logoutHandler}>
                Выход
              </Link>
            </li>
          </ul>
          <section className={styles.content}>
            <Outlet />
          </section>
        </div>
        {exitSuccess && <p className="text text_type_main-default">{exitSuccess}</p>}
        {exitLoading && <Preloader />}
        {exitError && (
          <p className="error-text text text_type_main-default">{exitError}</p>
        )}
      </div>
    </main>
  );
};
