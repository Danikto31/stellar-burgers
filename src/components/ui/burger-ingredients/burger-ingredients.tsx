import { IngredientsCategory } from '@components';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';

import { INGREDIENT_TYPES } from '@utils/constants';

import type { BurgerIngredientsUIProps } from './type';

import styles from './burger-ingredients.module.css';

export const BurgerIngredientsUI = memo(function BurgerIngredientsUI({
  currentTab,
  buns,
  mains,
  sauces,
  titleBunRef,
  titleMainRef,
  titleSaucesRef,
  bunsRef,
  mainsRef,
  saucesRef,
  onTabClick,
}: BurgerIngredientsUIProps): React.JSX.Element {
  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value={INGREDIENT_TYPES.bun}
              active={currentTab === INGREDIENT_TYPES.bun}
              onClick={onTabClick}
            >
              Булки
            </Tab>
            <Tab
              value={INGREDIENT_TYPES.main}
              active={currentTab === INGREDIENT_TYPES.main}
              onClick={onTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value={INGREDIENT_TYPES.sauce}
              active={currentTab === INGREDIENT_TYPES.sauce}
              onClick={onTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content} data-testid="ingredients-content">
          <IngredientsCategory
            title="Булки"
            titleRef={titleBunRef}
            ingredients={buns}
            ref={bunsRef}
            data-testid="bun-ingredients"
          />
          <IngredientsCategory
            title="Начинки"
            titleRef={titleMainRef}
            ingredients={mains}
            ref={mainsRef}
            data-testid="mains-ingredients"
          />
          <IngredientsCategory
            title="Соусы"
            titleRef={titleSaucesRef}
            ingredients={sauces}
            ref={saucesRef}
            data-testid="sauces-ingredients"
          />
        </div>
      </section>
    </>
  );
});
