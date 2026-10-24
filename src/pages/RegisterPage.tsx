import { useAppDispatch } from "@/services/hooks";
import { registerSend, type TRegisterDataState } from "@/services/register-service/thunks";
import { Button, EmailInput, Input, PasswordInput } from "@krgaa/react-developer-burger-ui-components"
import { useState } from "react"
import { Link } from "react-router-dom"

const initialState: TRegisterDataState = {
  name: '',
  email: '',
  password: ''
}

export const RegisterPage = (): React.JSX.Element=>{
  const dispatch = useAppDispatch();

  const [registerData, setRegisterData] = useState<TRegisterDataState>(initialState);

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>):void=>{
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setRegisterData((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  }

  const submitHandler = (event: React.SyntheticEvent)=>{
    event.preventDefault();
    console.log(registerData);

    dispatch(registerSend(registerData));

  }


  return <main className="p-5 pt-10" >
    <div className="container">

      <h1 className="title page-header text text_type_main-large mb-10">Регистрация</h1>
      <form action="https://new-stellarburgers.education-services.ru/api/auth/register" onSubmit={submitHandler}>
        <div className="form-block">
          <Input
            name="name"
            onChange={changeInputHandler}
            placeholder="Имя"
            size="default"
            type="text"
            value={registerData.name}
            required
          />

          <EmailInput
            name="email"
            onChange={changeInputHandler}
            placeholder="E-mail"
            value={registerData.email}
            required
          />

          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={changeInputHandler}
            value={registerData.password}
            required
          />

          <Button
            size="medium"
            type="primary"
            htmlType={"submit"} >
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
