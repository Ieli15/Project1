const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
const cryptoList = document.getElementById("cryptoList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toggleMode = document.getElementById("toggleMode");

// Fetch Data from API
async function fetchCryptos() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayCryptos(data);
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
  }
}

// Display Cryptocurrencies
function displayCryptos(data) {
  cryptoList.innerHTML = ""; // Clear list

  data.forEach((crypto) => {
    const { name, symbol, current_price, market_cap, price_change_percentage_24h } = crypto;

    const card = document.createElement("div");
    card.className = "crypto-card";

    card.innerHTML = `
      <h2>${name} (${symbol.toUpperCase()})</h2>
      <p>Price: $${current_price.toLocaleString()}</p>
      <p>Market Cap: $${market_cap.toLocaleString()}</p>
      <p class="${price_change_percentage_24h >= 0 ? "positive" : "negative"}">
        24h Change: ${price_change_percentage_24h.toFixed(2)}%
      </p>
    `;

    cryptoList.appendChild(card);
  });
}

// Filter Cryptocurrencies by Search
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const response = await fetch(API_URL);
  const data = await response.json();
  const filtered = data.filter((crypto) => 
    crypto.name.toLowerCase().includes(searchTerm) || crypto.symbol.toLowerCase().includes(searchTerm)
  );
  displayCryptos(filtered);
});

// Sort Cryptocurrencies
sortSelect.addEventListener("change", async (e) => {
  const sortBy = e.target.value;
  const response = await fetch(API_URL);
  const data = await response.json();
  const sorted = [...data].sort((a, b) => 
    sortBy === "price" ? b.current_price - a.current_price : b.market_cap - a.market_cap
  );
  displayCryptos(sorted);
});

// Toggle Dark/Light Mode
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// Initialize App
fetchCryptos();
