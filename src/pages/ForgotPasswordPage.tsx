import {
  forgotPasswordError,
  forgotPasswordLoading,
} from '@/services/forgot-password-service/slice';
import {
  forgotPasswordSend,
  type TForgotPasswordDataState,
} from '@/services/forgot-password-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import {
  Button,
  EmailInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const initialState: TForgotPasswordDataState = {
  email: '',
};

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [forgotPasswordData, setForgotPasswordData] =
    useState<TForgotPasswordDataState>(initialState);

  const isLoading = useSelector(forgotPasswordLoading);
  const formError = useSelector(forgotPasswordError);

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setForgotPasswordData((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  };

  const submitHandler = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    await dispatch(forgotPasswordSend(forgotPasswordData));
    void navigate('/login', { replace: true });
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">
          Восстановление пароля
        </h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <EmailInput
              name="email"
              onChange={changeInputHandler}
              placeholder="E-mail"
              value={forgotPasswordData.email}
              required
            />
            {!isLoading && (
              <Button size="medium" type="primary" htmlType={'submit'}>
                Восстановить
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
