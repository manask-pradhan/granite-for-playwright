import { test } from "@playwright/test"

/*
To declare a skipped test:

test.skip(title, body)
test.skip(title, details, body)

To skip a test at runtime:

test.skip(condition, description)
test.skip(callback, description)
test.skip()
*/

test.skip("Skipped test", async ({ page }) => {
  // Skip this test
})

// with description(Recommended)
test("Skipped test on Safari", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "This test is skipped on Safari")
})

// condition based
test.skip(({ browserName }) => browserName === "webkit")

// Similarly for the below annotations, where it can take label, optional description and the predicate logic (if true, then it will run)

test.skip()
test.fail()
test.fixme()
test.slow()

/*
1. test.skip() - Want to skip this test, when the test is irrelevant
2. test.fail() - marks as test is failing, Playwright will throw complain if it does not fail
3. test.fixme() - marks as test is failing, will be immediately aborted, but intention to fix it
4. test.slow() - marks as test the slow, and triples the test timeout.
*/

test.only("Only this test will be run from set of tests", ({ page }) => {
  // Useful when we want to run a single test or a group of tests - focus on this test
})

test("Step annotations", async ({ page }) => {
  test.step("First step", async () => {
    // Group related things
  })

  test.step("Second step", async () => {
    // Group related things
  })
})
