import { test, expect } from "@playwright/test";

test("mail user flow", async ({ page }) => {
  // User go to "/mail"
  await page.goto("/mail");
  // User should be redirected to /mail
  await expect(page).toHaveURL("/mail");
  // User should have the tab contain Mail
  await expect(page.getByTestId("tab")).toContainText("Mail");
  // User switch account
  await page.getByTestId("account-switch").click();
  await page.getByTestId("account-item").first().click();
  // User should have the list of show-thread-button visible
  await expect(page.getByTestId("show-thread-button").first()).toBeVisible();
  // User click on the first show-thread-button
  await page.getByTestId("show-thread-button").first().click();
  // User should have the thread visible
  await expect(page.getByTestId("thread")).toBeVisible();
  // store subject title
  const threadSubject = await page.getByTestId("thread-subject").textContent();
  // User switch thread
  await page.getByTestId("show-thread-button").nth(2).click();
  // User should have the thread visible and be different than previous thread
  await expect(page.getByTestId("thread")).toBeVisible();
  await expect(page.getByTestId("thread-subject")).not.toHaveText(
    threadSubject ?? "",
  );
});
