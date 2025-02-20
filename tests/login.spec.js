import { test, expect } from "@playwright/test";

test("User can log in successfully", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");

  await page.fill("#email", "testuser@example.com");
  await page.fill("#password", "TestPassword123!");

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/profile/);
});
