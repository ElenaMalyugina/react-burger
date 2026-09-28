import { Urls } from '@/utils/urls';

const checkResponse = async (res: Response): Promise<unknown> => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const request = (
  endpoint: string,
  options?: Record<string, unknown>
): Promise<unknown> => {
  const url = `${Urls.apiUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  return fetch(url, options).then(checkResponse);
};
