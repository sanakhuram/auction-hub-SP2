import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Fetches all bids placed by a user, ensuring associated listings and bid details are included.
 *
 * @async
 * @function fetchUserBids
 * @param {string} username - The profile username.
 * @returns {Promise<Array>} - A promise that resolves to an array of bid objects, each containing:
 * - `auctionEnded` (boolean): Whether the auction has ended.
 * - `highestBid` (number): The highest bid placed on the listing.
 * - `highestBidder` (string): The username of the highest bidder.
 * - `userWon` (boolean): Whether the logged-in user won the auction.
 * - `isWinning` (boolean): Whether the logged-in user is currently the highest bidder.
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
    const bids = data.data || [];

    return bids.map((bid) => {
      if (!bid.listing) return bid;

      const auctionEnded = bid.listing.endsAt
        ? new Date(bid.listing.endsAt) < new Date()
        : false;

      const allBids = bids.filter((b) => b.listing?.id === bid.listing.id);
      const sortedBids = allBids.sort((a, b) => b.amount - a.amount);

      const highestBid = sortedBids.length
        ? parseFloat(sortedBids[0].amount)
        : 0;

      const highestBidder = sortedBids.length
        ? (sortedBids[0].bidder?.name || "").toLowerCase()
        : "";

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
    console.error("Error fetching user bids:", error);
    return [];
  }
}
