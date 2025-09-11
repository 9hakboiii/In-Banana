import React, { useState, useCallback, DragEvent } from 'react';
import UploadIcon from './icons/UploadIcon';
import XIcon from './icons/XIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isMain?: boolean;
  id?: string;
  onDelete?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isMain = false, id, onDelete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const inputId = `fileInput-${isMain ? 'main' : id}`;

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Please upload a valid image file.');
      }
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);
  
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  const uploaderClasses = `
    relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl
    flex flex-col items-center justify-center text-center text-gray-500
    cursor-pointer transition-all duration-300 ease-in-out group
    hover:border-yellow-400 hover:bg-gray-100
    ${isDragging ? 'border-yellow-500 bg-yellow-50' : ''}
    ${isMain ? 'aspect-square w-full p-8' : 'aspect-square w-full p-4'}
  `;

  return (
    <div
      className={uploaderClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <input
        type="file"
        id={inputId}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {imagePreview ? (
        <>
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
          {!isMain && onDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-1.5 right-1.5 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75 transition-all"
              aria-label="Delete image"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className={`transition-transform duration-300 group-hover:scale-110 ${isMain ? 'w-16 h-16' : 'w-8 h-8'}`} />
          <p className={`mt-2 font-semibold ${isMain ? 'text-lg' : 'text-sm'}`}>
            {isMain ? 'Drag & drop a photo' : 'Add element'}
          </p>
          <p className={isMain ? 'text-base' : 'text-xs'}>or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;