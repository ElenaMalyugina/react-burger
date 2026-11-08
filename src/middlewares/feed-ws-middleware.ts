import {
  connect,
  onClose,
  onError,
  onMessage,
  onOpen,
  type Order,
} from '@/services/feeds-service/slice';
import { Urls } from '@/utils/urls';
import { createSocketMiddleware, type TSocketConfig } from '@/utils/ws-factory';

const config: TSocketConfig<Order, string> = {
  url: `${Urls.socketUrl}/orders/all`,
  sliceName: 'feedSocket',
  connect,
  onOpen,
  onMessage,
  onError,
  onClose,
};

export const feedSocketMiddleware = createSocketMiddleware(config);
