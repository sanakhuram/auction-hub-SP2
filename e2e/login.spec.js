import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";
const VALID_EMAIL = "testuser666@stud.noroff.no";
const VALID_PASSWORD = "test@User1234";

test.describe("Login Page", () => {
  test("should load the login page", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login/`);
    await expect(page).toHaveTitle(/Login | Auction Hub/);
    await expect(page.locator('form[name="login"]')).toBeVisible();
  });

  test("should allow user to log in with valid credentials", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/auth/login/`);

    await page.fill('input[name="email"]', VALID_EMAIL);
    await page.fill('input[name="password"]', VALID_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => localStorage.getItem("token") !== null, {
      timeout: 3000,
    });

    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).not.toBeNull();
  });

  test("should allow user to log out", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login/`);
    await page.fill('input[name="email"]', VALID_EMAIL);
    await page.fill('input[name="password"]', VALID_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => localStorage.getItem("token") !== null, {
      timeout: 3000,
    });

    await page.click("#logoutBtn");

    await page.waitForFunction(() => !localStorage.getItem("token"));
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });
});
