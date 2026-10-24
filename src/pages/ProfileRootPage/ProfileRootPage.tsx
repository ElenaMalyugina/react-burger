import { Link, NavLink, Outlet } from "react-router-dom"
import styles from "./ProfileRootPage.module.css";

export const ProfileRootPage =(): React.JSX.Element=>{
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
            <Link to="/login">Выход</Link>
          </li>
        </ul>
        <section className={styles.content}>
          <Outlet />
        </section>
      </div>
    </div>

  </main>
}
