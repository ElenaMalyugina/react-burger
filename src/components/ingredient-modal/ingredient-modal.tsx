import { useAppSelector } from '@/services/hooks';
import { getIngredientById } from '@/services/ingredients-service/slice';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../Ingredient-details/Ingredient-details';
import Modal from '../modal/modal';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

export const IngredientModal = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const ingredient: TIngredient | null = useAppSelector((state: RootState) =>
    getIngredientById(state, id!)
  );

  const closeModalDetails = (): void => {
    void navigate('/', { replace: true });
  };

  return (
    <Modal header={'Детали ингредиента'} handleCloseModal={closeModalDetails}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};
