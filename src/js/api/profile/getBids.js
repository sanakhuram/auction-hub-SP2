import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Fetches all bids placed by the user, ensuring listings are included.
 * @param {string} username - The profile username.
 * @returns {Promise<Array>} - The user's bid history.
 */

export async function fetchUserBids(username) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication error. Please log in again.");
  }

  const apiUrl = `${API_AUCTION_PROFILES}/${username}/bids?_listings=true&_bids=true`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers(false, token),
    });

    if (!response.ok) {
      throw new Error(`Error fetching bids: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data); // Debugging

    const bids = data.data || [];

    return bids.map((bid) => {
      if (!bid.listing) return bid; // Ensure listing exists

      const auctionEnded = bid.listing.endsAt
        ? new Date(bid.listing.endsAt) < new Date()
        : false;

      // ✅ Fix: Extract highest bid from all available bids in `data`
      const allBids = bids.filter((b) => b.listing?.id === bid.listing.id);
      const sortedBids = allBids.sort((a, b) => b.amount - a.amount);
      const highestBid = sortedBids.length
        ? parseFloat(sortedBids[0].amount)
        : 0;
      const highestBidder = sortedBids.length
        ? (sortedBids[0].bidder?.name || "").toLowerCase()
        : "";

      console.log(`
        📌 Listing: ${bid.listing.title}
        💰 Your Bid: ${bid.amount}
        🏆 Highest Bid: ${highestBid}
        👤 Highest Bidder: ${highestBidder}
      `); // Debugging

      const loggedInUser = username.toLowerCase();
      const userWon = auctionEnded && highestBidder === loggedInUser;
      const isWinning = !auctionEnded && highestBidder === loggedInUser;

      return {
        ...bid,
        auctionEnded,
        highestBid,
        highestBidder,
        userWon,
        isWinning,
      };
    });
  } catch (error) {
    console.error("❌ Error fetching user bids:", error);
    return [];
  }
}
