import { test as base } from '@playwright/test'
import { TodoPage } from './todo'

type Poms = { todoPage: TodoPage }

export const test = base.extend<Poms>({
  todoPage: async ({ page }, use) => {
    // Setup the fixtures
    const todoPage = new TodoPage(page)
    await todoPage.goto();
    await todoPage.addTodo("Item 1")

    // Use the fixture value in the test
    await use(todoPage)

    // Cleanup the fixtures
    await todoPage.removeAll()
  }
})

test("should manage todos", async ({ todoPage }) => {
  await todoPage.addTodo("Item 2");
});
