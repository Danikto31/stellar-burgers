import type { TConstructorIngredient, TIngredient } from '@utils-types';

const IMAGE_URL = 'https://code.s3.yandex.net/react/code/';

export const craterBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: `${IMAGE_URL}bun-02.png`,
  image_mobile: `${IMAGE_URL}bun-02-mobile.png`,
  image_large: `${IMAGE_URL}bun-02-large.png`,
};

export const fluorescentBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: `${IMAGE_URL}bun-01.png`,
  image_mobile: `${IMAGE_URL}bun-01-mobile.png`,
  image_large: `${IMAGE_URL}bun-01-large.png`,
};

export const biocutlet: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: `${IMAGE_URL}meat-01.png`,
  image_mobile: `${IMAGE_URL}meat-01-mobile.png`,
  image_large: `${IMAGE_URL}meat-01-large.png`,
};

export const spicySauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: `${IMAGE_URL}sauce-02.png`,
  image_mobile: `${IMAGE_URL}sauce-02-mobile.png`,
  image_large: `${IMAGE_URL}sauce-02-large.png`,
};

export const ingredients: TIngredient[] = [
  craterBun,
  fluorescentBun,
  biocutlet,
  spicySauce,
];

/** Ингредиент в том виде, в котором он лежит в конструкторе: с собственным ключом. */
export const toConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({ ...ingredient, id });
