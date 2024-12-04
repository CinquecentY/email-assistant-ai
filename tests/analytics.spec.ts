import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fanalytics",
  );
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("michael.brown@company.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Password", { exact: true }).click();
  await page
    .getByLabel("Password", { exact: true })
    .fill("^+\"74;(j{RH('d5{W}u)");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("tab")).toContainText("Analytics");
  await page.getByLabel("Select account").click();
  await page.getByText("yassine.annagrebah@gmail.com").click();
  await expect(page.getByTestId("inbox-count")).toBeVisible();
  await expect(page.getByTestId("sent-count")).toBeVisible();
  await expect(page.getByTestId("drafts-count")).toBeVisible();
  await expect(page.getByTestId("emails-chart")).toBeVisible();
  await expect(page.getByTestId("emails-pie")).toBeVisible();
  await expect(page.getByTestId("events-data-table")).toBeVisible();
  await expect(page.getByTestId("clients-data-table")).toBeVisible();
});
