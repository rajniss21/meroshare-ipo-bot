import { test, expect } from '@/helpers/fixtures';

/**
 * Meroshare IPO Application Bot
 *
 * Flow:
 * 1. Login to Meroshare (handled by the loginPage fixture)
 * 2. Navigate to "Apply for Issue" (ASBA)
 * 3. If new IPOs are available → apply for each
 * 4. If no new IPOs → check the application report for already applied IPOs
 */

test.describe('Meroshare IPO Application', () => {
    test('Apply for new IPO if available, else verify applied status', async ({
        loginPage,
        asbaPage,
        page,
    }) => {
        // Step 1: Login is already done via the loginPage fixture
        // At this point we should be on the dashboard

        // Step 2: Navigate to the "Apply for Issue" section
        await asbaPage.navigateToApplyForIssue();
        await asbaPage.clickOnApplyButton();
        await asbaPage.fillApplicationForm();

    });
});
