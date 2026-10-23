import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './app-header.module.css';
import { NavLink } from 'react-router-dom';

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Тут должны быть ссылки, а не например кнопки или абзацы */}
          <NavLink to='/' className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active}` : styles.link
          }>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
            </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink to="/profile" className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.link_active} ${styles.link_position_last}` : `${styles.link} ${styles.link_position_last}`
          }>
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Личный кабинет</p>
              </>
            )}
        </NavLink>
      </nav>
    </header>
  );
};
