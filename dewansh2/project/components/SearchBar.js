// Search Bar Component - Stock symbol search functionality
export function initializeSearchBar() {
  let isSearchActive = false;

  // Get DOM elements
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.getElementById('stockSearch');
  const searchInputWrapper = document.querySelector('.search-input-wrapper');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  // Handle search form submission
  function handleSearch(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      console.log('Searching for:', searchTerm);
      // Here you would integrate with a real stock API
      
      // Simulate search feedback
      searchInput.value = '';
      searchInputWrapper.classList.remove('active');
      
      // You could add visual feedback here
      showSearchFeedback(searchTerm);
    }
  }

  // Show search feedback
  function showSearchFeedback(term) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(90deg, #00aaff, #00ff88);
      color: #000;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      animation: fadeInUp 0.3s ease-out;
    `;
    notification.textContent = `Searching for ${term}...`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Handle input focus/blur for active state
  function handleInputFocus() {
    isSearchActive = true;
    searchInputWrapper.classList.add('active');
  }

  function handleInputBlur() {
    isSearchActive = false;
    searchInputWrapper.classList.remove('active');
  }

  // Handle suggestion tag clicks
  function handleSuggestionClick(e) {
    if (e.target.classList.contains('suggestion-tag')) {
      const symbol = e.target.dataset.symbol;
      searchInput.value = symbol;
      handleSearch(e);
    }
  }

  // Initialize event listeners
  function initializeEvents() {
    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('focus', handleInputFocus);
    searchInput.addEventListener('blur', handleInputBlur);
    
    // Add click handlers for suggestion tags
    suggestionTags.forEach(tag => {
      tag.addEventListener('click', handleSuggestionClick);
    });

    // Handle Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
    });
  }

  // Initialize everything
  initializeEvents();

  return {
    focusSearch: () => {
      searchInput.focus();
    },
    setSearchValue: (value) => {
      searchInput.value = value;
    },
    getSearchValue: () => searchInput.value
  };
}