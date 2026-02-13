import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import TaskPage from "../poms/tasks";
import TaskDetailsPage from "../poms/taskDetails";
import { COMMON_TEXTS, DASHBOARD_TEXTS } from "../constants/texts";
import { TASK_TABLE_SELECTORS } from "../constants/selectors";

test.describe("Tasks page", () => {
  let taskName: string;

  test.beforeEach(async ({ page, taskPage }, testInfo) => {
    taskName = faker.word.words({ count: 5 });

    if (testInfo.title.includes(COMMON_TEXTS.skipSetup)) return

    await test.step("Step 1: Go to dashboard", () => page.goto("/"))
    await test.step("Step 2: Create new task", () => taskPage.createTaskAndVerify({ taskName }))
  });

  test.afterEach(async ({ page, taskPage }) => {
    const completedTaskInDashboard = page.getByTestId(TASK_TABLE_SELECTORS.completedTasksTable).getByRole("row", { name: taskName })

    await test.step("Go to dashboard", () => page.goto("/"))
    await test.step("Mark task as completed", () =>
      taskPage.markTaskAsCompletedAndVerify({ taskName })
    )

    await test.step("Delete completed task in dashboard", () =>
      completedTaskInDashboard.getByTestId(TASK_TABLE_SELECTORS.deleteTaskButton).click()
    )

    await test.step("Assert deleted task has been removed from the dashboard", async () => {
      await expect(completedTaskInDashboard).toBeHidden()
      await expect(page.getByTestId(TASK_TABLE_SELECTORS.pendingTasksTable).getByRole("row", { name: taskName })).toBeHidden()
    })
  })

  test("should be able to mark as completed", async ({ taskPage }) => {
    await test.step("Step 3: Mark task as completed and verify", () =>
      taskPage.markTaskAsCompletedAndVerify({ taskName })
    )
  })

  test("should be able to un-star a pending task", async ({ page, taskPage }) => {
    await test.step("Step 3: Star a pending task and verify", () =>
      taskPage.starTaskAndVerify({ taskName })
    )

    await test.step("Step 4: Unstar task and verify", async () => {
      const starIcon = page
        .getByTestId(TASK_TABLE_SELECTORS.pendingTasksTable)
        .getByRole("row", { name: taskName })
        .getByTestId(TASK_TABLE_SELECTORS.starUnstarButton)

      await starIcon.click()
      await expect(starIcon).toHaveClass(DASHBOARD_TEXTS.starredTaskClass)
    })
  })

  test(`should create a new task with different user as the assignee ${COMMON_TEXTS.skipSetup}`, async ({ page, browser, taskPage }) => {
    await test.step("Step 3: Go to dashboard", () => page.goto("/"))

    await test.step("Step 4: Create a task for standard user and verify", () =>
      taskPage.createTaskAndVerify({ taskName, userName: COMMON_TEXTS.standardUserName })
    )

    // Create a new browser context and a page in the browser
    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] }
    })
    const newUserPage = await newUserContext.newPage()

    // Initialize the Login POM as the fixture is configured to use the default context

    const loginPage = new LoginPage(newUserPage);

    await test.step("Step 5: Visit login page as standard user", () => newUserPage.goto("/"))

    await test.step("Step 6: Login as standard user", () =>
      loginPage.loginAndVerifyUser({
        username: COMMON_TEXTS.standardUserName,
        email: process.env.STANDARD_EMAIL!,
        password: process.env.STANDARD_PASSWORD!
      })
    )

    await test.step("Step 7: Assert assigned task to visible to standard user", () =>
      expect(
        newUserPage.getByTestId(TASK_TABLE_SELECTORS.pendingTasksTable).getByRole("row", { name: taskName })
      ).toBeVisible()
    )

    // Close the context and page
    await newUserPage.close()
    await newUserContext.close()
  })

  test.describe(`task comment feature ${COMMON_TEXTS.skipSetup}`, () => {
    test.describe.configure({ mode: "serial" })
    let comment: string

    test.beforeEach(async ({ page, taskPage, taskDetailsPage }) => {
      comment = faker.word.words({ count: 10 })
      await page.goto("/")
      await taskPage.createTaskAndVerify({ taskName, userName: COMMON_TEXTS.standardUserName })
      await taskPage.openTaskDetailsPage({ taskName })
      await taskDetailsPage.createCommentAndVerify({ comment })
    })

    test(`should add a new comment as a creator of the task ${COMMON_TEXTS.skipSetup}`, async ({ page, browser, taskPage }) => {
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
