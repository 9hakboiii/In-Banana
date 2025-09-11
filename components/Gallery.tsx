import React from 'react';
import DownloadIcon from './icons/DownloadIcon';
import XIcon from './icons/XIcon';

interface GalleryProps {
  photos: string[];
  onClose: () => void;
  onDownload: (url: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onClose, onDownload }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">Your Photos</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close gallery"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-grow p-4 overflow-y-auto">
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photoUrl, index) => (
                <div key={index} className="relative group aspect-square">
                  <img 
                    src={photoUrl} 
                    alt={`Generated image ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
                    <button
                      onClick={() => onDownload(photoUrl)}
                      className="absolute top-2 right-2 p-2 bg-white/80 text-stone-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                      aria-label="Download image"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p className="text-lg font-semibold">Your gallery is empty.</p>
                <p>Start creating images to see them here!</p>
            </div>
          )}
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
