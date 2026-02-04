import { test } from "@playwright/test"
import * as fs from "fs";
import { STORAGE_STATE } from "../../playwright.config"

test("Teardown", () => {
  fs.unlink(STORAGE_STATE, (error) => {
    if (!error) return;
    console.log(error)
  })
})
