import { selectIngredientsCounters } from '@selectors';
import { IngredientsCategoryUI } from '@ui';

import { useSelector } from '@services/store';

import type { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const ingredientsCounters = useSelector(selectIngredientsCounters);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
