import { application } from 'express';
import { config } from './config.js';

// Khởi tạo client Appwrite
const client = new Appwrite.Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

// Khởi tạo database
const databases = new Appwrite.Databases(client);
const cors = require('cors');

application.use(cors());
// Hàm tìm kiếm
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        searchResults.style.display = 'none';
        return;
    }

    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.collectionId,
            [
                Appwrite.Query.search('name', searchTerm)
            ]
        );

        // In ra tên từ kết quả tìm kiếm
        if (response.documents.length > 0) {
            console.log('Tên:', response.documents[0].name);
        }

        handleSearchResults(response.documents);
        
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        searchResults.innerHTML = '<div class="search-result-item">Có lỗi xảy ra khi tìm kiếm</div>';
        searchResults.style.display = 'block';
    }
}

// Xử lý và hiển thị kết quả tìm kiếm
function handleSearchResults(documents) {
    const searchResults = document.getElementById('searchResults');
    
    searchResults.innerHTML = '';
    
    if (documents.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Không tìm thấy kết quả</div>';
    } else {
        documents.forEach(doc => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = `${doc.name}`;
            resultItem.onclick = () => {
                document.getElementById('searchInput').value = doc.name;
                searchResults.style.display = 'none';
            };
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
}

// Thêm sự kiện click cho nút tìm kiếm
document.querySelector('.search-btn').addEventListener('click', performSearch);

// Thêm sự kiện input cho ô tìm kiếm (tìm kiếm realtime)
document.getElementById('searchInput').addEventListener('input', performSearch);