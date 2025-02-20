import { test, expect } from "@playwright/test";

test("User can register successfully", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/register");

  await page.fill("#name", "testuser123");
  await page.fill("#email", "testuser@example.com");
  await page.fill("#password", "TestPassword123!");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/profile/);
});
