import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Receipt,
  TrendingUp,
  Package,
  Bell,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import { getDashboardStats } from '../api/dashboardApi';
import { useToast } from '../context/ToastContext';

const Dashboard = ({ onRefresh }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  const fetchStats = async (showToast = false) => {
    try {
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
      if (showToast) {
        addToast('Dashboard refreshed successfully', 'success');
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data. Make sure your Laravel backend is running.');
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats(true);
    if (onRefresh) onRefresh();
  };

  const statCards = stats
    ? [
        {
          title: 'Total Sales',
          value: stats.total_sales || 0,
          prefix: '\u20b9',
          icon: TrendingUp,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
        {
          title: 'Total Expenses',
          value: stats.total_expenses || 0,
          prefix: '\u20b9',
          icon: Receipt,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
        },
        {
          title: 'Profit',
          value: stats.profit || 0,
          prefix: '\u20b9',
          icon: IndianRupee,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          title: 'Inventory Items',
          value: stats.inventory_items || 0,
          icon: Package,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          title: 'Pending Reminders',
          value: stats.pending_reminders || 0,
          icon: Bell,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
        },
        {
          title: 'Low Stock Items',
          value: stats.low_stock_items || 0,
          icon: AlertTriangle,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
        },
      ]
    : [];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back to your business overview"
        />
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin-slow' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-red-800 mb-1">{error}</h3>
          <p className="text-sm text-red-600 mb-4">
            Make sure your Laravel API is running at http://127.0.0.1:8000
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, index) => (
            <StatCard key={card.title} {...card} delay={index * 50} />
          ))}
        </div>
      )}

      {/* Quick Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-base font-semibold text-green-800 mb-2">
          Getting Started
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-700">1</span>
            </div>
            <p>Start by adding your inventory items with stock levels and minimum thresholds.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-700">2</span>
            </div>
            <p>Record daily expenses like ingredients, packaging, and supplies.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-700">3</span>
            </div>
            <p>Log your salad sales to track revenue and profitability.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-700">4</span>
            </div>
            <p>Set reminders for important tasks like restocking or vendor payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
