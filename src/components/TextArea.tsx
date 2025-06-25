import React from 'react';
import { Copy, Volume2, VolumeX } from 'lucide-react';

interface TextAreaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  onCopy?: () => void;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  label: string;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  onCopy,
  onSpeak,
  isSpeaking = false,
  label,
  maxLength = 5000,
}) => {
  const handleCopy = async () => {
    if (value && onCopy) {
      try {
        await navigator.clipboard.writeText(value);
        onCopy();
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {!readOnly && (
          <span className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            readOnly 
              ? 'bg-gray-50 text-gray-700' 
              : 'bg-white hover:border-gray-400'
          }`}
        />
        
        {value && (
          <div className="absolute top-3 right-3 flex gap-2">
            {onCopy && (
              <button
                onClick={handleCopy}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
            
            {onSpeak && (
              <button
                onClick={onSpeak}
                className={`p-1.5 rounded transition-all duration-200 ${
                  isSpeaking
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen'}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};