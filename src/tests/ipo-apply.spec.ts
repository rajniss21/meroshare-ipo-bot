import { test, expect } from '@/helpers/fixtures';

test.describe('Meroshare IPO Application', () => {
  test('Apply for new IPO if available, else verify applied status', async ({ asbaPage }) => {
    await asbaPage.navigateToApplyForIssue();
    await asbaPage.clickOnApplyButton();
    await asbaPage.fillApplicationForm();
  });
});
