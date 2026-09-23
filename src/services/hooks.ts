import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export function useAppSelector<TSelected>(
  selector: (state: RootState) => TSelected
): TSelected {
  return useSelector(selector);
}
//это сделано только для совместимости типов
