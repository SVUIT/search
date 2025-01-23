const searchBar = document.getElementById('search-bar');
const suggestionsContainer = document.getElementById('suggestions');
let debounceTimeout;
let subjectsDict = {}; // Dictionary để lưu trữ subjects

async function loadAllSubjects() {
    try {
        const response = await fetch('/data/subjects.json', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        subjectsDict = data.subjects.reduce((acc, subject) => {
            acc[subject.name.toLowerCase()] = subject.id;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading subjects from JSON:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAllSubjects);

function searchSubjects(query) {
    const lowercaseQuery = query.toLowerCase();
    const matchedSubjects = Object.entries(subjectsDict)
        .filter(([name]) => name.includes(lowercaseQuery))
        .map(([name, id]) => ({ name, id }));
    displaySuggestions(matchedSubjects);
}

// Cập nhật event listener để sử dụng searchSubjects thay vì fetchSubjects
searchBar.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = searchBar.value;
        if (query.length > 0) {
            searchSubjects(query);
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        }
    }, 500);
});

function displaySuggestions(subjects) {
    suggestionsContainer.innerHTML = '';
    if (subjects && subjects.length > 0) {
        subjects.forEach(subject => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = subject.name; // Ensure this matches your subject object structure
            div.onclick = () => {
                searchBar.value = subject.name;
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            };
            suggestionsContainer.appendChild(div);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Thêm hàm này vào file script.js
async function exportSubjects() {
    try {
        const response = await fetch('/api/export-subjects', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            alert('Subjects exported successfully!');
            await loadAllSubjects();
        } else {
            alert('Export failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Export failed!');
    }
}
