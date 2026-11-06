import { useForm } from '@/hooks/useForm';
import { authError, authLoading, authResult } from '@/services/auth-service/slice';
import { editProfileIsUpdated } from '@/services/edit-profile-service/slice';
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
  const profileDataFromServer = useSelector(authResult);
  const isUpdatedData = useSelector(editProfileIsUpdated);

  const {
    values: profileData,
    setValues: setProfileData,
    handleChange,
  } = useForm(initialState);

  const [originalData, setOriginalData] =
    useState<Pick<TProfileDataState, 'name' | 'email'>>(initialState);

  const isLoading = useSelector(authLoading);
  const formError = useSelector(authError);

  useEffect(() => {
    const name = profileDataFromServer?.name ?? '';
    const email = profileDataFromServer?.email ?? '';

    setProfileData((prev) => ({
      ...prev,
      name,
      email,
    }));

    setOriginalData({ name, email });
  }, [profileDataFromServer]);

  const hasChanges =
    profileData.name !== originalData.name || profileData.email !== originalData.email;

  const submitHandler = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();

    const result = await dispatch(editProfileSend(profileData));

    if (editProfileSend.fulfilled.match(result)) {
      setProfileData((prev) => ({ ...prev, password: '' }));
      setOriginalData({
        name: result.payload.user.name ?? '',
        email: result.payload.user.email ?? '',
      });
    }
  };

  const resetHandler = (): void => {
    setProfileData((prev) => ({
      ...prev,
      name: profileDataFromServer?.name ?? '',
      email: profileDataFromServer?.email ?? '',
    }));
  };

  return (
    <>
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">Профиль</h1>
        <form onSubmit={submitHandler}>
          <div className="form-block">
            <Input
              icon="EditIcon"
              name="name"
              onChange={handleChange}
              placeholder="Имя"
              size="default"
              type="text"
              value={profileData.name}
              required
            />

            <EmailInput
              isIcon
              name="email"
              onChange={handleChange}
              placeholder="E-mail"
              value={profileData.email}
              required
            />

            <PasswordInput
              icon="ShowIcon"
              name="password"
              onChange={handleChange}
              value={profileData.password}
              disabled
            />

            {!isLoading && hasChanges && (
              <div className={styles.buttonsWrapper}>
                <Button size="medium" type="primary" htmlType={'submit'}>
                  Сохранить
                </Button>
                <Button
                  size="medium"
                  type="primary"
                  htmlType={'button'}
                  onClick={resetHandler}
                >
                  Отмена
                </Button>
              </div>
            )}
            {isLoading && <Preloader />}
            {formError && (
              <p className="error-text text text_type_main-default">{formError}</p>
            )}
            {isUpdatedData && !hasChanges && (
              <p className="text text_type_main-default">Данные успешно изменены</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
