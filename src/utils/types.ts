type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
  innerId?: string;
};

export type TExtendedIngredient = TIngredient & {
  count: number;
};

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: 'done' | 'pending' | 'created';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TOrdersSocketState = {
  isConnected: boolean;
  success: boolean;
  orders: TOrder[];
  activeOrder: TOrder | null;
  activeOrderError: string | null;
  total: number;
  totalToday: number;
  error: string | null;
  isLoading: boolean;
  isToken: boolean;
};
