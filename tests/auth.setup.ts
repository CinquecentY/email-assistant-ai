import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join("../playwright/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("http://localhost:3000/mail");
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("michael.brown@company.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Password", { exact: true }).click();
  await page
    .getByLabel("Password", { exact: true })
    .fill("^+\"74;(j{RH('d5{W}u)");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
