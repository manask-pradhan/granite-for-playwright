// register.spec.js

import { test } from "../fixtures";
import { faker } from "@faker-js/faker";
import { LOGIN_SELECTORS, SIGNUP_SELECTORS } from "../constants/selectors";

test.describe("Register page", () => {
  let username: string, email: string, password: string;

  test.beforeEach(() => {
    username = faker.person.fullName();
    email = faker.internet.email();
    password = faker.internet.password();
  })

  test("should register a new user", async ({ page, loginPage }) => {
    await test.step("1. Visit register page", async () => {
      await page.goto("/");
      await page.getByTestId(LOGIN_SELECTORS.registerLink).click();
    })

    await test.step("2. Fill user details and credentials", async () => {
      await page.getByTestId(SIGNUP_SELECTORS.nameField).fill(username);
      await page.getByTestId(SIGNUP_SELECTORS.emailField).fill(email);
      await page.getByTestId(SIGNUP_SELECTORS.passwordField).fill(password);
      await page.getByTestId(SIGNUP_SELECTORS.confirmPasswordField).fill(password);
      await page.getByTestId(SIGNUP_SELECTORS.signupButton).click();
    })

    await test.step("3. Verify newly created user", () =>
      loginPage.loginAndVerifyUser({ email, password, username }))
  });
});
