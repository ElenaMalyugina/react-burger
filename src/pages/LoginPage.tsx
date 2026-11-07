import { useForm } from '@/hooks/useForm';
import { useAppDispatch } from '@/services/hooks';
import { loginError, loginLoading } from '@/services/login-service/slice';
import { loginSend, type TLoginDataState } from '@/services/login-service/thunks';
import {
  Button,
  EmailInput,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import type { TLocationState } from '@/router/protected-route';

const initialState: TLoginDataState = {
  email: '',
  password: '',
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { values, handleChange } = useForm(initialState);

  const isLoading = useSelector(loginLoading);
  const formError = useSelector(loginError);

  const submitHandler = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const result = await dispatch(loginSend(values));

    if (loginSend.fulfilled.match(result)) {
      const from = (location.state as TLocationState | null)?.from;

      void navigate(from?.pathname ?? '/', { replace: true });
    }
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">Вход</h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <EmailInput
              name="email"
              onChange={handleChange}
              placeholder="E-mail"
              value={values.email}
              required
            />

            <PasswordInput
              icon="ShowIcon"
              name="password"
              onChange={handleChange}
              value={values.password}
              required
            />
            {!isLoading && (
              <Button size="medium" type="primary" htmlType={'submit'}>
                Войти
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
            Вы - новый пользователь? <Link to="/register">Зарегистрироваться</Link>
          </p>
          <p>
            Забыли пароль? <Link to="/forgot-password">Восстановить</Link>
          </p>
        </div>
      </div>
    </main>
  );
};
