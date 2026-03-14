import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { DashboardPage } from '@/pages/dashboard.page';
import { AsbaPage } from '@/pages/asba.page';

/**
 * Custom test fixture that handles Meroshare login.
 *
 * The `loggedInPage` fixture:
 *   - Navigates to Meroshare login page
 *   - Selects the DP, enters username & password
 *   - Logs in and verifies the dashboard is reached
 *   - Provides the authenticated `page` to the test
 *
 * Page object fixtures:
 *   - `loginPage`: LoginPage instance (pre-login use)
 *   - `dashboardPage`: DashboardPage instance
 *   - `asbaPage`: AsbaPage instance (for IPO operations)
 */

type MeroshareFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    asbaPage: AsbaPage;
};

export const test = base.extend<MeroshareFixtures>({
    /**
     * Login fixture: automatically logs into Meroshare before each test.
     * Provides the authenticated page context to all page objects.
     */
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

        // Verify login succeeded by checking we landed on the dashboard
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
