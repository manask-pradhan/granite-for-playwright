import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker'

test.describe("Register page", () => {
  test("should register a new user", async ({ page }) => {
    const newUserName = faker.person.fullName();
    const newUserEmail = faker.internet.email();
    const newUserPassword = faker.internet.password();

    await page.goto("http://localhost:3000")
    await page.getByTestId('login-register-link').click();

    await page.getByTestId('signup-name-field').fill(newUserName)
    await page.getByTestId('signup-email-field').fill(newUserEmail)
    await page.getByTestId('signup-password-field').fill(newUserPassword)
    await page.getByTestId('signup-password-confirmation-field').fill(newUserPassword)
    await page.getByTestId('signup-submit-button').click();

    await page.getByTestId('login-email-field').fill(newUserEmail)
    await page.getByTestId('login-password-field').fill(newUserPassword)
    await page.getByTestId('login-submit-button').click();

    await expect(page.getByTestId('navbar-username-label')).toContainText(newUserName)
    await expect(page.getByTestId('navbar-logout-link')).toBeVisible()
  })
})
