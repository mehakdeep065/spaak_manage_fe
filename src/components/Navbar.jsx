import React from 'react';
import { RefreshCw, Salad } from 'lucide-react';

const Navbar = ({ title, subtitle, onRefresh, isRefreshing }) => {
  return (
    <header className="hidden lg:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 fixed top-0 right-0 left-64 z-20">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin-slow' : ''}`} />
          Refresh
        </button>
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
          <Salad className="w-5 h-5 text-green-600" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
