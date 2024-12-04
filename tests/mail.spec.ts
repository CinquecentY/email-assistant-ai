import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/mail");
  await expect(page.getByTestId("tab")).toContainText("Inbox");
  await page.getByTestId("account-switch").click();
  await page.getByTestId("account-item").first().click();
  await expect(page.getByTestId("show-thread-button").first()).toBeVisible();
  await page.getByTestId("show-thread-button").first().click();
  await expect(page.getByTestId("thread")).toBeVisible();
  const threadSubject = await page.getByTestId("thread-subject").textContent();
  await page.getByTestId("show-thread-button").nth(2).click();
  await expect(page.getByTestId("thread")).toBeVisible();
  await expect(page.getByTestId("thread-subject")).not.toHaveText(
    threadSubject ?? "",
  );
});
