// todo.ts

import type { Page, Locator } from "@playwright/test";

export class TodoPage {
  readonly page: Page;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoItems = this.page.getByTestId("todo-item");
  }

  goto = async () => {
    await this.page.goto("https://demo/todo-page");
  };

  addTodo = async (todoName: string) => {
    await this.page.getByPlaceholder("Enter todo").fill(todoName);
    await this.page.getByRole("button", { name: "Submit" }).click();
  };

  removeAll = async () => {
    while ((await this.todoItems.count()) > 0) {
      await this.todoItems.first().hover();
      await this.todoItems.getByLabel("Delete").first().click();
    }
  };
}
