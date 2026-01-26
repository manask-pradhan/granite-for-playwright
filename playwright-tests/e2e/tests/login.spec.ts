import { test, expect } from "@playwright/test"
import LoginPage from "../poms/login"

test.describe("Login page", () => {
  test("should login with correct credentials", async ({ page }) => {
    const loginPage = new LoginPage(page)

    await page.goto("http://localhost:3000")

    await loginPage.loginAndVerifyUser({
      email: "oliver@example.com",
      password: "welcome",
      username: "Oliver Smith"
    })
  })
})
