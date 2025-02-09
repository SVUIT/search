const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;
const APPWRITE_ID = process.env.APPWRITE_ID;

const client = new Appwrite.Client();
client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const databases = new Appwrite.Databases(client);

async function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const term = searchInput.value.trim();

  if (!term) {
    displayResults([]);
    return;
  }

  try {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?queries[0]=search("name", "${term}")`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': APPWRITE_ID,
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
