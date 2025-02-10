import { API_AUCTION_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";
import { getToken } from "../../token.js";

export async function updateListing(id, data) {
  const token = getToken();
  if (!token) {
    alert("Authentication token is missing.");
    return null;
  }

  try {
    const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}
