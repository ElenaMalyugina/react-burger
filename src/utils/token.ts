import { request } from "./checkResponse";

type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export const isTokenExists = ():boolean => {
  return !!localStorage.getItem('accessToken');
}

export const saveAuthTokens = (accessToken: string, refreshToken: string):void=>{
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export const getRefreshToken = (): string | null=>{
  return localStorage.getItem('refreshToken');
}

export const clearTokens = ()=>{
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function refreshToken(): Promise<TTokenResponse> {
  const options: Record<string, unknown> = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  };

  const refreshData = await request('auth/token', options) as TTokenResponse;

  saveAuthTokens(refreshData.accessToken, refreshData.refreshToken)

  return refreshData;
}
