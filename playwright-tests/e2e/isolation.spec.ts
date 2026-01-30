import { test } from "@playwright/test"

test("Regular test", async ({ browser }) => {
  const adminContext = await browser.newContext();
  const regularContext = await browser.newContext();

  // So that all the things can be isolated, there will be no mixup with admin and regular user data
  // It will not effect othes test task / data, and will work independently
  const adminPage = await adminContext.newPage();
  const regularPage = await regularContext.newPage();

})
