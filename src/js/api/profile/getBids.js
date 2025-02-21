import { API_AUCTION_PROFILES } from "../constants.js";
import { headers } from "../headers.js";
import { getAuthToken } from "../utils.js";

/**
 * Fetches all bids placed by a user, ensuring associated listings and bids are included.
 *
 * @async
 * @function fetchUserBids
 * @param {string} username - The profile username.
 * @returns {Promise<Array>} - A promise that resolves to an array of the user's bid history.
 * Each bid includes details such as whether the auction has ended, the highest bid,
 * the highest bidder, and whether the user is currently winning.
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

    /**
     * Maps and processes each bid to include auction status and highest bid information.
     */
    return bids.map((bid) => {
      if (!bid.listing) return bid;

      /**
       * Determines if the auction has ended.
       * @type {boolean}
       */
      const auctionEnded = bid.listing.endsAt
        ? new Date(bid.listing.endsAt) < new Date()
        : false;

      /**
       * Filters all bids related to the same listing and sorts them to find the highest bid.
       * @type {Array}
       */
      const allBids = bids.filter((b) => b.listing?.id === bid.listing.id);
      const sortedBids = allBids.sort((a, b) => b.amount - a.amount);

      /**
       * Extracts the highest bid amount from the sorted bids.
       * @type {number}
       */
      const highestBid = sortedBids.length
        ? parseFloat(sortedBids[0].amount)
        : 0;

      /**
       * Extracts the highest bidder's name (converted to lowercase for consistency).
       * @type {string}
       */
      const highestBidder = sortedBids.length
        ? (sortedBids[0].bidder?.name || "").toLowerCase()
        : "";

      /**
       * Determines if the logged-in user is the highest bidder.
       * @type {boolean}
       */
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
