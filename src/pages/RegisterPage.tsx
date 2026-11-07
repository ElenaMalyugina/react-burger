import { useForm } from '@/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { registerError, registerLoading } from '@/services/register-service/slice';
import {
  registerSend,
  type TRegisterDataState,
} from '@/services/register-service/thunks';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

const initialState: TRegisterDataState = {
  name: '',
  email: '',
  password: '',
};

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { values, handleChange } = useForm(initialState);

  const isLoading = useAppSelector(registerLoading);
  const regError = useAppSelector(registerError);

  const submitHandler = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const result = await dispatch(registerSend(values));
    if (registerSend.fulfilled.match(result)) {
      void navigate('/login', { replace: true });
    }
  };

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">
          Регистрация
        </h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <Input
              name="name"
              onChange={handleChange}
              placeholder="Имя"
              size="default"
              type="text"
              value={values.name}
              required
            />

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
                Зарегистироваться
              </Button>
            )}
            {isLoading && <Preloader />}
            {regError && (
              <p className="error-text text text_type_main-default">{regError}</p>
            )}
          </div>
        </form>
        <div className="note text text_type_main-default mt-10">
          <p>
            Уже зарегистрированы? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </main>
  );
};
