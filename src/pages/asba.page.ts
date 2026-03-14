import { expect, Locator, Page } from '@playwright/test';

export class AsbaPage {
    readonly page: Page;
    readonly elements: {
        // My ASBA / Application tabs
        myApplicationTab: Locator;
        newApplicationSection: Locator;

        // IPO List in "Apply for Issue"
        companyIssueList: Locator;
        companyNameCell: Locator;
        applyButton: Locator;

        // Application form elements
        bankDropdown: Locator;
        bankOption: (bankName: string) => Locator;
        quantityInput: Locator;
        crnInput: Locator;
        disclaimerCheckbox: Locator;
        submitButton: Locator;
        proceedButton: Locator;
        pinInput: Locator;
        confirmPinButton: Locator;

        // Application report / status
        applicationReportTable: Locator;
        applicationRows: Locator;
        noDataMessage: Locator;

        // Success / error messages
        toastMessage: Locator;
        successMessage: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.elements = {
            // Tabs
            myApplicationTab: page.locator('a[routerlink="applicant/application-report"]'),
            newApplicationSection: page.locator('a[routerlink="applicant/apply"]'),

            // IPO issue list
            companyIssueList: page.locator('.company-list'),
            companyNameCell: page.locator('.company-name'),
            applyButton: page.getByRole('button', { name: 'Apply' }),

            // Application form
            bankDropdown: page.locator('#selectBank'),
            bankOption: (bankName: string) =>
                page.locator('.cdk-overlay-container .mat-option').filter({ hasText: bankName }),
            quantityInput: page.locator('input[formcontrolname="appliedKitta"]'),
            crnInput: page.locator('input[formcontrolname="crnNumber"]'),
            disclaimerCheckbox: page.locator('input[type="checkbox"]'),
            submitButton: page.getByRole('button', { name: 'Submit' }),
            proceedButton: page.getByRole('button', { name: 'Proceed' }),
            pinInput: page.locator('input[type="password"][formcontrolname="transactionPIN"]'),
            confirmPinButton: page.locator('.modal-footer button.btn-submit'),

            // Application report
            applicationReportTable: page.locator('.table'),
            applicationRows: page.locator('.table tbody tr'),
            noDataMessage: page.locator('.empty-msg'),

            // Toasts
            toastMessage: page.locator('.toast-message'),
            successMessage: page.locator('.toast-success .toast-message'),
        };
    }

    /**
     * Navigate to the "Apply for Issue" (IPO) section from the sidebar.
     */
    async navigateToApplyForIssue() {
        await this.page.goto('/#/asba');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Navigate to "My Application Report" tab to see applied IPOs.
     */
    async navigateToApplicationReport() {
        await this.elements.myApplicationTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Check if there are any open IPOs available to apply.
     * Returns the count of available IPOs.
     */
    async getAvailableIPOCount(): Promise<number> {
        await this.page.waitForTimeout(2000); // allow list to load
        const rows = this.page.locator('.company-list table tbody tr');
        const count = await rows.count();
        return count;
    }

    /**
     * Get all available IPO company names.
     */
    async getAvailableIPONames(): Promise<string[]> {
        await this.page.waitForTimeout(2000);
        const names: string[] = [];
        const rows = this.page.locator('.company-list table tbody tr');
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const name = await rows.nth(i).locator('td').first().textContent();
            if (name) names.push(name.trim());
        }
        return names;
    }

    /**
     * Click the "Apply" button on a specific IPO by its row index (0-based).
     */
    async clickApplyForIPO(index: number = 0) {
        const rows = this.page.locator('.company-list table tbody tr');
        await rows.nth(index).locator('button').click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Fill out the IPO application form.
     */
    async fillApplicationForm(options: {
        bankName?: string;
        quantity: string;
        crn: string;
        transactionPin: string;
    }) {
        // Select bank if provided
        if (options.bankName) {
            await this.elements.bankDropdown.click();
            await this.page.locator('.cdk-overlay-container').waitFor({ state: 'visible' });
            await this.elements.bankOption(options.bankName).first().click();
        }

        // Fill quantity (kitta)
        await this.elements.quantityInput.fill(options.quantity);

        // Fill CRN number
        await this.elements.crnInput.fill(options.crn);

        // Accept disclaimer
        const checkbox = this.elements.disclaimerCheckbox;
        if (await checkbox.isVisible()) {
            await checkbox.check();
        }

        // Click submit
        await this.elements.submitButton.click();

        // Handle the confirmation dialog - click "Proceed"
        await this.elements.proceedButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.elements.proceedButton.click();

        // Enter Transaction PIN
        await this.elements.pinInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.elements.pinInput.fill(options.transactionPin);
        await this.elements.confirmPinButton.click();

        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Check if a specific company has been already applied for.
     * Returns true if the company is found in the application report.
     */
    async isAlreadyApplied(companyName: string): Promise<boolean> {
        await this.navigateToApplicationReport();
        await this.page.waitForTimeout(2000); // wait for data to load

        const rows = this.elements.applicationRows;
        const count = await rows.count();

        if (count === 0) return false;

        for (let i = 0; i < count; i++) {
            const rowText = await rows.nth(i).textContent();
            if (rowText && rowText.includes(companyName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get the status of an application by company name.
     */
    async getApplicationStatus(companyName: string): Promise<string | null> {
        await this.navigateToApplicationReport();
        await this.page.waitForTimeout(2000);

        const rows = this.elements.applicationRows;
        const count = await rows.count();

        for (let i = 0; i < count; i++) {
            const rowText = await rows.nth(i).textContent();
            if (rowText && rowText.includes(companyName)) {
                // Status is typically in one of the last columns
                const cells = rows.nth(i).locator('td');
                const cellCount = await cells.count();
                const status = await cells.nth(cellCount - 1).textContent();
                return status?.trim() || null;
            }
        }
        return null;
    }

    /**
     * Assert that the application was submitted successfully.
     */
    async assertApplicationSuccess() {
        await expect(this.elements.toastMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Assert no IPOs are available.
     */
    async assertNoIPOsAvailable() {
        const count = await this.getAvailableIPOCount();
        expect(count).toBe(0);
    }
}
