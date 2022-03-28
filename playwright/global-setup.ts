import { chromium, FullConfig } from '@playwright/test';
import login from './utils/login';

const username = process.env.ADMIN_USERNAME ?? '';
const password = process.env.ADMIN_PASSWORD ?? '';
const loginUrl = process.env.LOGIN_URL ?? '';

async function globalSetup(
  config: FullConfig
): Promise<void> {
  const { storageState } = config.projects[0].use;

  const browser = await chromium.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await login(page, loginUrl, username, password);
  await page.context().storageState({
    path: storageState,
  });
  await browser.close();
}

export default globalSetup;
