import { Button, EmailInput, Input, PasswordInput } from "@krgaa/react-developer-burger-ui-components"
import { Link } from "react-router-dom"

export const RegisterPage =(): React.JSX.Element=>{
  return <main className="p-5 pt-10" >
    <div className="container">

      <h1 className="title page-header text text_type_main-large mb-10">Регистрация</h1>
      <form action="">
        <div className="form-block">
          <Input
            name="name"
            onChange={function fee(){}}
            placeholder="Имя"
            size="default"
            type="text"
            value={''}
          />

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
            Зарегистироваться
          </Button>
        </div>

      </form>
      <div className="note text text_type_main-default mt-10">
        <p>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>

  </main>
}
