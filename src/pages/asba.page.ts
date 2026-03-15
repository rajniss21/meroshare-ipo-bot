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
        bankOption: Locator;
        accountNumber: Locator;
        appliedKitta: Locator;
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
            bankOption: page.getByLabel('Bank'),
            accountNumber: page.getByLabel('Account Number'),
            appliedKitta: page.getByRole('textbox', { name: 'Applied Kitta' }),
            crnInput: page.getByRole('textbox', { name: 'Enter CRN' }),
            disclaimerCheckbox: page.locator('#disclaimer'),
            submitButton: page.getByRole('button', { name: 'Submit' }),
            proceedButton: page.getByRole('button', { name: 'Proceed' }),
            pinInput: page.locator('#transactionPIN'),
            confirmPinButton: page.getByRole('button', { name: 'Apply' }),

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

    async clickOnApplyButton() {
        await this.elements.applyButton.click();
        await this.page.waitForLoadState('networkidle');
    }
    async fillApplicationForm(){
            await this.elements.bankDropdown.click();
            await this.elements.bankOption.selectOption('59');
            await this.elements.accountNumber.selectOption('02616766840');
            await this.elements.appliedKitta.fill('10');
            await this.elements.crnInput.fill('123456789');
            await this.elements.disclaimerCheckbox.check();
            await this.elements.proceedButton.click();
            await this.elements.pinInput.fill('1234');
            await this.elements.confirmPinButton.click();


    }
    
    
}

