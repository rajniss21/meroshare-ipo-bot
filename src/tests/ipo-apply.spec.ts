import { test, expect } from '@/helpers/fixtures';

test.describe('Meroshare IPO Application', () => {
  test('Apply for new IPO if available, else verify applied status', async ({
    loginPage,
    asbaPage,
    page,
  }) => {
    await asbaPage.navigateToApplyForIssue();
    if (await asbaPage.clickOnApplyButtonForType()) {
      await asbaPage.fillApplicationForm();
    }
  });
});
