# Demoblaze Playwright Automation

This repository contains an **end-to-end test automation framework** built with [Playwright](https://playwright.dev/) for the [Demoblaze demo application](https://www.demoblaze.com/).  
It demonstrates **modern QA automation practices** including **Page Object Model (POM)** design, reusable test fixtures, and integration with CI/CD pipelines.

---

## Project Structure

```
src/
 ├── fixtures/               # Shared Playwright fixtures
 │   └── test-fixtures.ts
 │
 ├── pages/                  # Page Object Model (POM) classes
 │   ├── components/         # Reusable UI components
 │   │   └── Navbar.ts
 │   ├── modals/             # Modal components
 │   │   ├── LoginModal.ts
 │   │   └── SignupModal.ts
 │   ├── BasePage.ts
 │   ├── CartPage.ts
 │   ├── HomePage.ts
 │   └── ProductPage.ts
 │
 ├── utils/                  # Helper utilities
 │   ├── auth.ts
 │   ├── credentials.ts
 │   └── random.ts
 │
 └── tests/                  # Test specs
     ├── auth.login.spec.ts
     ├── auth.logout.spec.ts
     ├── auth.signup-login.spec.ts
     ├── cart.place-order.spec.ts
     └── smoke.add-to-cart.spec.ts
```

---

## Features

- **Playwright with TypeScript** for fast, reliable browser automation.
- **Page Object Model (POM)** pattern for maintainable and reusable code.
- **Component-based design**: Navbar, Modals, and other UI elements modeled as classes.
- **Utilities & Fixtures**:
  - Random data generator for test data.
  - Auth helpers for login/logout workflows.
- **Comprehensive test coverage**:
  - Login / Logout
  - User signup
  - Add to cart & place order
  - Smoke tests
- **CI/CD ready** with GitHub Actions (`.github/workflows/playwright.yaml`).

---

## Setup & Installation

Clone the repo:

```bash
git clone https://github.com/smilyutin/demoblaze.git
cd demoblaze
```

Install dependencies:

```bash
npm install
```

Run Playwright setup:

```bash
npx playwright install --with-deps
```

---

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/auth.login.spec.ts
```

Run tests in headed mode with UI:

```bash
npx playwright test --headed
```

View HTML report:

```bash
npx playwright show-report
```

---

## CI/CD Integration

The project is configured with **GitHub Actions** to:

- Build and test automatically on each push to `dev*` or `main`.
- Generate Playwright reports and upload test artifacts.

Workflow file: `.github/workflows/playwright.yaml`

---

## Visual Testing (Optional)

Integration with **Argos CI** or **Applitools** can be added for visual regression testing. Example helper included (`argosScreenshot`).

---

## Example Test

```ts
test('Add product to cart', async ({ pageManager }) => {
  await pageManager.navigateTo().homePage();
  await pageManager.onHomePage().selectProduct('Samsung galaxy s6');
  await pageManager.onProductPage().addToCart();
  await pageManager.onCartPage().assertProductInCart('Samsung galaxy s6');
});
```

---

## Contribution

Feel free to fork, open issues, and submit PRs. This repo is meant as both a **learning project** and a **portfolio-ready example** for showcasing QA automation skills.
