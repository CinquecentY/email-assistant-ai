import { test, expect } from "@playwright/test";

test.describe("template user flow", () => {
  test("test", async ({ page }) => {
    // User go to /templates
    await page.goto("/templates");
    // User should have the tab contain Analytics
    await expect(page.getByTestId("tab")).toContainText("Mail Templates");

    // User click on New Template
    await page.getByTestId("new-template-button").click();
    // User should see the new-template-drawer visible
    await expect(page.getByTestId("new-template-drawer")).toBeVisible();
    // User should see the template editor inside the template drawer
    await expect(page.getByTestId("template-editor")).toBeVisible();
    // User fill the fields
    await page.getByPlaceholder("Name").fill("Template Test 1");
    await page.locator(".tiptap").fill("Template Test 1 Text");
    // User click on Save
    await page.getByTestId("template-editor-save-button").click();
    // User should see the template in the list
    await expect(page.getByTestId("template-item")).toContainText(
      "Template Test 1",
    );

    // User click on the template
    await page.getByTestId("template-item").click();
    // User should see the template display
    await expect(page.getByTestId("template-display")).toBeVisible();
    // User fill the fields
    await page.getByPlaceholder("Name").fill("Template Test 1 Edited");
    await page.locator(".tiptap").fill("Template Test 1 Text Edited");
    // User click on Save
    await page.getByTestId("template-editor-save-button").click();
    await expect(page.getByTestId("template-item")).toContainText(
      "Template Test 1 Edited",
    );
    // User delete the template
    await page.getByTestId("delete-template-button").click();
    // User should see the delete template dialog
    await expect(page.getByTestId("delete-template-dialog")).toBeVisible();
    // User click on Delete
    await page.getByTestId("delete-template-button-confirm").click();
    // User should not see the template in the list
    await expect(page.getByTestId("template-item")).not.toBeVisible();
  });
});
