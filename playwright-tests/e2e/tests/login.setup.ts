import { STORAGE_STATE } from "../../playwright.config";
import { test } from "../fixtures";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({
    page,
    loginPage,
  }) => {
    await page.goto("/");
    await loginPage.loginAndVerifyUser({
      email: "oliver@example.com",
      password: "welcome",
      username: "Oliver Smith",
    });
    await page.context().storageState({ path: STORAGE_STATE })
  });
});
