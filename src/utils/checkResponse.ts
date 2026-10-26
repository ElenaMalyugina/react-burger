import { Urls } from '@/utils/urls';
import { refreshToken } from './token';

type ResponseError = {
  message?: string;
  status?: number;
}

const checkResponse = async (res: Response): Promise<unknown> => {
  const resData: unknown = await res.json().catch(()=>null);

  if (!res.ok) {

    const errorData = resData as ResponseError | null;

    const message = errorData?.message ?? 'Что-то пошло не так';

    const err = new Error(message) as ResponseError;
    err.status = res.status;
    throw err;
  }

  return resData;
};

//простой запрос
export const request = (
  endpoint: string,
  options?: Record<string, unknown>
): Promise<unknown> => {
  const url = `${Urls.apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  return fetch(url, options).then(checkResponse);
};


//запрос с возможным обновлением токена
export const fetchWithRefresh = async (
  endpoint: string,
  options?: Record<string, unknown>
): Promise<unknown> => {
  try {
    return await request(endpoint, options);
  }
  catch (error: unknown) {
    // Проверяем, что это именно наша ошибка со статусом
    if (error instanceof Error && 'status' in error) {

      const status = (error as ResponseError).status;

      if (status === 401 || status === 403) {
        const refreshData = await refreshToken();

        const newHeaders = new Headers(options?.headers as HeadersInit);

        newHeaders.set('authorization', refreshData.accessToken);

        const updatedOptions = {
          ...options,
          headers: Object.fromEntries(newHeaders.entries()),
        };

        return await request(endpoint, updatedOptions);
      }
    }
    throw error;
  }
}
