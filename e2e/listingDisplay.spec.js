import { test, expect } from "@playwright/test";

test.describe("Listing Display Test", () => {
  test("should load and display auction listings", async ({ page }) => {
   
    await page.goto("http://localhost:5173/");

    await page.waitForSelector("#loader", { state: "hidden" });

    
    const listingsContainer = await page.locator("#listings-container");
    await expect(listingsContainer).toBeVisible();

   
    const listings = await page.locator(".listing-item");
    await expect(listings).not.toHaveCount(0); 

    const firstListingTitle = await listings.first().locator("h3");
    await expect(firstListingTitle).toBeVisible();
    await expect(firstListingTitle).not.toBeEmpty();

    const firstListingBid = await listings
      .first()
      .locator("p:text('Current Bid')");
    await expect(firstListingBid).toBeVisible();

    console.log("✅ Listings are displayed correctly!");
  });
});
