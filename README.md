# Playwright Automation
## Automated end-to-end test suite for projects

### Getting Started

#### Pre-requisities
1. Install [NodeJS v20+](https://nodejs.org/en/download)
2. Install [Java 17+](https://www.oracle.com/java/technologies/downloads/) (optional- only for Allure Reports)

#### Setup repository

1. Copy ```env.example``` and create your personal ```.env```
2. Install dependencies using command ```npm install```
3. Install Playwright browsers and necessary dependencies
    ```npx playwright install ```
4. Run all tests using command:
    ```npx playwright test```

## Reports

There are two types of reports that can be generated after running the tests:

1. **HTML Report**

   The test reports are generated in the `test-results` directory.

   To view the report, execute the given command:

   ```shell
   npx playwright show-report
   ```
2. **Allure Report**

   The allure reports are generated in the `allure-report` directory.


   > **Disclaimer**
   In order to use Allure reports you need to have Java installed on your system and `allure-commandline` installed globally.


To install `allure-commandline` globally run:
   ```shell
   npm i allure-commandline -g
   ```


   To build and view Allure reports, execute given command:

   ```shell
   npm run view-allure-reports
   ```


## Preffered Extensions

**Install [Playwright VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for executing tests**
#

1. Playwright Test for VSCode
2. Prettier - Code formatter
3. ESLint

## Project Wiki

Project documentation (pages, locators, test examples) lives in the `docs/` folder. Start here:

- [docs/Pages-Pattern.md](docs/Pages-Pattern.md)
- [docs/Locators.md](docs/Locators.md)
- [docs/Importing-Pages-In-Tests.md](docs/Importing-Pages-In-Tests.md)
- [docs/Examples.md](docs/Examples.md)