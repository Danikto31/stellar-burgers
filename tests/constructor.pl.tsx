import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

/* Все запросы к бэкенду идут на /api: те, что есть в HAR-файлах, получают
   моковый ответ, остальные обрываются, чтобы тесты не ходили на реальный сервер. */
const API_URL_PATTERN = '**/api/**';

const INGREDIENTS_HAR = 'ingredients.har';
const USER_HAR = 'user.har';
const ORDER_HAR = 'order.har';

/* Данные ниже совпадают с моковыми ответами из tests/hars. */
const craterBun = {
  id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
};

const fluorescentBun = {
  id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
};

const biocutlet = {
  id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  calories: '4242',
  proteins: '420',
  fat: '142',
  carbohydrates: '242',
};

const spicySauce = {
  id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
};

const userName = 'Тестовый пользователь';
const orderNumber = '98765';
const accessToken = 'Bearer test-access-token';
const refreshToken = 'test-refresh-token';

const getHarPath = (fileName: string): string =>
  fileURLToPath(new URL(`./hars/${fileName}`, import.meta.url));

const mockBackend = async (page: Page, harFileNames: string[]): Promise<void> => {
  await page.route(API_URL_PATTERN, (route) => route.abort());

  for (const harFileName of harFileNames) {
    await page.routeFromHAR(getHarPath(harFileName), {
      url: API_URL_PATTERN,
      notFound: 'fallback',
    });
  }
};

const openConstructorPage = async (page: Page): Promise<void> => {
  await page.goto('/');
  await expect(page.getByTestId('bun-ingredients')).toBeVisible();
};

const addIngredient = async (page: Page, ingredientId: string): Promise<void> => {
  await page
    .getByTestId(`ingredient-${ingredientId}`)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const openIngredientModal = async (page: Page, ingredientId: string): Promise<void> => {
  await page.getByTestId(`ingredient-${ingredientId}`).getByRole('link').click();
  await expect(page.getByTestId('modal')).toBeVisible();
};

test.describe('Добавление ингредиентов в конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page, [INGREDIENTS_HAR]);
    await openConstructorPage(page);
  });

  test('булка добавляется одновременно в верх и низ бургера', async ({ page }) => {
    await addIngredient(page, craterBun.id);

    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      `${craterBun.name} (верх)`
    );
    await expect(page.getByTestId('constructor-bun-2')).toContainText(
      `${craterBun.name} (низ)`
    );
  });

  test('новая булка заменяет ранее добавленную', async ({ page }) => {
    await addIngredient(page, craterBun.id);
    await addIngredient(page, fluorescentBun.id);

    const constructor = page.getByTestId('constructor');
    await expect(page.getByTestId('constructor-bun-1')).toContainText(
      fluorescentBun.name
    );
    await expect(page.getByTestId('constructor-bun-2')).toContainText(
      fluorescentBun.name
    );
    await expect(constructor).not.toContainText(craterBun.name);
  });

  test('начинка и соус добавляются в середину бургера', async ({ page }) => {
    await addIngredient(page, biocutlet.id);
    await addIngredient(page, spicySauce.id);

    const fillings = page.getByTestId('constructor-ingredients').getByRole('listitem');
    await expect(fillings).toHaveCount(2);
    await expect(fillings.nth(0)).toContainText(biocutlet.name);
    await expect(fillings.nth(1)).toContainText(spicySauce.name);
  });
});

test.describe('Модальное окно с описанием ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page, [INGREDIENTS_HAR]);
    await openConstructorPage(page);
  });

  test('открывается с данными того ингредиента, по которому кликнули', async ({
    page,
  }) => {
    await openIngredientModal(page, biocutlet.id);

    const modal = page.getByTestId('modal');
    await expect(page).toHaveURL(`/ingredients/${biocutlet.id}`);
    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText(biocutlet.name);
    await expect(modal).toContainText(biocutlet.calories);
    await expect(modal).toContainText(biocutlet.proteins);
    await expect(modal).toContainText(biocutlet.fat);
    await expect(modal).toContainText(biocutlet.carbohydrates);
    await expect(modal).not.toContainText(spicySauce.name);
  });

  test('закрывается по клику на крестик', async ({ page }) => {
    await openIngredientModal(page, biocutlet.id);

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });

  test('закрывается по клику на оверлей', async ({ page }) => {
    await openIngredientModal(page, biocutlet.id);

    /* Центр оверлея перекрыт самим окном, поэтому кликаем в угол. */
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });

  test('закрывается по нажатию Escape', async ({ page }) => {
    await openIngredientModal(page, biocutlet.id);

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: encodeURIComponent(accessToken),
        url: baseURL,
      },
    ]);
    await page.addInitScript((token) => {
      localStorage.setItem('refreshToken', token);
    }, refreshToken);

    await mockBackend(page, [INGREDIENTS_HAR, USER_HAR, ORDER_HAR]);
    await openConstructorPage(page);
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('заказ оформляется, показывается его номер и конструктор очищается', async ({
    page,
  }) => {
    /* Имя из мокового ответа /auth/user в шапке — значит, токены приняты. */
    await expect(page.getByRole('banner')).toContainText(userName);

    await addIngredient(page, craterBun.id);
    await addIngredient(page, biocutlet.id);
    await addIngredient(page, spicySauce.id);

    const orderRequestPromise = page.waitForRequest(
      (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
    );
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    const orderRequest = await orderRequestPromise;

    expect(orderRequest.headers().authorization).toBe(accessToken);
    expect(orderRequest.postDataJSON()).toEqual({
      ingredients: [craterBun.id, biocutlet.id, spicySauce.id, craterBun.id],
    });

    await expect(page.getByTestId('order-number')).toHaveText(orderNumber);

    const constructor = page.getByTestId('constructor');
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(
      page.getByTestId('constructor-ingredients').getByRole('listitem')
    ).toHaveText(['Выберите начинку']);
    await expect(constructor).toContainText('Выберите булки');
    await expect(page.getByTestId('order-summ')).toContainText('0');

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(page.getByTestId('order-number')).toHaveCount(0);
  });
});
