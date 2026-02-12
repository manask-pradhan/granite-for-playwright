import { test, expect } from '@playwright/test';

test.describe('Notes on hooks', () => {

  test.beforeAll(async () => {
    // Global setup
    // Example: prepare test data, API calls, auth setup
  });

  test.beforeEach(async ({ page }) => {
    // Runs before every test
    // Example: login
    // await page.goto('/login');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Runs after every test
    // Example: take screenshot on failure
    // if (testInfo.status !== testInfo.expectedStatus) {
    //   await page.screenshot({ path: `failed-${testInfo.title}.png` });
    // }
  });

  test.afterAll(async () => {
    // Global teardown
    // Example: cleanup test data
  });

  test('First test', async ({ page }) => {
    // Test 1
  });

  test('Second test', async ({ page }) => {
    // Test 2
  });

});
