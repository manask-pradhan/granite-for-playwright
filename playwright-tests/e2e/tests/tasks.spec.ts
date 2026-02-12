import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import TaskPage from "../poms/tasks";
import TaskDetailsPage from "../poms/taskDetails";

test.describe("Tasks page", () => {
  let taskName: string;

  test.beforeEach(async ({ page, taskPage }, testInfo) => {
    taskName = faker.word.words({ count: 5 });

    if (testInfo.title.includes("[SKIP_SETUP]")) return

    await page.goto("/");
    await taskPage.createTaskAndVerify({ taskName })
  });

  test.afterEach(async ({ page, taskPage }) => {
    await page.goto("/")
    await taskPage.markTaskAsCompletedAndVerify({ taskName })

    const completedTaskInDasboard = page.getByTestId("tasks-completed-table").getByRole("row", { name: taskName })
    await completedTaskInDasboard.getByTestId("completed-task-delete-link").click()

    await expect(completedTaskInDasboard).toBeHidden()
    await expect(page.getByTestId("tasks-pending-table").getByRole("row", { name: taskName })).toBeHidden()
  })

  test("should be able to mark as completed", async ({ taskPage }) => {
    await taskPage.markTaskAsCompletedAndVerify({ taskName })
  })

  test.describe("starring task feature", () => {
    test.describe.configure({ mode: "serial" })

    test("should be able to star a pending task", async ({ taskPage }) => {
      await taskPage.starTaskAndVerify({ taskName })
    })

    test("should be able to un-star a pending task", async ({ page, taskPage }) => {
      await taskPage.starTaskAndVerify({ taskName })

      const starIcon = page
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })
        .getByTestId("pending-task-star-or-unstar-link")

      await starIcon.click()
      await expect(starIcon).toHaveClass(/ri-star-line/i)
    })
  })

  test("should create a new task with different user as the assignee [SKIP_SETUP]", async ({ page, browser, taskPage }) => {
    await page.goto("/")
    await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" }) // This is assigned to a different user

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

  test.describe("task comment feature [SKIP_SETUP]", () => {
    test.describe.configure({ mode: "serial" })
    let comment: string

    test.beforeEach(async ({ page, taskPage, taskDetailsPage }) => {
      comment = faker.word.words({ count: 10 })
      await page.goto("/")
      await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" })
      await taskPage.openTaskDetailsPage({ taskName })
      await taskDetailsPage.createCommentAndVerify({ comment })
    })

    test("should add a new comment as a creator of the task [SKIP_SETUP]", async ({ page, browser, taskPage }) => {
      await page.goto("/")
      await taskPage.verifyCommentCount({ taskName, commentCount: 1 })

      const assigneeUserContext = await browser.newContext({
        storageState: { cookies: [], origins: [] }
      })
      const assigneeUserPage = await assigneeUserContext.newPage()
      const loginPage = new LoginPage(assigneeUserPage)
      const assigneeUserTaskPage = new TaskPage(assigneeUserPage)
      const assigneeUserTaskDetailsPage = new TaskDetailsPage(assigneeUserPage)

      await assigneeUserPage.goto("/")
      await loginPage.loginAndVerifyUser({
        username: "Sam Smith",
        email: "sam@example.com",
        password: "welcome"
      })
      await assigneeUserTaskPage.openTaskDetailsPage({ taskName })
      comment = faker.word.words({ count: 10 })
      await assigneeUserTaskDetailsPage.createCommentAndVerify({ comment })

      await assigneeUserPage.goto("/")
      await assigneeUserTaskPage.verifyCommentCount({ taskName, commentCount: 2 })

      await assigneeUserPage.close();
      await assigneeUserContext.close();
    })

    test("should be able to add a new comment as a assignee of the task [SKIP_SETUP]", async ({ page, browser, taskPage, taskDetailsPage }) => {
      const assigneeUserContext = await browser.newContext({
        storageState: { cookies: [], origins: [] }
      })
      const assigneeUserPage = await assigneeUserContext.newPage()
      await assigneeUserPage.goto("/")
      const assigneeLoginPage = new LoginPage(assigneeUserPage)
      const assigneeUserTaskPage = new TaskPage(assigneeUserPage)
      const assigneeUserTaskDetailsPage = new TaskDetailsPage(assigneeUserPage)

      await assigneeLoginPage.loginAndVerifyUser({
        username: "Sam Smith",
        email: "sam@example.com",
        password: "welcome"
      })

      await assigneeUserPage.goto("/")
      await assigneeUserTaskPage.verifyCommentCount({ taskName, commentCount: 1 })
      await assigneeUserTaskPage.openTaskDetailsPage({ taskName })
      comment = faker.word.words({ count: 10 })
      await assigneeUserTaskDetailsPage.createCommentAndVerify({ comment })

      await page.goto("/")
      await taskPage.verifyCommentCount({ taskName, commentCount: 2 })
      await taskPage.openTaskDetailsPage({ taskName })
      await expect(taskDetailsPage.page.getByTestId("task-comment").filter({ hasText: comment })).toBeVisible()

      await assigneeUserPage.close();
      await assigneeUserContext.close();
    })
  })
});
