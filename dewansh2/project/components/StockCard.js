// Stock Card Component - Individual stock display functionality
export function createStockCard(stockData) {
  const { symbol, company, price, change, changePercent, isPositive } = stockData;
  
  const cardHTML = `
    <div class="stock-card" data-symbol="${symbol}">
      <!-- Card Header -->
      <div class="card-header">
        <div class="stock-symbol">${symbol}</div>
        <div class="change-indicator ${isPositive ? 'positive' : 'negative'}">
          ${isPositive ? '▲' : '▼'}
        </div>
      </div>
      
      <!-- Company Name -->
      <div class="company-name">${company}</div>
      
      <!-- Stock Price -->
      <div class="stock-price">$${price}</div>
      
      <!-- Price Change -->
      <div class="price-change ${isPositive ? 'positive' : 'negative'}">
        <span class="change-amount">${isPositive ? '+' : ''}${change}</span>
        <span class="change-percent">(${isPositive ? '+' : ''}${changePercent}%)</span>
      </div>
      
      <!-- Chart Placeholder -->
      <div class="mini-chart">
        <div class="chart-line ${isPositive ? 'positive' : 'negative'}"></div>
      </div>
      
      <!-- Action Button -->
      <button class="analyze-btn">
        Analyze
      </button>
    </div>
  `;
  
  return cardHTML;
}

// Add hover effects to stock cards
export function initializeStockCardEvents() {
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.stock-card')) {
      const card = e.target.closest('.stock-card');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.stock-card')) {
      const card = e.target.closest('.stock-card');
    }
  });

  // Handle analyze button clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('analyze-btn')) {
      const card = e.target.closest('.stock-card');
      const symbol = card.dataset.symbol;
      console.log(`Analyzing stock: ${symbol}`);
      // Here you would integrate with a real stock analysis API
    }
  });
}