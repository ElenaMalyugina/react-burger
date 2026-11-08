import { createSocketMiddleware, type TSocketConfig } from '@/utils/ws-factory';

import type { UnknownAction } from '@reduxjs/toolkit';

const noopData: () => UnknownAction = () => ({ type: 'noop' });

const config: TSocketConfig = {
  url: '',
  onOpen: noopData,
  onMessage: noopData,
  onError: noopData,
  onClose: noopData,
};

export const feedSocketMiddleware = createSocketMiddleware(config);
