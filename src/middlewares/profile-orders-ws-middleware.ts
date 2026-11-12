import {
  connect,
  disconnect,
  onClose,
  onError,
  onMessage,
  onOpen,
} from '@/services/profie-orders-service/slice';
import { Urls } from '@/utils/urls';
import { createSocketMiddleware, type TSocketConfig } from '@/utils/ws-factory';

import type { TOrdersSocketState } from '@/utils/types';

const config: TSocketConfig<TOrdersSocketState, string> = {
  url: `${Urls.socketUrl}/orders`,
  sliceName: 'profileOrdersSocket',
  connect,
  disconnect,
  onOpen,
  onMessage,
  onError,
  onClose,
};

export const profileOrdersSocketMiddleware = createSocketMiddleware(config, true);
