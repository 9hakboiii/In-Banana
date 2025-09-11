import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = "px-6 py-3 font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary: 'bg-yellow-400 text-stone-800 hover:bg-yellow-500 focus:ring-yellow-400',
    secondary: 'bg-gray-200 text-stone-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon}
      {children}
    </button>
  );
};

export default ActionButton;
