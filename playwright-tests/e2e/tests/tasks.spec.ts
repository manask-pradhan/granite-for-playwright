import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Tasks page", () => {
  let taskName: string;

  test.beforeEach(() => {
    taskName = faker.word.words({ count: 5 });
  });

  test("should create a new task with creator as the assignee", async ({
    loginPage,
    taskPage,
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await loginPage.loginAndVerifyUser({
      email: "oliver@example.com",
      password: "welcome",
      username: "Oliver Smith",
    });

    await taskPage.createTaskAndVerify({ taskName })
  });

  test("should be able to mark as completed", async ({ page, loginPage, taskPage }) => {
    await page.goto("http://localhost:3000")
    await loginPage.loginAndVerifyUser({
      username: "Oliver Smith",
      email: "oliver@example.com",
      password: "welcome"
    })

    await taskPage.createTaskAndVerify({ taskName })

    await page.getByTestId("tasks-pending-table").getByRole("row", { name: taskName }).getByRole("checkbox").click()

    const completedTaskInDashboard = page.getByTestId("tasks-completed-table").getByRole("row", { name: taskName })
    await completedTaskInDashboard.scrollIntoViewIfNeeded()
    await expect(completedTaskInDashboard).toBeVisible()
  })
});
