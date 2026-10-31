import { authError, authLoading, authResult } from '@/services/auth-service/slice';
import {
  editProfileSend,
  type TProfileDataState,
} from '@/services/edit-profile-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const initialState: TProfileDataState = {
  email: '',
  name: '',
  password: '',
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const profileDataFromServer = useSelector(authResult)?.user;

  const [profileData, setProfileData] = useState(initialState);

  const isLoading = useSelector(authLoading);
  const formError = useSelector(authError);

  useEffect(()=>{
    setProfileData((prev)=>({
      ...prev,
      name: (profileDataFromServer?.name ?? ""),
      email: (profileDataFromServer?.email ?? ""),
    }));

  }, [profileDataFromServer]);


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
