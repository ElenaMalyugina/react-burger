import type { Middleware, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

type TSocketMessage = unknown;

export type TSocketConfig = {
  url: string;
  onOpen: () => UnknownAction;
  onMessage: (data: TSocketMessage) => UnknownAction;
  onError: (error: unknown) => UnknownAction;
  onClose: () => UnknownAction;
};

export const createSocketMiddleware = (config: TSocketConfig): Middleware => {
  let ws: WebSocket | null = null;

  return (store) => (next) => (action) => {
    const { type, payload } = action as PayloadAction;

    //коннект
    if (type === 'socket/connect') {
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

      //получено сообщение
      ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data: TSocketMessage = JSON.parse(event.data);
          store.dispatch(config.onMessage(data));
        } catch (error) {
          console.log(error);
          store.dispatch(config.onError('Ошибка парсинга'));
        }
      };

      //получена ошибка
      ws.onerror = (): void => {
        store.dispatch(config.onError('Ошибка WebSocket-соединения'));
      };

      ws.onclose = (): void => {
        store.dispatch(config.onClose());
        ws = null;
      };
    }

    // если фронт отправил сообщение
    if (type === 'socket/sendMessage') {
      const message = payload;

      // Проверяем две вещи:
      // 1. Что ws существует (не null).
      // 2. Что соединение открыто (readyState === WebSocket.OPEN).
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    }

    // если фронт закрыл соединение
    if (type === 'socket/disconnect') {
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    return next(action);
  };
};
