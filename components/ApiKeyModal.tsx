import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  currentKey: string | null;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, currentKey, onSave, onClose }) => {
  const [key, setKey] = useState(currentKey || '');

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-white animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 text-center">مفتاح Google AI API</h2>
        <p className="text-gray-300 mb-6 text-center">
          للاستفادة من المحاولات المجانية، يرجى إدخال مفتاح API الخاص بك من Google AI Studio.
        </p>
        
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">
            مفتاح API الخاص بك
          </label>
          <input
            id="apiKey"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ادخل مفتاحك هنا"
          />
        </div>
        
        <div className="text-center mb-6">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            احصل على مفتاح API من هنا
          </a>
        </div>
        
        <div className="flex gap-4">
          {currentKey && (
             <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
              >
                إلغاء
              </button>
          )}
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            حفظ واستخدام المفتاح
          </button>
        </div>
      </div>
    </div>
  );
};