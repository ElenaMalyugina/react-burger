import type { TOrder } from './types';

export const isOrderValid = (order: unknown): order is TOrder => {
  if (!order || typeof order !== 'object') {
    return false;
  }

  const candidate = order as Record<string, unknown>;

  return (
    typeof candidate._id === 'string' &&
    Array.isArray(candidate.ingredients) &&
    candidate.ingredients.every((i): i is string => typeof i === 'string') &&
    (candidate.status === 'done' ||
      candidate.status === 'pending' ||
      candidate.status === 'created') &&
    typeof candidate.name === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.number === 'number'
  );
};
