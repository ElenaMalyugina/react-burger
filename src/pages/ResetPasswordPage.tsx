import { Button, PasswordInput } from "@krgaa/react-developer-burger-ui-components"
import { Link } from "react-router-dom"

export const ResetPasswordPage =(): React.JSX.Element=>{
  return <main className="p-5 pt-10" >
    <div className="container">

      <h1 className="title page-header text text_type_main-large mb-10">Сброс пароля</h1>
      <form action="">
        <div className="form-block">
          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={function fee(){}}
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
            Сохранить
          </Button>
        </div>

      </form>
      <div className="note text text_type_main-default mt-10">
        <p>
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>

  </main>
}
