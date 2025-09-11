
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center text-4xl sm:text-5xl font-extrabold tracking-tight">
      <span className="text-stone-800">In</span>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="mx-1 h-12 sm:h-14 w-auto -mt-4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(-45 32 32)">
          <path
            fill="#FBBF24"
            d="M51.9,34.9C54.7,29.1,53.4,22,48.2,17.3c-5.2-4.7-12.4-5.2-18-1.2c-5.1,3.6-8,9.7-7.2,15.9 c0.9,6.7,6,12,12.6,13.1C42.8,45.9,49.1,40.7,51.9,34.9z"
          />
          <path
            fill="#3A2E28"
            d="M30.2,16.1c-1-0.2-2,0-2.9,0.5c-2.6,1.4-3.7,4.5-2.6,7.1c0.5,1.1,1.3,2,2.4,2.5c1.4,0.6,2.9,0.6,4.3,0 c2.6-1.1,4-3.9,3.5-6.6C36.4,17.7,33.5,15.7,30.2,16.1z"
          />
        </g>
      </svg>
      <span className="text-yellow-400">anana</span>
    </div>
  );
};

export default Logo;
