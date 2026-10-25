import { Urls } from '@/utils/urls';

type ResponseError = {
  message: string;
}

const checkResponse = async (res: Response): Promise<unknown> => {
  const resData: unknown = await res.json().catch(()=>null);

  if (!res.ok) {

    const errorData = resData as ResponseError | null;

    // Проверяем, что поле действительно есть и это строка
    if (errorData?.message) {
      throw new Error(errorData.message);
    }

    throw new Error("Что-то пошло не так");
  }

  return resData;
};

export const request = (
  endpoint: string,
  options?: Record<string, unknown>
): Promise<unknown> => {
  const url = `${Urls.apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  return fetch(url, options).then(checkResponse);
};
