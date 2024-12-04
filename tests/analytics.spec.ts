import { test, expect } from "@playwright/test";

// Use prepared Clerk auth state
test.use({ storageState: "playwright/.clerk/user.json" });

test.describe("analytics user flow", () => {
  test("user test", async ({ page }) => {
    // User go to "/analytics"
    await page.goto("/analytics");
    // User should be redirected to /analytics
    await expect(page).toHaveURL("/analytics");
    // User should have the tab contain Analytics
    await expect(page.getByTestId("tab")).toContainText("Analytics");
    // User should have all the data visible without errors
    await expect(page.getByTestId("events-data-table")).not.toContainText("Error")
    await expect(page.getByTestId("clients-data-table")).not.toContainText("Error")
    // User switch account
    await page.getByTestId("account-switch").click();
    await page.getByTestId("account-item").first().click();
    // User should have all the email analytics appear
    await expect(page.getByTestId("inbox-count")).toBeVisible();
    await expect(page.getByTestId("sent-count")).toBeVisible();
    await expect(page.getByTestId("drafts-count")).toBeVisible();
    await expect(page.getByTestId("emails-chart")).toBeVisible();
    await expect(page.getByTestId("emails-pie")).toBeVisible();
  });
});
