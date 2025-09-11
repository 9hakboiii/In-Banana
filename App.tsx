import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ElementType, ElementImage, ElementDefinition } from './types';
import { editImageWithElements } from './services/geminiService';
import { fileToBase64, downloadImage, dataUrlToFile, cropImageToAspectRatio } from './utils/fileUtils';
import Logo from './components/Logo';
import ImageUploader from './components/ImageUploader';
import ActionButton from './components/ActionButton';
import InstagramIcon from './components/icons/InstagramIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ImageEditorToolbar from './components/ImageEditorToolbar';
import Gallery from './components/Gallery';
import GalleryIcon from './components/icons/GalleryIcon';

const elementDefinitions: ElementDefinition[] = [
  { id: ElementType.Expression, label: 'Expression' },
  { id: ElementType.Gesture, label: 'Gesture' },
  { id: ElementType.Action, label: 'Action' },
  { id: ElementType.Object, label: 'Object' },
  { id: ElementType.Style, label: 'Style' },
  { id: ElementType.Location, label: 'Location' },
];

const App: React.FC = () => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [elementImages, setElementImages] = useState<ElementImage>({});
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);
  
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedPhotos = localStorage.getItem('inBananaPhotos');
      if (storedPhotos) {
        setSavedPhotos(JSON.parse(storedPhotos));
      }
    } catch (e) {
      console.error("Failed to load photos from localStorage", e);
      setSavedPhotos([]);
    }
  }, []);

  const handleMainImageUpload = (file: File) => {
    setMainImage(file);
    setGeneratedImage(null);
    setShowOriginal(false);
    setError(null);
    setAspectRatio('1:1');
  };

  const handleElementImageUpload = (id: ElementType, file: File | null) => {
    setElementImages(prev => ({ ...prev, [id]: file }));
  };

  const handleDelete = () => {
    setMainImage(null);
    setElementImages({});
    setGeneratedImage(null);
    setShowOriginal(false);
    setError(null);
    setTextPrompt('');
    setAspectRatio('1:1');
  };
  
  const performGeneration = useCallback(async () => {
    if (!mainImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setShowOriginal(false);
    setAspectRatio('1:1');

    try {
      const mainImageB64 = await fileToBase64(mainImage);
      const elementImagesB64: { id: ElementType; data: string; mimeType: string }[] = await Promise.all(
        Object.entries(elementImages)
          .filter(([, file]) => file !== null)
          .map(async ([id, file]) => {
            const { base64, mimeType } = await fileToBase64(file!);
            return { id: id as ElementType, data: base64, mimeType };
          })
      );
      
      const result = await editImageWithElements(
        { data: mainImageB64.base64, mimeType: mainImageB64.mimeType },
        elementImagesB64,
        textPrompt
      );

      if (result) {
        const imageUrl = `data:image/png;base64,${result}`;
        setGeneratedImage(imageUrl);
        setSavedPhotos(prevPhotos => {
            const newPhotos = [imageUrl, ...prevPhotos];
            try {
                localStorage.setItem('inBananaPhotos', JSON.stringify(newPhotos));
            } catch (e) {
                console.error("Failed to save photos to localStorage", e);
            }
            return newPhotos;
        });
      } else {
        setError("The model did not return an image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [mainImage, elementImages, textPrompt]);
  
  const getFinalImage = async (): Promise<string | null> => {
    if (!generatedImage) return null;
    return cropImageToAspectRatio(generatedImage, aspectRatio);
  };

  const handleDownload = async () => {
    const finalImage = await getFinalImage();
    if (finalImage) {
        downloadImage(finalImage, 'in-banana-edit.png');
    }
  };

  const handleShare = async () => {
    const finalImage = await getFinalImage();
    if (!finalImage) return;

    try {
        const imageFile = await dataUrlToFile(finalImage, 'in-banana-edit.png');
        if (navigator.share && navigator.canShare({ files: [imageFile] })) {
            await navigator.share({
                title: 'In Banana Creation',
                text: 'Check out this image I edited with In Banana!',
                files: [imageFile],
            });
        } else {
            alert('Your browser does not support sharing. The image will be downloaded instead.');
            downloadImage(finalImage, 'in-banana-edit.png');
        }
    } catch (error) {
        console.error('Sharing failed:', error);
        alert('Could not share the image. Please try downloading it instead.');
        downloadImage(finalImage, 'in-banana-edit.png');
    }
  };
  
  const handleImageToggle = () => {
    if (generatedImage) {
      setIsFading(true);
    }
  };
  
  const handleTransitionEnd = () => {
    if (isFading) {
      setShowOriginal(prev => !prev);
      setIsFading(false);
    }
  };


  const hasElementImages = useMemo(() => Object.values(elementImages).some(file => file !== null), [elementImages]);
  const mainImagePreview = useMemo(() => mainImage ? URL.createObjectURL(mainImage) : null, [mainImage]);

  const displayedImageSrc = generatedImage 
    ? (showOriginal ? mainImagePreview : generatedImage) 
    : mainImagePreview;
  
  const aspectRatioClass = useMemo(() => {
    switch (aspectRatio) {
      case '1:1': return 'aspect-square';
      case '3:4': return 'aspect-[3/4]';
      case '9:16': return 'aspect-[9/16]';
      case '9:22': return 'aspect-[9/22]';
      case 'full': return 'aspect-auto';
      default: return 'aspect-square';
    }
  }, [aspectRatio]);

  const leftElements = elementDefinitions.slice(0, 3);
  const rightElements = elementDefinitions.slice(3, 6);

  return (
    <div className="min-h-screen bg-white text-stone-800 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-center">
            <Logo />
        </div>
        <div className="flex-1 flex justify-end">
            <button
                onClick={() => setShowGallery(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-stone-600 hover:text-stone-800"
                aria-label="Open photo gallery"
            >
                <GalleryIcon className="w-7 h-7" />
            </button>
        </div>
      </header>
      
      {showGallery && (
        <Gallery 
            photos={savedPhotos} 
            onClose={() => setShowGallery(false)}
            onDownload={(url) => downloadImage(url, 'in-banana-gallery.png')}
        />
      )}

      <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full max-w-3xl" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-8">
          {mainImage && (
            <div className="w-full md:w-1/4 flex flex-col gap-4 items-center">
              {leftElements.map(({ id, label }) => (
                <div key={id} className="w-full max-w-xs md:max-w-none">
                  <p className="text-center font-semibold mb-1 text-stone-600">{label}</p>
                  <ImageUploader 
                    id={id} 
                    onImageUpload={(file) => handleElementImageUpload(id, file)} 
                    onDelete={() => handleElementImageUpload(id, null)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="w-full md:w-1/2 flex flex-col items-center">
            {!mainImage ? (
              <div className="w-full max-w-2xl">
                <ImageUploader onImageUpload={handleMainImageUpload} isMain={true} />
              </div>
            ) : (
             <div className="w-full">
                {generatedImage && (
                  <ImageEditorToolbar 
                    activeRatio={aspectRatio}
                    setRatio={setAspectRatio}
                  />
                )}
                <div 
                  className={`w-full mx-auto max-w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center relative ${generatedImage ? 'cursor-pointer' : ''} ${aspectRatio !== 'full' ? aspectRatioClass : ''}`}
                  onClick={handleImageToggle}
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                      <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-white mt-4 text-lg">Generating your image...</p>
                    </div>
                  )}
                  {displayedImageSrc && (
                    <img 
                      src={displayedImageSrc} 
                      alt="Main content" 
                      className={`w-full h-full object-contain transition-opacity duration-300 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'} ${aspectRatio === 'full' ? 'w-auto h-auto max-w-full max-h-[75vh]' : 'object-cover'}`}
                      onTransitionEnd={handleTransitionEnd}
                    />
                  )}
                </div>
              </div>
            )}
            
            {mainImage && !generatedImage && (
                <div className="mt-4 w-full max-w-lg">
                    <input
                        type="text"
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        placeholder="Add any extra requests... (e.g., 'make it pop art style')"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    />
                </div>
            )}

            {mainImage && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
                {!generatedImage ? (
                  <ActionButton onClick={performGeneration} disabled={!hasElementImages && !textPrompt.trim() || isLoading}>
                    Generate Image
                  </ActionButton>
                ) : (
                  <>
                    <ActionButton onClick={handleShare} icon={<InstagramIcon className="w-5 h-5"/>}>
                      Share to Instagram
                    </ActionButton>
                    <ActionButton onClick={handleDownload} variant="secondary" icon={<DownloadIcon className="w-5 h-5" />}>
                      Download
                    </ActionButton>
                    <ActionButton onClick={performGeneration} disabled={isLoading}>
                      Regenerate
                    </ActionButton>
                    <ActionButton onClick={handleDelete} variant="danger">
                      Delete
                    </ActionButton>
                  </>
                )}
              </div>
            )}
          </div>

          {mainImage && (
            <div className="w-full md:w-1/4 flex flex-col gap-4 items-center">
              {rightElements.map(({ id, label }) => (
                <div key={id} className="w-full max-w-xs md:max-w-none">
                  <p className="text-center font-semibold mb-1 text-stone-600">{label}</p>
                  <ImageUploader 
                    id={id} 
                    onImageUpload={(file) => handleElementImageUpload(id, file)} 
                    onDelete={() => handleElementImageUpload(id, null)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
