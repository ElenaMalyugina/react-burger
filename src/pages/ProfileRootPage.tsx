import { Link, Outlet } from "react-router-dom"

export const ProfileRootPage =(): React.JSX.Element=>{
  return <main className="p-5 pt-10" >
    <div className="container">
      <Link to="">Профиль</Link>
      <Link to="orders">История заказов</Link>
      <Link to="/login">Выход</Link>

      <Outlet />

    </div>

  </main>
}
