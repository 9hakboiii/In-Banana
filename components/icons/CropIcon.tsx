import React from 'react';

const CropIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M7.5 3.75H4.5A2.25 2.25 0 002.25 6v13.5A2.25 2.25 0 004.5 21.75h13.5A2.25 2.25 0 0020.25 19.5V16.5m-15-15l15 15m0 0V6.75m0 8.25H6.75" 
    />
  </svg>
);

export default CropIcon;