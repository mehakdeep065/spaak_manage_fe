import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-green-500 animate-spin-slow`} />
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default Loader;
