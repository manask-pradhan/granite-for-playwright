import { test } from "@playwright/test";

interface SampleFixture {
  customValue: string;
}

const sampleFixture = test.extend<SampleFixture>({
  customValue: async ({ }, use) => {
    /* Setup starts */
    console.log("Setting up customValue fixture");
    /* Setup ends */

    await use("This is the value of the customValue fixture"); // Usage

    /* Teardown starts */
    console.log("Tearing down customValue fixture");
    /* Teardown ends */
  },
});

sampleFixture("should use customValue fixture", async ({ customValue }) => {
  console.log("Test begins");
  console.log(customValue);
  console.log("Test ends");
});
