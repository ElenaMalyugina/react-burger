import styles from './ingredients-list.module.css';

type TIngredientsListProps = {
  ingredientsType: string;
  displayIngredientsType: string;
  children: React.JSX.Element[];
};

export const IngredientsList = ({
  ingredientsType,
  displayIngredientsType,
  children,
}: TIngredientsListProps): React.JSX.Element => {
  return (
    <article className="mb-20" data-type={ingredientsType}>
      <h2>{displayIngredientsType}</h2>
      <ul className={`custom-scroll ${styles['ingredients-list']}`}>{children}</ul>
    </article>
  );
};
