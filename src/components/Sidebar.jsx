import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Package,
  Bell,
  Salad,
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/sales', label: 'Sales', icon: TrendingUp },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/reminders', label: 'Reminders', icon: Bell },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
          <Salad className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 leading-tight">Spaak Manager</span>
          <span className="text-[10px] text-gray-400 leading-tight">Protein Salad</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-green-50 text-green-600 border-l-4 border-green-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 transition-colors ${
                location.pathname === item.path
                  ? 'text-green-500'
                  : 'text-gray-400 group-hover:text-gray-600'
              }`}
            />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs font-medium text-green-800 mb-1">Laravel API</p>
          <p className="text-[10px] text-green-600">Connected to 127.0.0.1:8000</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
