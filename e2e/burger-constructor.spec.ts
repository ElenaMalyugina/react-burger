import { Urls } from '@/utils/urls';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('Страница отображается с правильным заголовком', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByText('Соберите бургер')).toBeVisible();
});

test('Группы ингредиентов отображаются на странице', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: `${Urls.apiUrl}/api/ingredients`
  });

  await expect(page.getByTestId('bun')).toBeVisible();
  await expect(page.getByTestId('main')).toBeVisible();
  await expect(page.getByTestId('sauce')).toBeVisible();
});


test('Полученные ингредиенты отображаются на странице ', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: `${Urls.apiUrl}/api/ingredients`
  });

  await expect(page.getByText("Флюоресцентная булка R2-D3")).toBeVisible();
  await expect(page.getByText("Хрустящие минеральные кольца")).toBeVisible();
  await expect(page.getByText("Соус Spicy-X")).toBeVisible();
});

test('Модальное окно открывается по клику на ингредиент', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: `${Urls.apiUrl}/api/ingredients`
  });

  await page.getByTestId('692889f16bf770001bfeb4cc').click();

  await expect(page.getByText("Детали ингредиента")).toBeVisible();
  await expect(page.getByTestId("modal-ingredient-name")).toContainText("Краторная булка N-200i");

  await page.getByRole("button", {name: "Закрыть"}).click();
  await expect(page.getByText("Детали ингредиента")).toBeHidden();
});

test('Создание заказа - перетаскивание карточек', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: `${Urls.apiUrl}/api/ingredients`
  });

  const constructorList = page.getByTestId("constructor-list");
  const constructorItems = constructorList.locator("li");

  //булка
  await page.getByTestId('692889f16bf770001bfeb4cc').dragTo(page.getByText("Выберите булки").first());
  await expect(constructorItems.nth(0)).toContainText("Краторная булка N-200i Верх");
  await expect(constructorItems.nth(2)).toContainText("Краторная булка N-200i Низ");

  //начинка
  await page.getByTestId('692889f16bf770001bfeb4d6').dragTo(page.getByText("Выберите начинку"));
  await expect(constructorItems.nth(1)).toContainText("Хрустящие минеральные кольца");
});


test('Создание заказа - открытие модалки', async ({ page }) => {
  const MOCK_PATH = './e2e/mocks/order.json';
  const MOCK_DATA = fs.readFileSync(MOCK_PATH, 'utf-8');

  await page.route(`${Urls.apiUrl}/api/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@example.com', name: 'Тестовый Пользователь' },
        accessToken: 'Bearer igihgigghf54hgf',
        refreshToken: 'vydsfyd854874gfnmh'
      }),
    });
  });

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: `${Urls.apiUrl}/api/ingredients`
  });

  await page.route(`${Urls.apiUrl}/api/orders`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: MOCK_DATA,
    });
  });

  //логин
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('email').fill('test@example.com');
  await page.getByTestId('password').fill('password');
  await page.getByRole('button', { name: 'Войти' }).click();

  //идем на ингредиенты
  await page.waitForURL('**/');

  //минимаольный заказ
  await page.getByTestId('692889f16bf770001bfeb4cc').dragTo(page.getByText("Выберите булки").first());
  await page.getByTestId('692889f16bf770001bfeb4d6').dragTo(page.getByText("Выберите начинку"));

  //стоимость
  await expect(page.getByTestId("order-summary")).toContainText("2810");

  //лечим иногда некорректное поведение мыши
  await page.mouse.move(10, 10);
  await page.mouse.up();
  await page.waitForTimeout(100);

  await page.getByRole("button", {name: "Оформить заказ"}).click();

  //Открывается модалка
  await expect(page.getByTestId("order-modal")).toBeVisible();
  await expect(page.getByTestId("order-modal")).toContainText("2657");

  //Закрытие модалки
  await page.getByRole("button", {name: "Закрыть"}).click();
  await expect(page.getByText("Детали ингредиента")).toBeHidden();
});
