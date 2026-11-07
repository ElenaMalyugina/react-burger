import { useForm } from '@/hooks/useForm';
import {
  forgotPasswordLoading,
  forgotPasswordRequested,
  resetForgotPasswordState,
} from '@/services/forgot-password-service/slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
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
import { Link, Navigate, useNavigate } from 'react-router-dom';

const initialState: TResetPasswordDataState = {
  password: '',
  token: '',
};

export const ResetPasswordPage = (): React.JSX.Element | null => {
  const resetRequested = useAppSelector(forgotPasswordRequested);
  const loading = useAppSelector(forgotPasswordLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { values, handleChange } = useForm(initialState);

  const isLoading = useAppSelector(resetPasswordLoading);
  const formError = useAppSelector(resetPasswordError);

  // пока идёт запрос forgotPasswordSend — не решаем, разрешать ли доступ
  if (loading) {
    return null;
  }

  if (!resetRequested) {
    return <Navigate to="/forgot-password" replace />;
  }

  const submitHandler = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const result = await dispatch(resetPasswordSend(values));

    if (resetPasswordSend.fulfilled.match(result)) {
      dispatch(resetForgotPasswordState());
      void navigate('/login', { replace: true });
    }
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">
          Сброс пароля
        </h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <PasswordInput
              icon="ShowIcon"
              name="password"
              placeholder="Введите новый пароль"
              onChange={handleChange}
              value={values.password}
              required
            />
            <PasswordInput
              icon="ShowIcon"
              name="token"
              placeholder="Введите код из письма"
              onChange={handleChange}
              value={values.token}
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
