import {
  connect,
  onClose,
  onError,
  onMessage,
  onOpen,
  type TOrdersSocketState,
} from '@/services/feeds-service/slice';
import { Urls } from '@/utils/urls';
import { createSocketMiddleware, type TSocketConfig } from '@/utils/ws-factory';

const config: TSocketConfig<TOrdersSocketState, string> = {
  url: `${Urls.socketUrl}/orders/all`,
  sliceName: 'feedSocket',
  connect,
  onOpen,
  onMessage,
  onError,
  onClose,
};

export const feedSocketMiddleware = createSocketMiddleware(config);
