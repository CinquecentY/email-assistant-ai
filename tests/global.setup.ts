import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Define the path to the storage file, which is `user.json`
const authFile = path.join(dirname(fileURLToPath(import.meta.url)), '../playwright/.clerk/user.json');

setup("authenticate and save state to storage", async ({ page }) => {
  // Configure Playwright with Clerk
  await clerkSetup();

  // Perform authentication steps.
  // This example uses a Clerk helper to authenticate
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });
  await page.goto("/mail");
  // Ensure the user has successfully accessed the protected page
  // by checking an element on the page that only the authenticated user can access
  await page.waitForSelector("h1:has-text('Inbox')");

  await page.context().storageState({ path: authFile });
});
