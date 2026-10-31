import { authError, authLoading, authResult } from '@/services/auth-service/slice';
import {
  editProfileSend,
  type TProfileDataState,
} from '@/services/edit-profile-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './profile-page.module.css';

const initialState: TProfileDataState = {
  email: '',
  name: '',
  password: '',
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const profileDataFromServer = useSelector(authResult)?.user;

  const [profileData, setProfileData] = useState(initialState);

  const [originalData, setOriginalData] = useState<Pick<TProfileDataState, 'name' | 'email'>>({
    name: '',
    email: '',
  });

  const isLoading = useSelector(authLoading);
  const formError = useSelector(authError);

  useEffect(()=>{
    const name = profileDataFromServer?.name ?? '';
    const email = profileDataFromServer?.email ?? '';

    setProfileData((prev)=>({
      ...prev,
      name,
      email,
    }));

    setOriginalData({ name, email });
  }, [profileDataFromServer]);

  const hasChanges = profileData.name !== originalData.name || profileData.email !== originalData.email;

  const changeInputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    setProfileData((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  };

  const submitHandler = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    void dispatch(editProfileSend(profileData));
  };

  const resetHandler = ():void =>{
    setProfileData((prev)=>({
      ...prev,
      name: (profileDataFromServer?.name ?? ""),
      email: (profileDataFromServer?.email ?? ""),
    }));
  }

  return (
    <>
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">Профиль</h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <Input
              icon="EditIcon"
              name="name"
              onChange={changeInputHandler}
              placeholder="Имя"
              size="default"
              type="text"
              value={profileData.name}
              required
            />

            <EmailInput
              isIcon
              name="email"
              onChange={changeInputHandler}
              placeholder="E-mail"
              value={profileData.email}
              required
            />

            <PasswordInput
              icon="ShowIcon"
              name="password"
              onChange={changeInputHandler}
              value={profileData.password}
            />

            {!isLoading && hasChanges && (
              <div className={styles.buttonsWrapper}>
                <Button size="medium" type="primary" htmlType={'submit'}>
                  Сохранить
                </Button>
                <Button size="medium" type="primary" htmlType={'button'} onClick={resetHandler}>
                  Отмена
                </Button>
              </div>
            )}
            {isLoading && <Preloader />}
            {formError && (
              <p className="error-text text text_type_main-default">{formError}</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
