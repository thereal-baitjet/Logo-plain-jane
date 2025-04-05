document.addEventListener('DOMContentLoaded', function() {
    // Initialize the logo gallery
    loadLogos();
    updateHashtagDisplay();

    // Add event listeners
    document.getElementById('search-button').addEventListener('click', searchLogos);
    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchLogos();
        }
    });
    document.getElementById('upload-form').addEventListener('submit', uploadLogo);

    // Initialize with sample data if first time
    initializeWithSampleData();
});

// Function to initialize with sample data if no logos exist
function initializeWithSampleData() {
    const logos = getLogosFromStorage();
    if (logos.length === 0) {
        // Sample data from logos.json
        const sampleLogos = [
            {
                "id": "1",
                "name": "Sample Logo 1",
                "category": "Technology",
                "hashtags": ["#technology", "#blue", "#modern"],
                "imageData": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzNmNTFiNSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ288L3RleHQ+PC9zdmc+",
                "dateAdded": "2023-01-01T00:00:00.000Z"
            },
            {
                "id": "2",
                "name": "Sample Logo 2",
                "category": "Food",
                "hashtags": ["#food", "#red", "#restaurant"],
                "imageData": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0NDMzNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvb2Q8L3RleHQ+PC9zdmc+",
                "dateAdded": "2023-01-02T00:00:00.000Z"
            }
        ];
        saveLogosToStorage(sampleLogos);
        loadLogos();
    }
}

// Function to load logos from storage
function loadLogos() {
    let logos = getLogosFromStorage();
    displayLogos(logos);
}

// Function to get logos from localStorage
function getLogosFromStorage() {
    const logosJSON = localStorage.getItem('logos');
    return logosJSON ? JSON.parse(logosJSON) : [];
}

// Function to save logos to localStorage
function saveLogosToStorage(logos) {
    localStorage.setItem('logos', JSON.stringify(logos));
}

// Function to display logos in the gallery
function displayLogos(logos) {
    const gallery = document.getElementById('logo-gallery');
    gallery.innerHTML = '';

    if (logos.length === 0) {
        gallery.innerHTML = '<p class="no-logos">No logos found. Upload some logos to get started!</p>';
        return;
    }

    logos.forEach(logo => {
        const logoCard = document.createElement('div');
        logoCard.className = 'logo-card';
        
        // Create hashtag HTML
        let hashtagsHTML = '';
        if (logo.hashtags && logo.hashtags.length > 0) {
            hashtagsHTML = '<div class="logo-hashtags">';
            logo.hashtags.forEach(tag => {
                hashtagsHTML += `<span class="logo-hashtag" onclick="searchByHashtag('${tag}')">${tag}</span>`;
            });
            hashtagsHTML += '</div>';
        }
        
        logoCard.innerHTML = `
            <img src="${logo.imageData}" alt="${logo.name}" class="logo-image">
            <div class="logo-info">
                <h3>${logo.name}</h3>
                <p>Category: ${logo.category}</p>
                ${hashtagsHTML}
            </div>
        `;
        
        gallery.appendChild(logoCard);
    });
}

// Function to upload a new logo
function uploadLogo(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('logo-name');
    const categoryInput = document.getElementById('logo-category');
    const hashtagsInput = document.getElementById('logo-hashtags');
    const fileInput = document.getElementById('logo-file');
    
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const hashtagsText = hashtagsInput.value.trim();
    const file = fileInput.files[0];
    
    if (!name || !category || !file) {
        alert('Please fill in all required fields and select a logo file.');
        return;
    }
    
    // Process hashtags
    let hashtags = [];
    if (hashtagsText) {
        hashtags = hashtagsText.split(/\s+/).map(tag => {
            // Add # if it doesn't start with one
            return tag.startsWith('#') ? tag : '#' + tag;
        });
    }
    
    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Create a new logo object
        const newLogo = {
            id: Date.now().toString(),
            name: name,
            category: category,
            hashtags: hashtags,
            imageData: imageData,
            dateAdded: new Date().toISOString()
        };
        
        // Add the new logo to storage
        const logos = getLogosFromStorage();
        logos.push(newLogo);
        saveLogosToStorage(logos);
        
        // Refresh the gallery and hashtag displays
        displayLogos(logos);
        updateHashtagDisplay();
        
        // Reset the form
        nameInput.value = '';
        categoryInput.value = '';
        hashtagsInput.value = '';
        fileInput.value = '';
        
        alert('Logo uploaded successfully!');
    };
    
    reader.readAsDataURL(file);
}

// Function to search logos
function searchLogos() {
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();
    const logos = getLogosFromStorage();
    
    if (!searchTerm) {
        displayLogos(logos);
        return;
    }
    
    const filteredLogos = logos.filter(logo => {
        // Search in name and category
        const nameMatch = logo.name.toLowerCase().includes(searchTerm);
        const categoryMatch = logo.category.toLowerCase().includes(searchTerm);
        
        // Search in hashtags
        let hashtagMatch = false;
        if (logo.hashtags && logo.hashtags.length > 0) {
            hashtagMatch = logo.hashtags.some(tag => 
                tag.toLowerCase().includes(searchTerm)
            );
        }
        
        return nameMatch || categoryMatch || hashtagMatch;
    });
    
    displayLogos(filteredLogos);
}

// Function to search by hashtag (called when clicking a hashtag)
function searchByHashtag(hashtag) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = hashtag;
    searchLogos();
}

// Function to update hashtag displays
function updateHashtagDisplay() {
    updatePopularHashtags();
    updateTrendingHashtags();
}

// Function to update popular hashtags
function updatePopularHashtags() {
    const hashtagContainer = document.getElementById('hashtag-container');
    const hashtags = getAllHashtags();
    
    // Get the top 10 most used hashtags
    const topHashtags = getTopHashtags(hashtags, 10);
    
    hashtagContainer.innerHTML = '';
    
    topHashtags.forEach(tag => {
        const hashtagElement = document.createElement('span');
        hashtagElement.className = 'hashtag';
        hashtagElement.textContent = tag;
        hashtagElement.addEventListener('click', () => searchByHashtag(tag));
        
        hashtagContainer.appendChild(hashtagElement);
    });
}

// Function to update trending hashtags in the sidebar
function updateTrendingHashtags() {
    const trendingContainer = document.getElementById('trending-hashtags-list');
    const hashtags = getAllHashtags();
    
    // Get hashtag counts
    const hashtagCounts = {};
    hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const sortedHashtags = Object.keys(hashtagCounts)
        .map(tag => ({ tag, count: hashtagCounts[tag] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5
    
    trendingContainer.innerHTML = '';
    
    sortedHashtags.forEach(item => {
        const hashtagElement = document.createElement('div');
        hashtagElement.className = 'trending-hashtag';
        hashtagElement.innerHTML = `
            <span class="trending-hashtag-name">${item.tag}</span>
            <span class="trending-hashtag-count">${item.count}</span>
        `;
        hashtagElement.addEventListener('click', () => searchByHashtag(item.tag));
        
        trendingContainer.appendChild(hashtagElement);
    });
}

// Function to get all hashtags from all logos
function getAllHashtags() {
    const logos = getLogosFromStorage();
    let allHashtags = [];
    
    logos.forEach(logo => {
        if (logo.hashtags && logo.hashtags.length > 0) {
            allHashtags = allHashtags.concat(logo.hashtags);
        }
    });
    
    return allHashtags;
}

// Function to get top N hashtags
function getTopHashtags(hashtags, n) {
    const hashtagCounts = {};
    hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
    
    return Object.keys(hashtagCounts)
        .sort((a, b) => hashtagCounts[b] - hashtagCounts[a])
        .slice(0, n);
}

// Function to handle bulk upload (you can implement this later)
function bulkUploadLogos() {
    // This would be implemented with a file input that accepts multiple files
    alert('Bulk upload feature coming soon!');
}

// Make searchByHashtag globally available for onclick handlers
window.searchByHashtag = searchByHashtag;