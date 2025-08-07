import { initializeSearchBar } from './components/SearchBar.js';
import { initializeStockGrid } from './components/StockGrid.js';

// Main application initialization
class StockAnalyzerApp {
  constructor() {
    this.searchBar = null;
    this.stockGrid = null;
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize search bar functionality
    this.searchBar = initializeSearchBar();
    
    // Initialize stock grid functionality
    this.stockGrid = initializeStockGrid();
    
    // Initialize hero section interactions
    this.initializeHeroSection();
    
    // Initialize global interactions
    this.initializeGlobalEvents();

    console.log('StockAnalyzer App initialized successfully');
  }

  initializeHeroSection() {
    const startAnalyzingBtn = document.querySelector('.btn-primary');
    const learnMoreBtn = document.querySelector('.btn-secondary');

    // Handle "Start Analyzing" button click
    startAnalyzingBtn.addEventListener('click', () => {
      // Scroll to search section
      const searchSection = document.querySelector('.search-section');
      searchSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Focus on search input after scroll
      setTimeout(() => {
        this.searchBar.focusSearch();
      }, 800);
    });

    // Handle "Learn More" button click
    learnMoreBtn.addEventListener('click', () => {
      // Scroll to stocks section
      const stocksSection = document.querySelector('.stocks-section');
      stocksSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  initializeGlobalEvents() {
    // Add smooth scrolling for any internal links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.searchBar.focusSearch();
      }
      
      // Escape key to clear search
      if (e.key === 'Escape') {
        this.searchBar.setSearchValue('');
      }
    });

    // Add intersection observer for animations
    this.initializeScrollAnimations();
  }

  initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Scroll animations removed - static display only
  }

  // Public API methods
  addStock(stockData) {
    return this.stockGrid.addStock(stockData);
  }

  updateStock(symbol, newData) {
    return this.stockGrid.updateStock(symbol, newData);
  }

  getStocks() {
    return this.stockGrid.getStocks();
  }

  searchStock(symbol) {
    this.searchBar.setSearchValue(symbol);
    this.searchBar.focusSearch();
  }
}

// Initialize the application
const app = new StockAnalyzerApp();

// Make app available globally for debugging/testing
window.StockAnalyzer = app;

export default app;