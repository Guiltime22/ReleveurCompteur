export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toFixed(decimals);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'DZ',
  }).format(amount);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculatePowerCost = (powerKW, hours, pricePerKWh = 0.15) => {
  return powerKW * hours * pricePerKWh;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'connected':
    case 'success':
      return '#4CAF50';
    case 'disconnected':
    case 'error':
      return '#F44336';
    case 'warning':
      return '#FF9800';
    case 'loading':
      return '#2196F3';
    default:
      return '#757575';
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
