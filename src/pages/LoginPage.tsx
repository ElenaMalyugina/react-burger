import { Button, EmailInput, PasswordInput } from "@krgaa/react-developer-burger-ui-components"
import { Link } from "react-router-dom"

export const LoginPage =(): React.JSX.Element=>{
  return <main className="p-5 pt-10" >
    <div className="container">

      <h1 className="title page-header text text_type_main-large mb-10">Вход</h1>
      <form action="">
        <div className="form-block">
          <EmailInput
            name="email"
            onChange={function fee(){}}
            placeholder="E-mail"
            value={''}
          />

          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={function fee(){}}
            value={''}
          />

          <Button
            onClick={function fee() { } }
            size="medium"
            type="primary" htmlType={"button"} >
            Войти
          </Button>
        </div>

      </form>
      <div className="note text text_type_main-default mt-10">
        <p>
          Вы - новый пользователь? <Link to="/register">Зарегистрироваться</Link>
        </p>
        <p>
          Забыли пароль? <Link to="/forgot-password">Восстановить</Link>
        </p>
      </div>
    </div>

  </main>
}
