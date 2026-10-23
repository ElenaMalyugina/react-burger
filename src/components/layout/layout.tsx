import { Outlet } from 'react-router-dom';
import { AppHeader } from '../app-header/app-header';
import styles from './layout.module.css';

export const Layout = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet/>
    </div>
  );
};
