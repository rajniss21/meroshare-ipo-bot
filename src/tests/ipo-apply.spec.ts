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

        // Step 3: Check if there are any open IPOs available
        const ipoCount = await asbaPage.getAvailableIPOCount();
        const ipoNames = await asbaPage.getAvailableIPONames();

        console.log(`Found ${ipoCount} open IPO(s)`);
        if (ipoNames.length > 0) {
            console.log('Available IPOs:', ipoNames.join(', '));
        }

        if (ipoCount > 0) {
            // ────── New IPOs available → Apply ──────
            console.log('New IPO(s) found! Proceeding to apply...');

            for (let i = 0; i < ipoCount; i++) {
                const ipoName = ipoNames[i] || `IPO #${i + 1}`;

                // Check if already applied for this specific IPO
                const alreadyApplied = await asbaPage.isAlreadyApplied(ipoName);

                if (alreadyApplied) {
                    console.log(`Already applied for "${ipoName}". Skipping.`);
                    continue;
                }

                console.log(`Applying for "${ipoName}"...`);

                // Navigate back to the apply section (since we checked report)
                await asbaPage.navigateToApplyForIssue();
                await asbaPage.clickApplyForIPO(i);

                // Fill out the application form
                // TODO: Update these values with your actual bank/CRN/PIN details
                await asbaPage.fillApplicationForm({
                    quantity: '10',
                    crn: process.env.CRN_NUMBER || '',
                    transactionPin: process.env.TRANSACTION_PIN || '',
                });

                // Verify application was submitted
                await asbaPage.assertApplicationSuccess();
                console.log(`Successfully applied for "${ipoName}"!`);
            }
        } else {
            // ────── No new IPOs → Check application report ──────
            console.log('No new IPOs available. Checking application report...');

            await asbaPage.navigateToApplicationReport();
            await page.waitForTimeout(2000);

            const appliedRows = asbaPage.elements.applicationRows;
            const appliedCount = await appliedRows.count();

            if (appliedCount > 0) {
                console.log(`Found ${appliedCount} applied IPO(s) in your report.`);

                for (let i = 0; i < appliedCount; i++) {
                    const rowText = await appliedRows.nth(i).textContent();
                    console.log(`  → ${rowText?.trim()}`);
                }
            } else {
                console.log('No applications found in the report.');
            }
        }
    });
});
