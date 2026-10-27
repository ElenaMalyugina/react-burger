import { useAppDispatch } from '@/services/hooks';
import {
  resetPasswordError,
  resetPasswordLoading,
} from '@/services/reset-password-service/slice';
import {
  resetPasswordSend,
  type TResetPasswordDataState,
} from '@/services/reset-password-service/thunks';
import {
  Button,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const initialState: TResetPasswordDataState = {
  password: '',
  token: '',
};

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const [resetPasswordData, setResetPasswordData] =
    useState<TResetPasswordDataState>(initialState);

  const isLoading = useSelector(resetPasswordLoading);
  const formError = useSelector(resetPasswordError);

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setResetPasswordData((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  };

  const submitHandler = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    void dispatch(resetPasswordSend(resetPasswordData));
    //редирект
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">
          Сброс пароля
        </h1>
        <form
          action="https://new-stellarburgers.education-services.ru/api/password-reset/reset"
          onSubmit={submitHandler}
        >
          <div className="form-block">
            <PasswordInput
              icon="ShowIcon"
              name="password"
              placeholder="Введите новый пароль"
              onChange={changeInputHandler}
              value={resetPasswordData.password}
              required
            />
            <PasswordInput
              icon="ShowIcon"
              name="token"
              placeholder="Введите код из письма"
              onChange={changeInputHandler}
              value={resetPasswordData.token}
              required
            />
            {!isLoading && (
              <Button size="medium" type="primary" htmlType={'submit'}>
                Сохранить
              </Button>
            )}
            {isLoading && <Preloader />}
            {formError && (
              <p className="error-text text text_type_main-default">{formError}</p>
            )}
          </div>
        </form>
        <div className="note text text_type_main-default mt-10">
          <p>
            Вспомнили пароль? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </main>
  );
};
