
import React, { useState, useRef, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon, CheckCircleIcon } from './icons';


interface ImageUploaderProps {
  title: string;
  onImageUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPreview(URL.createObjectURL(file));
        onImageUpload(base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
        // Handle error display to user
      }
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
      <div
        onClick={handleClick}
        className={`relative w-full aspect-square bg-gray-700 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300
                    ${preview ? 'border-green-500' : 'border-gray-500 hover:border-blue-400'} group`}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-bold">تغيير الصورة</p>
            </div>
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                <CheckCircleIcon />
            </div>
          </>

        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon />
            <p>انقر هنا للرفع</p>
          </div>
        )}
      </div>
    </div>
  );
};
