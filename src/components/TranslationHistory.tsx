import React from 'react';
import { Clock, Copy, Trash2, Volume2 } from 'lucide-react';
import { Translation } from '../types/translation';
import { languages } from '../data/languages';

interface TranslationHistoryProps {
  translations: Translation[];
  onCopy: (text: string) => void;
  onSpeak: (text: string, language: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  translations,
  onCopy,
  onSpeak,
  onDelete,
  onClear,
}) => {
  const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language ? `${language.flag} ${language.name}` : code.toUpperCase();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (translations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No translation history yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Your translations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Translation History
          </h3>
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {translations.map((translation) => (
          <div
            key={translation.id}
            className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{getLanguageName(translation.sourceLanguage)}</span>
                <span>→</span>
                <span>{getLanguageName(translation.targetLanguage)}</span>
                <span>•</span>
                <span>{formatDate(translation.timestamp)}</span>
              </div>
              <button
                onClick={() => onDelete(translation.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Delete translation"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="group">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-600 flex-1 mr-2">
                    {translation.sourceText}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onCopy(translation.sourceText)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      title="Copy original text"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onSpeak(translation.sourceText, translation.sourceLanguage)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      title="Listen to original"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-900 font-medium flex-1 mr-2">
                    {translation.translatedText}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onCopy(translation.translatedText)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      title="Copy translation"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onSpeak(translation.translatedText, translation.targetLanguage)}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      title="Listen to translation"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};