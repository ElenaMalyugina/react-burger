import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';

//это сделано только для совместимости типов - рекомендованный в курсе подход
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
