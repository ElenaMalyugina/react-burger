import { useState, type Dispatch, type SetStateAction } from 'react';

type TUseFormReturn<T> = {
  values: T;
  setValues: Dispatch<SetStateAction<T>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useForm = <T extends Record<string, string>>(
  initialValues: T
): TUseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  return { values, setValues, handleChange };
};
