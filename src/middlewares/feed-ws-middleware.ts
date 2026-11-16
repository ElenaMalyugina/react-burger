import {
  connect,
  onClose,
  onError,
  onMessage,
  onOpen,
  disconnect,
} from '@/services/feeds-service/slice';
import { Urls } from '@/utils/urls';
import { createSocketMiddleware, type TSocketConfig } from '@/utils/ws-factory';

import type { TOrdersSocketState } from '@/utils/types';

const config: TSocketConfig<TOrdersSocketState, string> = {
  url: `${Urls.socketUrl}/orders/all`,
  sliceName: 'feedSocket',
  connect,
  onOpen,
  onMessage,
  onError,
  onClose,
  disconnect,
};

export const feedSocketMiddleware = createSocketMiddleware(config);
