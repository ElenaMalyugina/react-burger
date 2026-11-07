import { useForm } from '@/hooks/useForm';
import {
  forgotPasswordError,
  forgotPasswordLoading,
} from '@/services/forgot-password-service/slice';
import {
  forgotPasswordSend,
  type TForgotPasswordDataState,
} from '@/services/forgot-password-service/thunks';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  Button,
  EmailInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

const initialState: TForgotPasswordDataState = {
  email: '',
};

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { values, handleChange } = useForm(initialState);

  const isLoading = useAppSelector(forgotPasswordLoading);
  const formError = useAppSelector(forgotPasswordError);

  const submitHandler = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const result = await dispatch(forgotPasswordSend(values));

    if (forgotPasswordSend.fulfilled.match(result)) {
      void navigate('/reset-password', { replace: true });
    }
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
              onChange={handleChange}
              placeholder="E-mail"
              value={values.email}
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
