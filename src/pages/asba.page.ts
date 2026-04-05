import { expect, Locator, Page } from '@playwright/test';

export class AsbaPage {
  readonly page: Page;
  readonly crnNumber: string;
  readonly transactionPin: string;
  readonly elements: {
    myApplicationTab: Locator;
    newApplicationSection: Locator;

    companyIssueList: Locator;
    companyNameCell: Locator;
    applyButton: Locator;

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

    applicationReportTable: Locator;
    applicationRows: Locator;
    noDataMessage: Locator;

    toastMessage: Locator;
    successMessage: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.crnNumber = process.env.CRN_NUMBER || '';
    this.transactionPin = process.env.TRANSACTION_PIN || '';
    this.elements = {
      myApplicationTab: page.locator('a[routerlink="applicant/application-report"]'),
      newApplicationSection: page.locator('a[routerlink="applicant/apply"]'),

      companyIssueList: page.locator('.company-list'),
      companyNameCell: page.locator('.company-name'),
      applyButton: page.getByRole('button', { name: 'Apply' }),

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

      applicationReportTable: page.locator('.table'),
      applicationRows: page.locator('.table tbody tr'),
      noDataMessage: page.locator('.empty-msg'),

      toastMessage: page.locator('.toast-message'),
      successMessage: page.locator('.toast-success .toast-message'),
    };
  }

  async navigateToApplyForIssue() {
    await this.page.goto('/#/asba');
    await this.page.waitForLoadState('networkidle');
  }

async clickOnApplyButtonForType(): Promise<boolean> {
  // Get all company list rows
  const rows = await this.page.locator('.company-list [class*="row"]').all();
  
  // If no rows found, try alternative selector
  if (rows.length === 0) {
    const shareGroup = await this.page.locator('.company-list .isin').innerText();
    const lowerText = shareGroup.trim().toLowerCase();
    if (lowerText.includes('ordinary')) {
      await this.elements.applyButton.first().click();
      return true;
    }
    console.log(`Skipping apply, share group is: "${shareGroup}"`);
    return false;
  }

  // Loop through each row to find ordinary share
  for (const row of rows) {
    const shareTypeElement = row.locator('.isin, [class*="share"], [class*="type"]');
    const shareGroup = await shareTypeElement.innerText().catch(() => '');
    const lowerText = shareGroup.trim().toLowerCase();
    
    if (lowerText.includes('ordinary')) {
      const applyBtn = row.locator('button:has-text("Apply")');
      await applyBtn.click();
      console.log(`Applied for ordinary share: ${shareGroup}`);
      return true;
    } else if (lowerText) {
      console.log(`Skipping share type: "${shareGroup}"`);
    }
  }

  return false;
}

  async fillApplicationForm() {
    await this.elements.bankDropdown.click();
    await this.elements.bankOption.selectOption('59');
    await this.elements.accountNumber.selectOption('02616766840');
    await this.elements.appliedKitta.fill('10');
    await this.elements.crnInput.fill(this.crnNumber);
    await this.elements.disclaimerCheckbox.check();
    await this.elements.proceedButton.click();
    await this.elements.pinInput.fill(this.transactionPin);
    //await this.elements.confirmPinButton.click();
  }
}