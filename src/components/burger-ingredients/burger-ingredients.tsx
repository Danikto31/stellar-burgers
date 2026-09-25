import { selectIngredients } from '@selectors';
import { BurgerIngredientsUI } from '@ui';
import { useMemo, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useSelector } from '@services/store';
import { INGREDIENT_TYPES } from '@utils/constants';

import type { TIngredient, TTabMode } from '@utils-types';

export const BurgerIngredients = (): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TTabMode>(INGREDIENT_TYPES.bun);
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);
  const ingredients = useSelector(selectIngredients);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0,
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0,
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab(INGREDIENT_TYPES.bun);
    } else if (inViewSauces) {
      setCurrentTab(INGREDIENT_TYPES.sauce);
    } else if (inViewFilling) {
      setCurrentTab(INGREDIENT_TYPES.main);
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string): void => {
    setCurrentTab(tab as TTabMode);
    if (tab === INGREDIENT_TYPES.bun)
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === INGREDIENT_TYPES.main)
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === INGREDIENT_TYPES.sauce)
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const buns = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === INGREDIENT_TYPES.bun),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === INGREDIENT_TYPES.main),
    [ingredients]
  );

  const sauces = useMemo(
    () =>
      ingredients.filter((item: TIngredient) => item.type === INGREDIENT_TYPES.sauce),
    [ingredients]
  );

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
