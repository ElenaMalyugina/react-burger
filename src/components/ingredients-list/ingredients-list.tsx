import styles from './ingredients-list.module.css';

type TIngredientsListProps = {
  ingredientsType: string;
  children: React.JSX.Element[];
};

export const IngredientsList = ({
  ingredientsType,
  children,
}: TIngredientsListProps): React.JSX.Element => {
  return (
    <section className={`box-with-scroll`}>
      <h2>{ingredientsType}</h2>
      <ul className={`custom-scroll ${styles['ingredients-list']}`}>{children}</ul>
    </section>
  );
};
