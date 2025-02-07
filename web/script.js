// Import your configuration
import { config } from '../function/config.js';

// Initialize the Appwrite client
const client = new Appwrite.Client();
client
  .setEndpoint(config.endpoint)   // Your Appwrite API Endpoint
  .setProject(config.projectId);    // Your Appwrite Project ID

// Initialize the Databases service
const databases = new Appwrite.Databases(client);

// Function to perform the search
async function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const term = searchInput.value.trim();

  if (!term) {
    displayResults([]);
    return;
  }

  try {
    const url = `${config.endpoint}/databases/${config.databaseId}/collections/${config.collectionId}/documents?queries[0]=search("name", "${term}")`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': config.projectId,
        'X-Appwrite-Key': config.appwriteId,
      }
    });
    if (response.ok) {
      const data = await response.json();
      displayResults(data.documents);
    } else {
      console.error('Lỗi:', response.status);
      displayResults([]);
    }
  } catch (error) {
    console.error(error);
    displayResults([]);
  }
}


function displayResults(documents) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';
  if (documents.length === 0) {
    resultsContainer.innerHTML = '<div class="search-result-item">Không tìm thấy kết quả</div>';
    return;
  }
  documents.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.textContent = doc.name;
    item.addEventListener('click', () => {
      document.getElementById('searchInput').value = doc.name;
      resultsContainer.innerHTML = '';
    });
    resultsContainer.appendChild(item);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('input', performSearch);
});


