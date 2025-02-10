import { Client, Databases } from "https://esm.sh/appwrite";
require('dotenv').config();
const client = new Client();
client
  .setEndpoint(process.env.VITE_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

async function performSearch() {
  const searchInput = document.getElementById("searchInput");
  const term = searchInput.value.trim();

  if (!term) {
    displayResults([]);
    return;
  }

  try {
    const url = `${import.meta.env.VITE_ENDPOINT}/databases/${import.meta.env.VITE_DATABASE_ID}/collections/${import.meta.env.VITE_COLLECTION_ID}/documents?queries[0]=search("name", "${term}")`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": import.meta.env.VITE_PROJECT_ID,
        "X-Appwrite-Key": import.meta.env.VITE_APPWRITE_ID,
      },
    });

    if (response.ok) {
      const data = await response.json();
      displayResults(data.documents);
    } else {
      console.error("Error:", response.status);
      displayResults([]);
    }
  } catch (error) {
    console.error(error);
    displayResults([]);
  }
}

function displayResults(documents) {
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = "";

  if (documents.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result-item">Không tìm thấy kết quả</div>';
    return;
  }

  documents.forEach((doc) => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.textContent = doc.name;
    item.addEventListener("click", () => {
      document.getElementById("searchInput").value = doc.name;
      resultsContainer.innerHTML = "";
    });
    resultsContainer.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput").addEventListener("input", performSearch);
});

// Debugging: Log environment variables (remove in production)
console.log("API Endpoint:", import.meta.env.VITE_ENDPOINT);
console.log("Project ID:", import.meta.env.VITE_PROJECT_ID);
