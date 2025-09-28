import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateProfileImage } from './services/geminiService';
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [flagImage, setFlagImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!personImage || !flagImage) {
      setError('يرجى رفع الصورتين للمتابعة.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateProfileImage(personImage, flagImage);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && (err.message.includes("API key not valid") || err.message.includes("permission"))) {
         setError('مفتاح API المدمج غير صالح. يرجى إبلاغ مسؤول الموقع.');
      } else if (err instanceof Error && err.message.includes("quota")){
         setError('لقد تم تجاوز حصة الطلبات المجانية للموقع. يرجى المحاولة مرة أخرى لاحقًا.');
      }
      else {
        setError('حدث خطأ غير متوقع أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [personImage, flagImage]);
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'national_pride_portrait.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPersonImage(null);
    setFlagImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (generatedImage) {
      return (
         <div className="flex flex-col items-center gap-6 animate-fade-in">
           <h2 className="text-3xl font-bold text-green-400">صورة رائعة! اكتمل التصميم.</h2>
           <div className="relative group w-full max-w-lg">
              <img src={generatedImage} alt="Generated Portrait" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover border-4 border-gray-600" />
           </div>
          
           <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                 onClick={handleDownload}
                 className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                 <DownloadIcon />
                 <span>تحميل الصورة</span>
             </button>
              <button
                 onClick={handleReset}
                 className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                 إنشاء صورة جديدة
             </button>
           </div>
         </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
          <Spinner />
          <p className="text-2xl font-semibold mt-6 text-gray-300">
            لحظات من فضلك...
          </p>
          <p className="text-lg text-gray-400">
            الذكاء الاصطناعي يبدع في تصميم صورتك الشخصية.
          </p>
        </div>
      );
    }
    
    return (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ImageUploader title="1. ارفع صورتك الشخصية" onImageUpload={setPersonImage} />
            <ImageUploader title="2. ارفع صورة علم بلدك" onImageUpload={setFlagImage} />
          </div>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            onClick={handleGenerateClick}
            disabled={!personImage || !flagImage}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            أنشئ صورتي الآن
          </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <main className="container mx-auto max-w-4xl w-full">
        <div className="bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-10 text-center relative">
          
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
              صانع صور الفخر الوطني
            </h1>
            <p className="text-gray-300 text-lg">
              حوّل صورتك الشخصية وعلم بلدك إلى صورة فنية احترافية باستخدام الذكاء الاصطناعي.
            </p>
          </header>

          {renderContent()}

        </div>
        <footer className="text-center mt-8 text-gray-500">
            <p>مدعوم بواسطة بن تركي</p>
        </footer>
      </main>
    </div>
  );
};

export default App;