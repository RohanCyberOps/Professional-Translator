export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export interface TranslationHistory {
  translations: Translation[];
}