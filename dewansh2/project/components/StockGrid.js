import { createStockCard, initializeStockCardEvents } from './StockCard.js';

// Stock Grid Component - Grid layout for displaying multiple stock cards
export function initializeStockGrid() {
  // Sample stock data structure (ready for real API integration)
  const sampleStocks = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      price: '185.42',
      change: '2.34',
      changePercent: '1.28',
      isPositive: true
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      price: '142.56',
      change: '-1.23',
      changePercent: '-0.85',
      isPositive: false
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      price: '234.67',
      change: '5.78',
      changePercent: '2.53',
      isPositive: true
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft Corp.',
      price: '378.90',
      change: '3.45',
      changePercent: '0.92',
      isPositive: true
    },
    {
      symbol: 'AMZN',
      company: 'Amazon.com Inc.',
      price: '167.23',
      change: '-2.67',
      changePercent: '-1.57',
      isPositive: false
    },
    {
      symbol: 'NVDA',
      company: 'NVIDIA Corp.',
      price: '489.12',
      change: '12.34',
      changePercent: '2.59',
      isPositive: true
    }
  ];

  // Render stock cards
  function renderStockCards() {
    const stockGrid = document.getElementById('stockGrid');
    stockGrid.innerHTML = '';

    sampleStocks.forEach((stock, index) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.innerHTML = createStockCard(stock);
      stockGrid.appendChild(gridItem);
    });

    // Update summary statistics
    updateMarketSummary();
  }

  // Update market summary statistics
  function updateMarketSummary() {
    const totalStocks = sampleStocks.length;
    const gainers = sampleStocks.filter(stock => stock.isPositive).length;
    const losers = sampleStocks.filter(stock => !stock.isPositive).length;

    document.getElementById('totalStocks').textContent = totalStocks;
    document.getElementById('gainers').textContent = gainers;
    document.getElementById('losers').textContent = losers;
  }

  // Handle load more button
  function handleLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', () => {
      console.log('Loading more stocks...');
      // Here you would load more stocks from an API
      loadMoreBtn.textContent = 'Loading...';
      
      // Simulate loading delay
      setTimeout(() => {
        loadMoreBtn.textContent = 'Load More Stocks';
      }, 1000);
    });
  }

  // Initialize everything
  renderStockCards();
  handleLoadMore();
  initializeStockCardEvents();

  return {
    addStock: (stockData) => {
      sampleStocks.push(stockData);
      renderStockCards();
    },
    updateStock: (symbol, newData) => {
      const stockIndex = sampleStocks.findIndex(stock => stock.symbol === symbol);
      if (stockIndex !== -1) {
        sampleStocks[stockIndex] = { ...sampleStocks[stockIndex], ...newData };
        renderStockCards();
      }
    },
    getStocks: () => sampleStocks
  };
}