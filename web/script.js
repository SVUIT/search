const ENDPOINT = env.APPWRITE_ENDPOINT;
const PROJECT_ID = env.APPWRITE_PROJECT_ID;
const DATABASE_ID = env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = env.APPWRITE_COLLECTION_ID;
const APPWRITE_ID = env.APPWRITE_ID;

const client = new Appwrite.Client();
client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Appwrite.Databases(client);

async function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const term = searchInput.value.trim();

  if (!term) {
    displayResults([]);
    return;
  }

  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Appwrite.Query.search('name', term)
    ]);
    displayResults(response.documents);
  } catch (error) {
    console.error('Lỗi:', error);
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
