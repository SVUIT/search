async function loadAppwriteConfig() {
  try {
    const response = await fetch('/config'); 
    const envVars = await response.json();

    const client = new Appwrite.Client();
    client
      .setEndpoint(envVars.endpoint)
      .setProject(envVars.projectId)
      .setKey(envVars.appwriteApiKey); 

    const databases = new Appwrite.Databases(client);

    return { databases, envVars };
  } catch (error) {
    console.error("Error loading environment variables:", error);
    return null;
  }
}

async function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const term = searchInput.value.trim();

  if (!term) {
    displayResults([]);
    return;
  }

  const appwriteConfig = await loadAppwriteConfig();
  if (!appwriteConfig) return;

  try {
    const response = await appwriteConfig.databases.listDocuments(
      appwriteConfig.envVars.databaseId,
      appwriteConfig.envVars.collectionId,
      [Appwrite.Query.search('name', term)]
    );

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
