import { expect, Page } from "@playwright/test";

export default class TaskPage {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  createTaskAndVerify = async ({ taskName }: { taskName: string }) => {
    await this.page.getByTestId("navbar-add-todo-link").click();
    await this.page.getByTestId("form-title-field").fill(taskName);

    await this.page.locator(".css-2b097c-container").click();
    await this.page
      .locator(".css-26l3qy-menu")
      .getByText("Oliver Smith")
      .click();
    await this.page.getByTestId("form-submit-button").click();
    const taskInDashboard = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", {
        name: new RegExp(taskName, "i"),
      });
    await taskInDashboard.scrollIntoViewIfNeeded();
    await expect(taskInDashboard).toBeVisible();
  }

  markTaskAsCompletedAndVerify = async ({ taskName }: { taskName: string }) => {
    await this.page.getByTestId("tasks-pending-table").getByRole("row", { name: taskName }).getByRole("checkbox").click()

    const completedTasksInDashboard = this.page.getByTestId("tasks-completed-table").getByRole("row", { name: taskName })
    await completedTasksInDashboard.scrollIntoViewIfNeeded()
    await expect(completedTasksInDashboard).toBeVisible()
  }

  starTaskAndVerify = async ({ taskName }: { taskName: string }) => {
    const starIcon = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName })
      .getByTestId("pending-task-star-or-unstar-link")

    await starIcon.click()
    await expect(starIcon).toHaveClass(/ri-star-fill/i)
    await expect(
      this.page.getByTestId("tasks-pending-table").getByRole("row").nth(1)
    ).toContainText(taskName)
  }
}
