# rwm-coding-challenge

Automated end-to-end testing project for a React + Node.js application, using Playwright for UI and API testing, Faker for test data generation, and GitHub Actions for CI.

---

## 🚀 Features

- **UI testing**: Login flows, create/edit/delete items, verify data.
- **API testing**: Interactions with endpoints (`POST /login`, `GET/POST/PUT/DELETE /items/:id`), with positive and negative scenarios.
- Dynamic test data using Faker.
- Continuous integration pipelines via GitHub Actions.

---

## ⚙️ Prerequisites

- Node.js (LTS version)
- npm (comes with Node.js)
- Git

---

## 🛠️ Local Installation & Usage

Clone the repository and install dependencies:

```bash
git clone https://github.com/MarkoLakaj/rwm-coding-challenge.git
cd rwm-coding-challenge
npm install --force

```

Install Playwright browsers:
```bash
npx playwright install --with-deps --force
```

Run all tests (UI + API):

```bash
npx playwright test
```

---

## 🧪 Test Structure

- UI tests: located in tests/e2e/
- API tests: located in tests/api/
- Playwright configured via playwright.config.ts

---

## 🧩 Dynamic Test Data
Faker is used to generate realistic test data — including names, emails, text, and more — making tests more robust and less brittle.

---

## 📊 Generate HTML Reports
After tests complete, generate reports:

```bash
npx playwright show-report
```




