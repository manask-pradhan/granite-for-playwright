import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { COMMON_TEXTS, DASHBOARD_TEXTS } from "../constants/texts";
import { TASK_TABLE_SELECTORS } from "../constants/selectors";
import { createNewUserContext, loginAsStandardUser } from "../utils";

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

    const newUser = await createNewUserContext(browser)

    await test.step("Step 5: Login as standard user", () =>
      loginAsStandardUser(newUser.page, newUser.loginPage)
    )

    await test.step("Step 6: Assert assigned task to visible to standard user", () =>
      expect(
        newUser.page.getByTestId(TASK_TABLE_SELECTORS.pendingTasksTable).getByRole("row", { name: taskName })
      ).toBeVisible()
    )

    // Close the context and page
    await newUser.page.close()
    await newUser.context.close()
  })

  test.describe(`task comment feature ${COMMON_TEXTS.skipSetup}`, () => {
    test.describe.configure({ mode: "serial" })
    let comment: string

    test.beforeEach(async ({ page, taskPage, taskDetailsPage }) => {
      comment = faker.word.words({ count: 10 })

      await test.step("Step 1: Go to dashboard", () => page.goto("/"))
      await test.step("Step 2: Create task for standard user and verify", () =>
        taskPage.createTaskAndVerify({ taskName, userName: COMMON_TEXTS.standardUserName })
      )
      await test.step("Step 3: Open task details page", () => taskPage.openTaskDetailsPage({ taskName }))
      await test.step("Step 4: Create comment and verify", () => taskDetailsPage.createCommentAndVerify({ comment }))
    })

    test(`should add a new comment as a creator of the task ${COMMON_TEXTS.skipSetup}`, async ({ page, browser, taskPage }) => {
      await test.step("Step 1: Go to dashboard", () => page.goto("/"))
      await test.step("Step 2: Verify initial comment count", () =>
        taskPage.verifyCommentCount({ taskName, commentCount: 1 })
      )

      const assigneeUser = await createNewUserContext(browser)

      await test.step("Step 3: Login as standard user", () =>
        loginAsStandardUser(assigneeUser.page, assigneeUser.loginPage)
      )

      await test.step("Step 4: Open task details page", () => assigneeUser.taskPage.openTaskDetailsPage({ taskName }))
      comment = faker.word.words({ count: 10 })
      await test.step("Step 5: Create comment and verify", () => assigneeUser.taskDetailsPage.createCommentAndVerify({ comment }))
      await test.step("Step 6: Go to dashboard", () => assigneeUser.page.goto("/"))
      await test.step("Step 7: Verify comment count increased", () => assigneeUser.taskPage.verifyCommentCount({ taskName, commentCount: 2 }))

      await assigneeUser.page.close()
      await assigneeUser.context.close()
    })

    test(`should be able to add a new comment as a assignee of the task ${COMMON_TEXTS.skipSetup}`, async ({ page, browser, taskPage, taskDetailsPage }) => {
      const assigneeUser = await createNewUserContext(browser)

      await test.step("Step 1: Login as standard user", () =>
        loginAsStandardUser(assigneeUser.page, assigneeUser.loginPage)
      )

      await test.step("Step 2: Go to dashboard", () => assigneeUser.page.goto("/"))
      await test.step("Step 3: Verify initial comment count", () => assigneeUser.taskPage.verifyCommentCount({ taskName, commentCount: 1 }))
      await test.step("Step 4: Open task details page", () => assigneeUser.taskPage.openTaskDetailsPage({ taskName }))

      comment = faker.word.words({ count: 10 })
      await test.step("Step 5: Create comment and verify", () => assigneeUser.taskDetailsPage.createCommentAndVerify({ comment }))

      await assigneeUser.page.close()
      await assigneeUser.context.close()

      await test.step("Step 6: Go to dashboard as creator", () => page.goto("/"))
      await test.step("Step 7: Verify comment count increased", () => taskPage.verifyCommentCount({ taskName, commentCount: 2 }))
      await test.step("Step 8: Open task details page as creator", () => taskPage.openTaskDetailsPage({ taskName }))
      await test.step("Step 9: Verify comment is visible to creator", () =>
        expect(taskDetailsPage.page.getByTestId("task-comment").filter({ hasText: comment })).toBeVisible()
      )
    })
  })
});
