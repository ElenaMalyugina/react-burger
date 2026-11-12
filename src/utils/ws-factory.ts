import { getAccessToken, refreshToken } from './token';

import type { Middleware, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

export type TSocketConfig<TData = unknown, TError = unknown> = {
  url: string;
  sliceName: string;
  connect: () => UnknownAction;
  disconnect: () => UnknownAction;
  onOpen: () => UnknownAction;
  onMessage: (data: TData) => UnknownAction;
  onError: (error: TError) => UnknownAction;
  onClose: () => UnknownAction;
};

type InvalidTokenMessage = {
  message: string;
};

const isInvalidTokenMessage = (value: unknown): value is InvalidTokenMessage =>
  typeof value === 'object' &&
  value !== null &&
  'message' in value &&
  typeof (value as { message: unknown }).message === 'string';

export const createSocketMiddleware = <TData = unknown, TError = unknown>(
  config: TSocketConfig<TData, TError>,
  isToken = false
): Middleware => {
  let ws: WebSocket | null = null;

  let isConnected = false; // Флаг: считается ли пользователь подключённым?
  const reconnectPeriod = 3000; // 3 секунды
  let reconnectTimerId: ReturnType<typeof setTimeout> | number = 0;

  return (store) => (next) => (action) => {
    const { type, payload } = action as PayloadAction;

    //коннект
    if (type === `${config.sliceName}/connect`) {
      //const { payload: token } = action as PayloadAction<string, string>;

      if (ws) {
        ws.close();
      }

      const wssUrl = new URL(config.url);

      if (isToken) {
        const token = getAccessToken();
        if (token) {
          wssUrl.searchParams.set('token', token.replace('Bearer ', ''));
        }
      }

      ws = new WebSocket(wssUrl);

      //колбэки
      //открыто
      ws.onopen = (): void => {
        store.dispatch(config.onOpen());
      };

      //получены новые данные
      ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as unknown;

          if (
            isToken &&
            isInvalidTokenMessage(data) &&
            data.message === 'Invalid or missing token'
          ) {
            refreshToken()
              .then((refreshedData) => {
                const wssUrl = new URL(config.url); // Новый URL, на основании того, который сохраняли

                wssUrl.searchParams.set(
                  'token',
                  refreshedData.accessToken.replace('Bearer ', '')
                );

                store.dispatch(config.connect());
              })
              .catch((error) => {
                const errorMessage = 'Ошибка токена' as TError;
                console.log(error);
                store.dispatch(config.onError(errorMessage));
              });

            store.dispatch(config.disconnect());
            return;
          }
          store.dispatch(config.onMessage(data as TData));
        } catch (error) {
          const errorMessage = 'Ошибка парсинга' as TError;
          console.log(error);
          store.dispatch(config.onError(errorMessage));
        }
      };

      //получена ошибка
      ws.onerror = (): void => {
        const errorMessage = 'Ошибка WebSocket-соединения' as TError;
        store.dispatch(config.onError(errorMessage));
      };

      ws.onclose = (): void => {
        store.dispatch(config.onClose());
        ws = null;

        if (isConnected) {
          reconnectTimerId = setTimeout(() => {
            store.dispatch(config.connect());
          }, reconnectPeriod);
        }
      };

      isConnected = true;
    }

    // если фронт отправил сообщение
    if (type === `${config.sliceName}/sendMessage`) {
      const message = payload;

      // Проверяем две вещи:
      // 1. Что ws существует (не null).
      // 2. Что соединение открыто (readyState === WebSocket.OPEN).
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }

    // если фронт закрыл соединение
    if (type === `${config.sliceName}/disconnect`) {
      clearTimeout(reconnectTimerId);
      reconnectTimerId = 0;
      isConnected = false;
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    return next(action);
  };
};
