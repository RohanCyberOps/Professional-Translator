class TranslationService {
  private readonly LIBRE_TRANSLATE_URL = 'https://libretranslate.de/translate';
  private readonly MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

  /**
   * Translates text using multiple translation services with fallback
   * @param text - Text to translate
   * @param sourceLang - Source language code
   * @param targetLang - Target language code
   * @returns Promise with translated text
   */
  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    if (sourceLang === targetLang && sourceLang !== 'auto') {
      return text;
    }

    console.log(`Translating: "${text}" from ${sourceLang} to ${targetLang}`);

    // Try MyMemory first (more reliable for CORS)
    try {
      const result = await this.translateWithMyMemory(text, sourceLang, targetLang);
      console.log('MyMemory translation successful:', result);
      return result;
    } catch (error) {
      console.warn('MyMemory failed:', error);
    }

    // Try LibreTranslate as fallback
    try {
      const result = await this.translateWithLibreTranslate(text, sourceLang, targetLang);
      console.log('LibreTranslate translation successful:', result);
      return result;
    } catch (error) {
      console.warn('LibreTranslate failed:', error);
    }

    // Final fallback - mock translation for demo
    const mockResult = this.getMockTranslation(text, sourceLang, targetLang);
    console.log('Using mock translation:', mockResult);
    return mockResult;
  }

  /**
   * Translates using MyMemory API with improved error handling
   */
  private async translateWithMyMemory(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const langPair = sourceLang === 'auto' ? `auto|${targetLang}` : `${sourceLang}|${targetLang}`;
    const encodedText = encodeURIComponent(text.slice(0, 500)); // Limit text length
    const url = `${this.MYMEMORY_URL}?q=${encodedText}&langpair=${langPair}`;

    console.log('MyMemory URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TranslatorApp/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('MyMemory response:', data);

    if (!data.responseData || !data.responseData.translatedText) {
      throw new Error('Invalid response from MyMemory API');
    }

    if (data.responseStatus && data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'MyMemory translation failed');
    }

    const translatedText = data.responseData.translatedText;
    
    // Check if translation is meaningful (not just returning the same text)
    if (translatedText === text && sourceLang !== targetLang) {
      throw new Error('Translation returned same text - likely failed');
    }

    return translatedText;
  }

  /**
   * Translates using LibreTranslate API
   */
  private async translateWithLibreTranslate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const requestBody = {
      q: text.slice(0, 500), // Limit text length
      source: sourceLang === 'auto' ? 'auto' : sourceLang,
      target: targetLang,
      format: 'text'
    };

    console.log('LibreTranslate request:', requestBody);

    const response = await fetch(this.LIBRE_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('LibreTranslate response:', data);
    
    if (!data.translatedText) {
      throw new Error('No translation returned from LibreTranslate');
    }

    return data.translatedText;
  }

  /**
   * Provides mock translations for demo purposes when APIs fail
   */
  private getMockTranslation(text: string, sourceLang: string, targetLang: string): string {
    const mockTranslations: Record<string, Record<string, string>> = {
      'hello': {
        'es': 'hola',
        'fr': 'bonjour',
        'de': 'hallo',
        'it': 'ciao',
        'pt': 'olá',
        'ru': 'привет',
        'ja': 'こんにちは',
        'ko': '안녕하세요',
        'zh': '你好',
        'ar': 'مرحبا',
        'hi': 'नमस्ते',
        'nl': 'hallo',
        'sv': 'hej',
        'da': 'hej',
        'no': 'hei',
        'fi': 'hei',
        'th': 'สวัสดี',
        'vi': 'xin chào'
      },
      'goodbye': {
        'es': 'adiós',
        'fr': 'au revoir',
        'de': 'auf wiedersehen',
        'it': 'arrivederci',
        'pt': 'tchau',
        'ru': 'до свидания',
        'ja': 'さようなら',
        'ko': '안녕히 가세요',
        'zh': '再见',
        'ar': 'وداعا',
        'hi': 'अलविदा',
        'nl': 'tot ziens',
        'sv': 'hej då',
        'da': 'farvel',
        'no': 'ha det',
        'fi': 'näkemiin',
        'th': 'ลาก่อน',
        'vi': 'tạm biệt'
      },
      'thank you': {
        'es': 'gracias',
        'fr': 'merci',
        'de': 'danke',
        'it': 'grazie',
        'pt': 'obrigado',
        'ru': 'спасибо',
        'ja': 'ありがとう',
        'ko': '감사합니다',
        'zh': '谢谢',
        'ar': 'شكرا',
        'hi': 'धन्यवाद',
        'nl': 'dank je',
        'sv': 'tack',
        'da': 'tak',
        'no': 'takk',
        'fi': 'kiitos',
        'th': 'ขอบคุณ',
        'vi': 'cảm ơn'
      },
      'how are you': {
        'es': '¿cómo estás?',
        'fr': 'comment allez-vous?',
        'de': 'wie geht es dir?',
        'it': 'come stai?',
        'pt': 'como você está?',
        'ru': 'как дела?',
        'ja': '元気ですか？',
        'ko': '어떻게 지내세요?',
        'zh': '你好吗？',
        'ar': 'كيف حالك؟',
        'hi': 'आप कैसे हैं?'
      },
      'good morning': {
        'es': 'buenos días',
        'fr': 'bonjour',
        'de': 'guten morgen',
        'it': 'buongiorno',
        'pt': 'bom dia',
        'ru': 'доброе утро',
        'ja': 'おはよう',
        'ko': '좋은 아침',
        'zh': '早上好',
        'ar': 'صباح الخير',
        'hi': 'सुप्रभात'
      }
    };

    const lowerText = text.toLowerCase().trim();
    
    // Check for exact matches first
    if (mockTranslations[lowerText] && mockTranslations[lowerText][targetLang]) {
      return mockTranslations[lowerText][targetLang];
    }

    // Check for partial matches
    for (const [phrase, translations] of Object.entries(mockTranslations)) {
      if (lowerText.includes(phrase) && translations[targetLang]) {
        return translations[targetLang];
      }
    }

    // For other text, return a formatted mock translation
    const languageNames: Record<string, string> = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'en': 'English',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'th': 'Thai',
      'vi': 'Vietnamese'
    };

    const targetLanguageName = languageNames[targetLang] || targetLang.toUpperCase();
    
    // Simple word-by-word mock translation for demonstration
    if (text.split(' ').length <= 3) {
      return `[${text} in ${targetLanguageName}]`;
    }
    
    return `[${targetLanguageName} translation: "${text}"]`;
  }

  /**
   * Detects the language of the given text using improved heuristics
   * @param text - Text to analyze
   * @returns Promise with detected language code
   */
  async detectLanguage(text: string): Promise<string> {
    const patterns = {
      en: /^[a-zA-Z\s.,!?'"0-9\-()]+$/,
      es: /[ñáéíóúü¿¡]/i,
      fr: /[àâäéèêëïîôöùûüÿç]/i,
      de: /[äöüß]/i,
      ru: /[а-яё]/i,
      zh: /[\u4e00-\u9fff]/,
      ja: /[\u3040-\u309f\u30a0-\u30ff]/,
      ar: /[\u0600-\u06ff]/,
      hi: /[\u0900-\u097f]/,
      ko: /[\uac00-\ud7af]/,
      th: /[\u0e00-\u0e7f]/,
      vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        console.log(`Detected language: ${lang} for text: "${text}"`);
        return lang;
      }
    }

    console.log(`Defaulting to English for text: "${text}"`);
    return 'en'; // Default to English
  }
}

export const translationService = new TranslationService();