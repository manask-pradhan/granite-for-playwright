import test, { Page, BrowserContext, Browser } from "@playwright/test"
import LoginPage from "../poms/login"
import TaskDetailsPage from "../poms/taskDetails"
import TaskPage from "../poms/tasks"
import { COMMON_TEXTS } from "../constants/texts"

export interface NewUserContext {
  page: Page
  context: BrowserContext
  loginPage: LoginPage
  taskPage: TaskPage
  taskDetailsPage: TaskDetailsPage
}

export const createNewUserContext = async (browser: Browser): Promise<NewUserContext> => {
  const context = await browser.newContext({
    storageState: { cookies: [], origins: [] }
  })
  const page = await context.newPage()

  const loginPage = new LoginPage(page)
  const taskPage = new TaskPage(page)
  const taskDetailsPage = new TaskDetailsPage(page)

  return { context, page, loginPage, taskPage, taskDetailsPage }
}

export const loginAsStandardUser = async (page: Page, loginPage: LoginPage): Promise<void> => {
  await page.goto("/")
  await loginPage.loginAndVerifyUser({
    username: COMMON_TEXTS.standardUserName,
    email: process.env.STANDARD_EMAIL!,
    password: process.env.STANDARD_PASSWORD!
  })
}
