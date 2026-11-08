import type { Middleware, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

export type TSocketConfig<TData = unknown, TError = unknown> = {
  url: string;
  sliceName: string;
  connect: () => UnknownAction;
  onOpen: () => UnknownAction;
  onMessage: (data: TData) => UnknownAction;
  onError: (error: TError) => UnknownAction;
  onClose: () => UnknownAction;
};

export const createSocketMiddleware = <TData = unknown, TError = unknown>(
  config: TSocketConfig<TData, TError>
): Middleware => {
  let ws: WebSocket | null = null;

  let isConnected = false; // Флаг: считается ли пользователь подключённым?
  const reconnectPeriod = 3000; // 3 секунды
  let reconnectTimerId: ReturnType<typeof setTimeout> | number = 0;

  return (store) => (next) => (action) => {
    const { type, payload } = action as PayloadAction;

    //коннект
    if (type === `${config.sliceName}/connect`) {
      const { payload: token } = action as PayloadAction<string, 'socket/connect'>;

      if (ws) {
        ws.close();
      }

      ws = new WebSocket(`${config.url}?token=${token}`);

      //колбэки
      //открыто
      ws.onopen = (): void => {
        store.dispatch(config.onOpen());
      };

      //получены новые данные
      ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as TData;

          store.dispatch(config.onMessage(data));
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
