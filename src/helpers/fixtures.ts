import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { DashboardPage } from '@/pages/dashboard.page';
import { AsbaPage } from '@/pages/asba.page';

type MeroshareFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  asbaPage: AsbaPage;
};

export const test = base.extend<MeroshareFixtures>({
  loginPage: async ({ page }, use) => {
    const dpId = process.env.DP_ID;
    const username = process.env.MS_USERNAME;
    const password = process.env.PASSWORD;

    if (!dpId || !username || !password) {
      throw new Error(
        'Environment variables DP_ID, MS_USERNAME, or PASSWORD are not defined. ' +
          'Please check your .env file.'
      );
    }

    const loginPage = new LoginPage(page);
    await loginPage.login(dpId, username, password);

    await expect(page).toHaveURL(/.*#\/dashboard/, { timeout: 15000 });

    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  asbaPage: async ({ page }, use) => {
    await use(new AsbaPage(page));
  },
});

export { expect } from '@playwright/test';
