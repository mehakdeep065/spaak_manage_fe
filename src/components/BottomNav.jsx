import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Package,
  Bell,
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/sales', label: 'Sales', icon: TrendingUp },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/reminders', label: 'Reminders', icon: Bell },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-green-600 font-semibold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
