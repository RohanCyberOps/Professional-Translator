import { Translation, TranslationHistory } from '../types/translation';

class StorageService {
  private readonly STORAGE_KEY = 'translator_history';

  /**
   * Saves a translation to local storage
   * @param translation - Translation object to save
   */
  saveTranslation(translation: Translation): void {
    try {
      const history = this.getHistory();
      history.translations.unshift(translation);
      
      // Keep only the last 50 translations
      if (history.translations.length > 50) {
        history.translations = history.translations.slice(0, 50);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save translation:', error);
    }
  }

  /**
   * Retrieves translation history from local storage
   * @returns TranslationHistory object
   */
  getHistory(): TranslationHistory {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load translation history:', error);
    }

    return { translations: [] };
  }

  /**
   * Clears all translation history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear translation history:', error);
    }
  }

  /**
   * Removes a specific translation from history
   * @param translationId - ID of translation to remove
   */
  removeTranslation(translationId: string): void {
    try {
      const history = this.getHistory();
      history.translations = history.translations.filter(t => t.id !== translationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to remove translation:', error);
    }
  }
}

export const storageService = new StorageService();