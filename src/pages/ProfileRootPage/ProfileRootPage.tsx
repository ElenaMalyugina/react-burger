import { Link, NavLink, Outlet } from "react-router-dom"
import styles from "./ProfileRootPage.module.css";
import type { SyntheticEvent } from "react";
import { useAppDispatch } from "@/services/hooks";
import { logoutSend } from "@/services/logout-service/thunks";
import { useSelector } from "react-redux";
import { logoutError, logoutLoading, logoutResult } from "@/services/logout-service/slice";
import { Preloader } from "@krgaa/react-developer-burger-ui-components";

export const ProfileRootPage =(): React.JSX.Element=>{

  const dispatch = useAppDispatch();
  const exitLoading = useSelector(logoutLoading);
  const exitError = useSelector(logoutError);
  const exitSuccess = useSelector(logoutResult);

  const logoutHandler = (event: SyntheticEvent)=>{
    event.preventDefault();
    dispatch(logoutSend());
  }


  return <main className="p-5 pt-10" >
    <div className="container">
      <div className={styles.profileFlex}>
        <ul className={styles.menuList}>
          <li className={`${styles.menuItem} text text_type_main-default`}>
            <NavLink className={({isActive})=> isActive ? styles.active : ''} to="" end>Профиль</NavLink>
          </li>
          <li className={`${styles.menuItem} text text_type_main-default`}>
            <NavLink className={({isActive})=> isActive ? styles.active : ''} to="orders">История заказов</NavLink>
          </li>
          <li className={`${styles.menuItem} text text_type_main-default`}>
            <Link to="/login" onClick={logoutHandler}>Выход</Link>
          </li>
        </ul>
        <section className={styles.content}>
          <Outlet />
        </section>
      </div>
       {
        exitSuccess  &&
        <p className="text text_type_main-default">{exitSuccess}</p>
      }
      {
        exitLoading && <Preloader />
      }
      {
        exitError &&
        <p className="error-text text text_type_main-default">{exitError}</p>
      }
    </div>

  </main>
}
