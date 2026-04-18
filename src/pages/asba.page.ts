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
  try {
    // Wait for at least one company-list to appear in DOM
    await this.page.waitForSelector('.company-list', { timeout: 15000 });
  } catch {
    console.log('No company lists found in page (timeout waiting for .company-list)');
    return false;
  }

  // Small buffer to let Angular finish rendering all list items
  await this.page.waitForTimeout(1000);

  const companyLists = await this.page.locator('.company-list').all();

  if (companyLists.length === 0) {
    console.log('No company lists found after waiting');
    return false;
  }

  console.log(`Found ${companyLists.length} company list(s)`);

  let appliedCount = 0;

  for (const companyList of companyLists) {
    try {
      // Use textContent instead of innerText — more reliable for hidden/offscreen elements
      const subGroupText = await companyList
        .locator('[tooltip="Sub Group"]')
        .textContent()
        .catch(() => '');

      const shareTypeText = await companyList
        .locator('[tooltip="Share Type"]')
        .textContent()
        .catch(() => '');

      const shareGroupText = await companyList
        .locator('[tooltip="Share Group"]')
        .textContent()
        .catch(() => '');

      const subGroupLower  = subGroupText?.trim().toLowerCase()  ?? '';
      const shareTypeLower = shareTypeText?.trim().toLowerCase() ?? '';
      const shareGroupLower = shareGroupText?.trim().toLowerCase() ?? '';

      console.log(`Processing → SubGroup: "${subGroupLower}" | Type: "${shareTypeLower}" | Group: "${shareGroupLower}"`);

      const hasGeneralPublic = subGroupLower.includes('for general public');
      const hasIPOType       = shareTypeLower.includes('ipo');
      const hasOrdinaryShare = shareGroupLower.includes('ordinary');

      if (hasGeneralPublic && hasIPOType && hasOrdinaryShare) {
        // Confirm the Apply button is visible before clicking
        const applyBtn = companyList.locator('button.btn-issue');

        const isVisible = await applyBtn.isVisible().catch(() => false);
        if (!isVisible) {
          console.log('Apply button not visible, skipping...');
          continue;
        }

        await applyBtn.click();
        console.log(`✅ Applied for IPO → SubGroup: ${subGroupText?.trim()}, Type: ${shareTypeText?.trim()}, Group: ${shareGroupText?.trim()}`);
        appliedCount++;

        // Wait after each click so the next modal/page can settle
        await this.page.waitForTimeout(2000);

        // ⚠️ If clicking opens a modal/dialog and navigates away,
        // you may need to handle that here and break the loop.
        // e.g. await this.handleApplyModal();
      } else {
        console.log(`⏭️ Skipping → GeneralPublic: ${hasGeneralPublic}, IPO: ${hasIPOType}, Ordinary: ${hasOrdinaryShare}`);
      }
    } catch (error) {
      console.error('Error processing a company list entry:', error);
      continue;
    }
  }

  if (appliedCount === 0) {
    console.log('No matching IPO found (General Public + IPO + Ordinary Shares)');
    return false;
  }

  console.log(`Total applied: ${appliedCount}`);
  return true;
}

  async fillApplicationForm() {
    await this.elements.bankDropdown.click();
    await this.elements.bankOption.selectOption('59');
    // await this.elements.accountNumber.waitFor({ state: 'visible' });
    await this.elements.accountNumber.selectOption({ index: 1 });
    await this.elements.appliedKitta.fill('10');
    await this.elements.crnInput.fill(this.crnNumber);
    await this.elements.disclaimerCheckbox.check();
    await this.elements.proceedButton.click();
    await this.elements.pinInput.fill(this.transactionPin);
    await this.elements.confirmPinButton.click();
  }
}