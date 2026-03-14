# Meroshare IPO Bot 🤖

## Automated IPO application bot for [Meroshare](https://meroshare.cdsc.com.np/)

Built with **Playwright** following the **Page Object Model (POM)** pattern. This bot automates the Meroshare login flow and IPO application process.

### What It Does

1. **Logs into Meroshare** (selects DP, enters credentials)
2. **Checks for open IPOs** in the "Apply for Issue" section
3. **Applies for new IPOs** automatically (if available)
4. **Skips already-applied IPOs** by checking the application report
5. **Reports status** of existing applications if no new IPOs are found

---

### Getting Started

#### Prerequisites
1. Install [NodeJS v20+](https://nodejs.org/en/download)
2. Install [Java 17+](https://www.oracle.com/java/technologies/downloads/) (optional — only for Allure Reports)

#### Setup

1. Copy `.env.example` and create your personal `.env`:
   ```shell
   cp .env.example .env
   ```

2. Fill in your Meroshare credentials in `.env`:
   ```env
   BASE_URL="https://meroshare.cdsc.com.np/"
   DP_ID="your_dp_name_here"
   USERNAME="your_username_here"
   PASSWORD="your_password_here"
   CRN_NUMBER="your_crn_number_here"
   TRANSACTION_PIN="your_transaction_pin_here"
   ```

3. Install dependencies:
   ```shell
   npm install
   ```

4. Install Playwright browsers:
   ```shell
   npx playwright install
   ```

5. Run the IPO bot:
   ```shell
   npx playwright test
   ```

6. Run in headed mode (to watch the bot work):
   ```shell
   npx playwright test --headed
   ```

---

### Project Structure

```
src/
├── pages/                    # Page Object Model classes
│   ├── login.page.ts         # Meroshare login page
│   ├── dashboard.page.ts     # Dashboard after login
│   └── asba.page.ts          # ASBA / IPO application page
├── helpers/
│   ├── fixtures.ts           # Login fixture (auto-login before tests)
│   └── api-request.ts        # API helper utilities
├── tests/
│   └── ipo-apply.spec.ts     # Main IPO application test
└── data/                     # Test data (if needed)
```

### Architecture

- **Login as Fixture**: The `loginPage` fixture automatically handles the full login flow (DP selection + credentials) before each test — no session restoration needed.
- **POM Pattern**: Each Meroshare page/section has its own Page Object class with locators and action methods.
- **Smart Application**: The bot checks the application report before applying to avoid duplicate submissions.

---

### Reports

1. **HTML Report**
   ```shell
   npx playwright show-report
   ```

2. **Allure Report** (requires Java + `allure-commandline`)
   ```shell
   npm i allure-commandline -g
   npm run view-allure-reports
   ```

---

### Preferred Extensions

- [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- Prettier - Code formatter
- ESLint

### Project Wiki

- [docs/Pages-Pattern.md](docs/Pages-Pattern.md)
- [docs/Locators.md](docs/Locators.md)
- [docs/Importing-Pages-In-Tests.md](docs/Importing-Pages-In-Tests.md)
- [docs/Examples.md](docs/Examples.md)