import {
  editProfileSend,
  type TEditProfileDataState,
} from '@/services/edit-profile-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

const initialState: TEditProfileDataState = {
  email: '',
  name: '',
  password: '',
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [profileData, setProfileData] = useState<TEditProfileDataState>(initialState);

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

  return (
    <>
      <div className="container">
        <h1 className="title page-header text text_type_main-large mb-10">Профиль</h1>
        <form
          action="https://new-stellarburgers.education-services.ru/api/auth/user"
          onSubmit={submitHandler}
        >
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
              required
            />
          </div>
        </form>
      </div>
    </>
  );
};
