import { displayListings } from "../../ui/listing/display.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("📌 DOM Loaded - Calling displayListings()...");
  try {
    await displayListings();
  } catch (error) {
    console.error("❌ Error loading listings:", error);
  }
});
