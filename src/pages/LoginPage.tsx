import { useAppDispatch } from "@/services/hooks";
import { loginError, loginLoading } from "@/services/login-service/slice";
import { loginSend, type TLoginDataState } from "@/services/login-service/thunks";
import { Button, EmailInput, PasswordInput, Preloader } from "@krgaa/react-developer-burger-ui-components"
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"

const initialState: TLoginDataState = {
  email: '',
  password: ''
}

export const LoginPage = (): React.JSX.Element=>{
  const dispatch = useAppDispatch();

  const [loginData, setLoginData] = useState<TLoginDataState>(initialState);

  const isLoading = useSelector(loginLoading);
  const formError = useSelector(loginError);

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>):void=>{
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setLoginData((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  }

  const submitHandler = (event: React.SyntheticEvent)=>{
    event.preventDefault();
    dispatch(loginSend(loginData));

  }

  return <main className="p-5 pt-10" >
    <div className="container">

      <h1 className="title page-header text text_type_main-large mb-10">Вход</h1>
      <form action="https://new-stellarburgers.education-services.ru/api/auth/login" onSubmit={submitHandler} >
        <div className="form-block">
          <EmailInput
            name="email"
            onChange={changeInputHandler}
            placeholder="E-mail"
            value={loginData.email}
            required
          />

          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={changeInputHandler}
            value={loginData.password}
            required
          />
          {!isLoading &&
            <Button
              size="medium"
              type="primary"
              htmlType={"submit"} >
              Войти
            </Button>
          }
          {isLoading &&
            <Preloader/>
          }
          {formError &&
            <p className="error-text text text_type_main-default">{formError}</p>
          }
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
