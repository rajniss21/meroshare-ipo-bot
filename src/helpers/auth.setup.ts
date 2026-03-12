import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('Authenticate', async ({ page }) => {
    const username = process.env.USER_NAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
        throw new Error('Environment variables USER_NAME or PASSWORD is not defined.');
    }

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-button').click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(`${process.env.DASHBOARD_URL}`);
    await page.context().storageState({ path: authFile });
});