import React from 'react';

interface AspectRatioButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const AspectRatioButton: React.FC<AspectRatioButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
      isActive ? 'bg-yellow-400 text-stone-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

interface ImageEditorToolbarProps {
  activeRatio: string;
  setRatio: (ratio: string) => void;
}

const ImageEditorToolbar: React.FC<ImageEditorToolbarProps> = ({ activeRatio, setRatio }) => {
  const ratios = ['1:1', '3:4', '9:16', '9:22', 'full'];

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-t-2xl p-2 shadow-md mb-[-1px] z-10">
      <div className="flex items-center justify-center flex-wrap gap-2">
        {ratios.map(ratio => (
            <AspectRatioButton 
                key={ratio}
                label={ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                isActive={activeRatio === ratio}
                onClick={() => setRatio(ratio)}
            />
        ))}
      </div>
    </div>
  );
};

export default ImageEditorToolbar;
