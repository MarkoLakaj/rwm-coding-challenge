# Test Plan: Functional UI and API Automation

## 1. Objective

This test plan outlines the strategy for automating functional UI and API tests for a sample application (React frontend and Node.js backend).  
The goal is to ensure key features like login, CRUD operations on items, and API interactions function correctly, both under expected and error conditions.

---

## 2. Scope of Testing

### UI Automation

The following end-to-end user flows will be validated and automated:

- **Login**
  - Valid credentials
  - Invalid credentials
- **Article Management**
  - Create new article
  - Edit existing article
  - Delete article
  - Validate data is correctly reflected in UI post-actions

### API Automation

The following API endpoints will be covered:

- `POST /login`
- `GET /articles`
- `POST /articles`
- `PUT /articles/:id`
- `DELETE /articles/:id`

Both positive and negative scenarios will be included to validate behavior under various conditions.

---

## 3. Test Coverage Areas

| Area             | Coverage Type | Description                                      |
|------------------|----------------|--------------------------------------------------|
| Authentication   | UI & API       | Login with valid/invalid credentials             |
| CRUD Functionality | UI & API     | Create, Read, Update, Delete items               |
| Data Validation  | UI             | Ensure UI reflects backend changes correctly     |
| Status Codes     | API            | Validate 2xx, 4xx, and 5xx responses             |
| Error Handling   | UI & API       | Invalid inputs, missing fields, bad IDs          |

---

## 4. Tools and Frameworks

| Tool / Library   | Purpose |
|------------------|---------|
| **Playwright**   | Primary framework used for both UI and API test automation. It provides powerful browser automation, built-in test runner, and network interception. |
| **Faker**        | Used to generate dynamic and realistic test data (e.g., names, emails, strings) to avoid hardcoding values and improve test reliability. |
| **GitHub Actions** | Continuous Integration (CI) setup to automatically run all tests on each code push or pull request. Ensures early feedback and consistent test execution across environments. |

---

## 5. Risks and Assumptions
- The application backend and frontend are assumed to be stable and reachable during test execution.
- No third-party rate limits are expected during API testing.

---

## 6. Future Enhancements
- Integrate a more visually appealing reporter (e.g., Allure)
- Visual regression testing using Playwright snapshots