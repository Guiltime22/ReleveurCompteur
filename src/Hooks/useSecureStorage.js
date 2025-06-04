import { useState, useEffect } from 'react';
import storageService from '../Services/storageService';

export const useSecureStorage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const storeSecurely = async (key, value) => {
    setIsLoading(true);
    try {
      if (key === 'credentials') {
        await storageService.storeCredentials(value);
      } else {
        await storageService.storeSettings({ [key]: value });
      }
      return true;
    } catch (error) {
      console.error('Erreur stockage sécurisé:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveSecurely = async (key) => {
    setIsLoading(true);
    try {
      if (key === 'credentials') {
        return await storageService.getCredentials();
      } else {
        const settings = await storageService.getSettings();
        return settings[key];
      }
    } catch (error) {
      console.error('Erreur récupération sécurisée:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeSecurely = async (key) => {
    setIsLoading(true);
    try {
      if (key === 'credentials') {
        await storageService.removeCredentials();
      }
      return true;
    } catch (error) {
      console.error('Erreur suppression sécurisée:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    storeSecurely,
    retrieveSecurely,
    removeSecurely,
  };
};
