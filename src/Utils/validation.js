export const validatePassword = (password) => {
  if (!password || password.trim().length === 0) {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }
  
  if (password.length < 4) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 4 caractères' };
  }
  
  return { isValid: true, message: '' };
};

export const validateIP = (ip) => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  if (!ip || !ipRegex.test(ip)) {
    return { isValid: false, message: 'Adresse IP invalide' };
  }
  
  return { isValid: true, message: '' };
};

export const validateMeterData = (data) => {
  if (!data) {
    return { isValid: false, message: 'Aucune donnée reçue' };
  }
  
  const requiredFields = ['power', 'voltage', 'current'];
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null
  );
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      message: `Champs manquants: ${missingFields.join(', ')}` 
    };
  }
  
  return { isValid: true, message: '' };
};
