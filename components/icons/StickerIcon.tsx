import React from 'react';

const StickerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15.182 8.418a3 3 0 10-4.242 4.242M9 12a3 3 0 114.242 4.242 3 3 0 01-4.242-4.242zM15 12a3 3 0 11-4.242-4.242 3 3 0 014.242 4.242zM9 12h.01M15 12h.01M6 12a6 6 0 1110.176 4.76l-.225.225a.625.625 0 01-.884 0l-1.68-1.68a.625.625 0 010-.884l.225-.225A6 6 0 016 12z" 
    />
  </svg>
);

export default StickerIcon;