// API Endpoint
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

// DOM Elements
const cryptoList = document.getElementById("cryptoList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toggleMode = document.getElementById("toggleMode");

// Fetch Cryptocurrency Data
async function fetchCryptos() {
  try {
    const response = await fetch(API_URL); // Fetch the data
    const data = await response.json(); // Parse the JSON response
    displayCryptos(data); // Render the data
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error); // Handle errors
  }
}

// Render Cryptocurrencies in List Form
function displayCryptos(data) {
  cryptoList.innerHTML = ""; // Clear the existing content

  // Create a <ul> element to hold the list
  const ul = document.createElement("ul");
  ul.className = "crypto-list";

  data.forEach((crypto) => {
    const { name, symbol, current_price, market_cap, price_change_percentage_24h } = crypto;

    // Create a single list item (<li>)
    const li = document.createElement("li");
    li.className = "crypto-item";

    // Add content for the cryptocurrency
    li.innerHTML = `
      <strong>${name} (${symbol.toUpperCase()})</strong><br>
      Price: $${current_price.toLocaleString()}<br>
      Market Cap: $${market_cap.toLocaleString()}<br>
      24h Change: 
      <span class="${price_change_percentage_24h >= 0 ? "positive" : "negative"}">
        ${price_change_percentage_24h.toFixed(2)}%
      </span>
    `;

    ul.appendChild(li); // Append the list item to the <ul>
  });

  cryptoList.appendChild(ul); // Append the list to the container
}

// Search Cryptocurrencies
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const response = await fetch(API_URL);
  const data = await response.json();
  const filtered = data.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm) || 
    crypto.symbol.toLowerCase().includes(searchTerm)
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
  // Toggle the 'light-mode' class on the body
  document.body.classList.toggle("light-mode");

  // Toggle the button text based on the mode
  if (document.body.classList.contains("light-mode")) {
    toggleMode.textContent = "Dark Mode";
  } else {
    toggleMode.textContent = "Light Mode";
  }
});

// Initialize the App
fetchCryptos();
