import { RouterProvider } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import { router } from '../router/router';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
