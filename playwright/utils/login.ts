import { Page } from '@playwright/test';

const HOME_URL = process.env.HOME_URL ?? '';

async function login(
  page: Page,
  loginUrl: string,
  email: string,
  password: string
) {
  await page.goto(loginUrl);
  await page.click('.ch-button');
  await page.fill('#session_email', email);
  await page.fill('#session_password', password);
  await page.click('.primary');

  await page.click('text=Conta 1');
  await page.goto(HOME_URL);
}

export default login;
