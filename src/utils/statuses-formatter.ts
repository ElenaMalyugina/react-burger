import type { TOrder } from './types';

export const statusesFormatter = (rawStatuse: TOrder['status']): string => {
  const statusesTable: Record<TOrder['status'], string> = {
    done: 'Выполнен',
    pending: 'Ожидается',
    created: 'Создан',
  };

  return statusesTable[rawStatuse];
};
