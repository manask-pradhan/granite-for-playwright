import { expect, Page } from "@playwright/test";

interface Comment {
  comment: string
}

export default class TaskDetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  createCommentAndVerify = async ({ comment }: Comment) => {
    await this.page.getByTestId("comments-text-field").fill(comment)
    await this.page.getByTestId("comments-submit-button").click()

    const newComment = this.page.getByTestId("task-comment").filter({ hasText: comment })

    await expect(newComment).toBeVisible()
  }
}
