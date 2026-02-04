import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

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
});
