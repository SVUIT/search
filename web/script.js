async function getEnvVars() {
  try {
      const response = await fetch(`${window.location.origin}/_env`); 
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Failed to fetch environment variables:', error);
      return {};
  }
}

async function init() {
  const env = await getEnvVars();

  const ENDPOINT = env.ENDPOINT;
  const PROJECT_ID = env.PROJECT_ID;
  const DATABASE_ID = env.DATABASE_ID;
  const COLLECTION_ID = env.COLLECTION_ID;
  const APPWRITE_ID = env.APPWRITE_ID;


  // Initialize Appwrite Client
  const client = new Appwrite.Client();
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  
  const databases = new Appwrite.Databases(client);

  async function performSearch() {
      const searchInput = document.getElementById('searchInput');
      const term = searchInput.value.trim();

      if (!term) {
          displayResults([]);
          return;
      }

      try {
          const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?queries[]=${encodeURIComponent(`search("name", "${term}")`)}`;

          const response = await fetch(url, {
              method: 'GET',
              mode: 'cors', // Use 'cors' instead of 'no-cors'
              headers: {
                  'Content-Type': 'application/json',
                  'X-Appwrite-Project': PROJECT_ID,
                  'X-Appwrite-Key': APPWRITE_ID, // Secure Key from Cloudflare
              }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          displayResults(data.documents);
      } catch (error) {
          console.error('Error fetching search results:', error);
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

  document.getElementById('searchInput').addEventListener('input', performSearch);
}

document.addEventListener('DOMContentLoaded', init);
