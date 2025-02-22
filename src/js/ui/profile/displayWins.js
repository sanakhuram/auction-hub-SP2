import { fetchProfile } from "../../api/profile/read.js";

/**
 * Fetches and displays the user's wins in a grid layout (without slider functionality).
 */
async function displayUserWins() {
  const winsContainer = document.getElementById("myWinsSlider");
  if (!winsContainer) return;

  winsContainer.innerHTML = `<p class="text-purple-600 font-semibold text-lg">Loading wins...</p>`;

  try {
    const username = localStorage.getItem("username");
    if (!username) {
      winsContainer.innerHTML = `<p class="text-red-500 text-center">You need to log in to view your wins.</p>`;
      return;
    }

    const profileData = await fetchProfile(username);
    const wins = profileData?.wins || [];

    if (!Array.isArray(wins) || wins.length === 0) {
      winsContainer.innerHTML = `<p class="text-gray-500 text-center">You have not won any auctions yet.</p>`;
      return;
    }
    winsContainer.innerHTML = `
      <div class="max-w-[1200px] mx-auto">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          ${wins
            .map((win) => {
              const imageUrl = win.media?.[0]?.url || "/images/placeholder.jpg";
              return `
                <div class="relative p-4 border rounded-lg shadow-md bg-olive text-white mb-5">
                  <span class="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded opacity-80 text-xs">🏆 Won</span>
                  <a href="/listing/?id=${win.id}" class="block">
                    <img src="${imageUrl}"
                      alt="${win.title || "Auction Item"}"
                      class="w-full h-40 object-cover rounded-md cursor-pointer transition-transform hover:scale-105" />
                  </a>
                  <h3 class="text-lg mt-2">${win.title || "No Title"}</h3>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  } catch (error) {
    winsContainer.innerHTML = `<p class="text-red-500 text-center">Error loading your wins.</p>`;
    console.error("Error fetching user wins:", error);
  }
}

document.addEventListener("DOMContentLoaded", displayUserWins);

export { displayUserWins };
