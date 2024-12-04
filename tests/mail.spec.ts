import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fmail",
  );
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill("michael.brown@company.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Password", { exact: true }).click();
  await page
    .getByLabel("Password", { exact: true })
    .fill("^+\"74;(j{RH('d5{W}u)");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByTestId("tab")).toContainText("Inbox")
  await page.getByLabel("Select account").click();
  await page.getByLabel("yassine.annagrebah@gmail.com").click();
  await expect(page.getByTestId("show-thread-button").first()).toBeVisible();
  await page
    .getByTestId("show-thread-button").first()
    .click();
  await expect(
    page.getByTestId("thread")).toBeVisible();
    const threadSubject = await page.getByTestId("thread-subject").textContent();
  await page
  .getByTestId("show-thread-button").nth(2)
    .click();
    await expect(
      page.getByTestId("thread")).toBeVisible();
  await expect(page.getByTestId("thread-subject")).not.toHaveText(threadSubject??"");
});
