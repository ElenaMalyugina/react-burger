import { EmailInput, Input, PasswordInput } from "@krgaa/react-developer-burger-ui-components"


export const ProfilePage =(): React.JSX.Element=>{
  return <>
    <div className="container">
      <h1 className="title page-header text text_type_main-large mb-10">Профиль</h1>
      <form action="">
        <div className="form-block">
          <Input
            icon="EditIcon"
            name="name"
            onChange={function fee(){}}
            placeholder="Имя"
            size="default"
            type="text"
            value={''}
          />

          <EmailInput
            isIcon
            name="login"
            onChange={function fee(){}}
            placeholder="E-mail"
            value={''}
          />

          <PasswordInput
            icon="ShowIcon"
            name="password"
            onChange={function fee(){}}
            value={''}
          />
        </div>

      </form>


    </div>

  </>
}
