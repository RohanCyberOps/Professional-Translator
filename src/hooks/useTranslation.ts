import { useState, useCallback } from 'react';
import { Translation } from '../types/translation';
import { translationService } from '../services/translationService';
import { storageService } from '../services/storageService';

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = useCallback(async (
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<Translation | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const translatedText = await translationService.translateText(text, sourceLang, targetLang);
      
      const translation: Translation = {
        id: Date.now().toString(),
        sourceText: text,
        translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        timestamp: Date.now(),
      };

      storageService.saveTranslation(translation);
      return translation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string): Promise<string | null> => {
    try {
      return await translationService.detectLanguage(text);
    } catch (err) {
      console.error('Language detection failed:', err);
      return null;
    }
  }, []);

  return {
    translateText,
    detectLanguage,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};