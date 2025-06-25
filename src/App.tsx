import React, { useState, useEffect } from 'react';
import { Languages, ArrowRightLeft, Loader2 } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { TextArea } from './components/TextArea';
import { TranslationHistory } from './components/TranslationHistory';
import { Toast } from './components/Toast';
import { useTranslation } from './hooks/useTranslation';
import { speechService } from './services/speechService';
import { storageService } from './services/storageService';
import { Translation } from './types/translation';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [history, setHistory] = useState<Translation[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<'source' | 'target' | null>(null);

  const { translateText, isLoading, error, clearError } = useTranslation();

  // Load translation history on component mount
  useEffect(() => {
    const savedHistory = storageService.getHistory();
    setHistory(savedHistory.translations);
  }, []);

  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      showToast('Please enter text to translate', 'warning');
      return;
    }

    const result = await translateText(sourceText, sourceLang, targetLang);
    if (result) {
      setTranslatedText(result.translatedText);
      setHistory(prev => [result, ...prev]);
      showToast('Translation completed!', 'success');
    }
  };

  // Handle language swap
  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      showToast('Cannot swap when auto-detect is selected', 'warning');
      return;
    }

    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Handle text-to-speech
  const handleSpeak = (text: string, language: string, type: 'source' | 'target') => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(null);
    } else {
      speechService.speak(text, language);
      setIsSpeaking(type);
      // Reset speaking state after a reasonable time
      setTimeout(() => setIsSpeaking(null), 5000);
    }
  };

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    showToast('Copied to clipboard!', 'success');
  };

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
  };

  // Handle history actions
  const handleDeleteTranslation = (id: string) => {
    storageService.removeTranslation(id);
    setHistory(prev => prev.filter(t => t.id !== id));
    showToast('Translation deleted', 'success');
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
    showToast('History cleared', 'success');
  };

  // Clear error when it changes
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Languages className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Professional Translator</h1>
                <p className="text-sm text-gray-600">Translate text instantly with AI-powered accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Translation Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
              <div className="space-y-6">
                {/* Language Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <LanguageSelector
                    value={sourceLang}
                    onChange={setSourceLang}
                    label="From"
                    disabled={isLoading}
                  />
                  
                  <div className="flex justify-center">
                    <button
                      onClick={handleSwapLanguages}
                      disabled={isLoading || sourceLang === 'auto'}
                      className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                      title="Swap languages"
                    >
                      <ArrowRightLeft className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                  
                  <LanguageSelector
                    value={targetLang}
                    onChange={setTargetLang}
                    label="To"
                    excludeAuto
                    disabled={isLoading}
                  />
                </div>

                {/* Text Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextArea
                    value={sourceText}
                    onChange={setSourceText}
                    placeholder="Enter text to translate..."
                    label="Source Text"
                    onSpeak={() => handleSpeak(sourceText, sourceLang, 'source')}
                    isSpeaking={isSpeaking === 'source'}
                  />
                  
                  <TextArea
                    value={translatedText}
                    placeholder="Translation will appear here..."
                    label="Translated Text"
                    readOnly
                    onCopy={() => handleCopy(translatedText)}
                    onSpeak={() => handleSpeak(translatedText, targetLang, 'target')}
                    isSpeaking={isSpeaking === 'target'}
                  />
                </div>

                {/* Translate Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleTranslate}
                    disabled={isLoading || !sourceText.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="h-5 w-5" />
                        Translate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <TranslationHistory
              translations={history}
              onCopy={handleCopy}
              onSpeak={(text, language) => {
                speechService.speak(text, language);
                showToast('Playing audio...', 'success');
              }}
              onDelete={handleDeleteTranslation}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;