import { test, expect } from "@playwright/test";

test("User gets error on incorrect login", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");

  await page.fill("#email", "wronguser@example.com");
  await page.fill("#password", "WrongPassword!");

  await page.click('button[type="submit"]');

  await expect(page.locator(".error-message")).toBeVisible();
  await expect(page.locator(".error-message")).toContainText(
    "Invalid credentials",
  );
});
