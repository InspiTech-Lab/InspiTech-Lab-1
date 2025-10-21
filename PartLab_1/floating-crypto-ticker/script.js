document.addEventListener('DOMContentLoaded', function() {
  const cryptoCards = document.querySelectorAll('.crypto-card');
  const marketCapElement = document.getElementById('marketCap');
  const volumeElement = document.getElementById('volume');
  const fearGreedElement = document.getElementById('fearGreed');
  
  // Mock price data for realistic updates
  const cryptoData = {
      BTC: { basePrice: 67234.56, volatility: 0.05 },
      ETH: { basePrice: 3456.78, volatility: 0.08 },
      ADA: { basePrice: 0.4567, volatility: 0.12 },
      SOL: { basePrice: 234.89, volatility: 0.15 }
  };
  
  const marketData = {
      marketCap: 2.1,
      volume: 89.2,
      fearGreed: 78
  };
  
  function formatPrice(price, decimals = 2) {
      if (price < 1) {
          return price.toFixed(4);
      }
      return price.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
      });
  }
  
  function formatChange(change) {
      const sign = change >= 0 ? '+' : '';
      return `${sign}${change.toFixed(2)}%`;
  }
  
  function updateCryptoPrice(card) {
      const symbol = card.getAttribute('data-symbol');
      const data = cryptoData[symbol];
      const priceElement = card.querySelector('.price');
      const changeElement = card.querySelector('.change');
      
      // Generate realistic price movement
      const changePercent = (Math.random() - 0.5) * data.volatility * 2;
      const newPrice = data.basePrice * (1 + changePercent);
      
      // Update base price for next calculation
      data.basePrice = newPrice;
      
      // Animate price update
      card.classList.add('updating');
      priceElement.classList.add('updating');
      
      setTimeout(() => {
          priceElement.textContent = `$${formatPrice(newPrice)}`;
          changeElement.textContent = formatChange(changePercent);
          
          // Update change styling
          changeElement.className = changePercent >= 0 ? 'change positive' : 'change negative';
          
          card.classList.remove('updating');
          priceElement.classList.remove('updating');
      }, 300);
      
      // Create price update particles
      createPriceParticles(card, changePercent >= 0);
  }
  
  function createPriceParticles(card, isPositive) {
      const rect = card.getBoundingClientRect();
      const containerRect = document.querySelector('.container').getBoundingClientRect();
      
      for (let i = 0; i < 6; i++) {
          const particle = document.createElement('div');
          const size = 4 + Math.random() * 4;
          const color = isPositive ? '#10b981' : '#ef4444';
          
          particle.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border-radius: 50%;
              left: ${rect.left - containerRect.left + rect.width / 2}px;
              top: ${rect.top - containerRect.top + rect.height / 2}px;
              pointer-events: none;
              z-index: 1000;
              animation: priceParticle 1.5s ease-out forwards;
              --angle: ${(i / 6) * Math.PI * 2};
              --distance: ${50 + Math.random() * 30}px;
          `;
          
          document.querySelector('.container').appendChild(particle);
          setTimeout(() => particle.remove(), 1500);
      }
  }
  
  function updateMarketStats() {
      // Simulate market data changes
      marketData.marketCap += (Math.random() - 0.5) * 0.1;
      marketData.volume += (Math.random() - 0.5) * 5;
      marketData.fearGreed += Math.floor((Math.random() - 0.5) * 10);
      
      // Keep fear & greed in valid range
      marketData.fearGreed = Math.max(0, Math.min(100, marketData.fearGreed));
      
      marketCapElement.textContent = `$${marketData.marketCap.toFixed(1)}T`;
      volumeElement.textContent = `$${marketData.volume.toFixed(1)}B`;
      fearGreedElement.textContent = marketData.fearGreed;
      
      // Update fear & greed color
      if (marketData.fearGreed > 75) {
          fearGreedElement.className = 'stat-value greed';
      } else if (marketData.fearGreed < 25) {
          fearGreedElement.className = 'stat-value fear';
      } else {
          fearGreedElement.className = 'stat-value neutral';
      }
  }
  
  // Add particle animation CSS
  const style = document.createElement('style');
  style.textContent = `
      @keyframes priceParticle {
          0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
          }
          100% {
              transform: translate(
                  calc(cos(var(--angle)) * var(--distance)), 
                  calc(sin(var(--angle)) * var(--distance))
              ) scale(0);
              opacity: 0;
          }
      }
      
      .stat-value.fear {
          color: #ef4444;
      }
      
      .stat-value.neutral {
          color: #f59e0b;
      }
  `;
  document.head.appendChild(style);
  
  // Click handlers for cards
  cryptoCards.forEach(card => {
      card.addEventListener('click', function() {
          updateCryptoPrice(card);
          
          // Create click ripple effect
          const ripple = document.createElement('div');
          const rect = card.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          
          ripple.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) scale(0);
              border-radius: 50%;
              background: rgba(0, 212, 255, 0.3);
              pointer-events: none;
              animation: rippleAnimation 0.8s ease-out forwards;
          `;
          
          card.appendChild(ripple);
          setTimeout(() => ripple.remove(), 800);
      });
      
      // Touch events for mobile
      card.addEventListener('touchstart', function(e) {
          e.preventDefault();
          card.style.transform = 'translateY(-4px) scale(1.01)';
      });
      
      card.addEventListener('touchend', function(e) {
          e.preventDefault();
          card.style.transform = '';
          card.click();
      });
  });
  
  // Auto-update prices for demo
  function autoUpdatePrices() {
      const randomCard = cryptoCards[Math.floor(Math.random() * cryptoCards.length)];
      updateCryptoPrice(randomCard);
      
      // Occasionally update market stats
      if (Math.random() < 0.3) {
          updateMarketStats();
      }
  }
  
  // Start auto updates
  setInterval(autoUpdatePrices, 2000);
  
  // Initial market stats update
  setTimeout(updateMarketStats, 1000);
  
  // Add ripple animation CSS
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
      @keyframes rippleAnimation {
          to {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(rippleStyle);
  
  // Create ambient floating particles
  function createAmbientParticle() {
      const particle = document.createElement('div');
      const size = 2 + Math.random() * 3;
      const x = Math.random() * window.innerWidth;
      const colors = ['#00d4ff', '#5b73ff', '#ff6b6b', '#ffd93d'];
      
      particle.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          left: ${x}px;
          top: 100vh;
          pointer-events: none;
          z-index: 5;
          animation: floatUp 8s linear forwards;
      `;
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 8000);
  }
  
  // Add floating particle animation
  const particleStyle = document.createElement('style');
  particleStyle.textContent = `
      @keyframes floatUp {
          0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
          }
          10% {
              opacity: 0.8;
          }
          90% {
              opacity: 0.8;
          }
          100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(particleStyle);
  
  // Create ambient particles periodically
  setInterval(createAmbientParticle, 1500);
});