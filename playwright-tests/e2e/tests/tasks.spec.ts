import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";

test.describe("Tasks page", () => {
  let taskName: string;

  test.beforeEach(async ({ page }) => {
    taskName = faker.word.words({ count: 5 });
    await page.goto("/");
  });

  test("should create a new task with creator as the assignee", async ({ taskPage }) => {
    await taskPage.createTaskAndVerify({ taskName })
  });

  test("should be able to mark as completed", async ({ taskPage }) => {
    await taskPage.createTaskAndVerify({ taskName })
    await taskPage.markTaskAsCompletedAndVerify({ taskName })
  })

  test("should be able to delete a completed task", async ({ page, taskPage }) => {
    await taskPage.createTaskAndVerify({ taskName })
    await taskPage.markTaskAsCompletedAndVerify({ taskName })
    const completedTask = page.getByTestId("tasks-completed-table").getByRole("row", { name: taskName })

    await completedTask.getByTestId("completed-task-delete-link").click()

    await expect(completedTask).toBeHidden()
    await expect(page.getByTestId("tasks-pending-table").getByRole("row", { name: taskName })).toBeHidden()
  })

  test.describe("starring task feature", () => {
    test.describe.configure({ mode: "serial" })

    test("should be able to star a pending task", async ({ taskPage }) => {
      await taskPage.createTaskAndVerify({ taskName })
      await taskPage.starTaskAndVerify({ taskName })
    })

    test("should be able to un-star a pending task", async ({ page, taskPage }) => {
      await taskPage.createTaskAndVerify({ taskName })
      await taskPage.starTaskAndVerify({ taskName })

      const starIcon = page
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })
        .getByTestId("pending-task-star-or-unstar-link")

      await starIcon.click()
      await expect(starIcon).toHaveClass(/ri-star-line/i)
    })
  })

  test("should create a new task with different user as the assignee", async ({ page, browser, taskPage }) => {
    await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" })

    // Create a new browser context and a page in the browser
    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] }
    })
    const newUserPage = await newUserContext.newPage()

    // Initialize the Login POM as the fixture is configured to use the default context

    const loginPage = new LoginPage(newUserPage);

    await newUserPage.goto("/")
    await loginPage.loginAndVerifyUser({
      username: "Sam Smith",
      email: "sam@example.com",
      password: "welcome"
    })

    await expect(
      newUserPage.getByTestId("tasks-pending-table").getByRole("row", { name: taskName })
    ).toBeVisible()

    // Close the context and page
    await newUserPage.close()
    await newUserContext.close()
  })
});
