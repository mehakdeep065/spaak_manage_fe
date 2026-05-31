import React, { useState } from 'react';
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  data,
  onDelete,
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  searchPlaceholder = 'Search...',
  emptyTitle = 'No items found',
  emptyDescription = 'Get started by adding your first item.',
  emptyIcon,
  isLoading = false,
  renderCustomCell,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const value = item[col.key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm(deleteConfirmMessage)) {
      setDeleteId(id);
      setTimeout(() => {
        onDelete(id);
        setDeleteId(null);
      }, 300);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        {filteredData.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {onDelete && (
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`hover:bg-gray-50 transition-colors ${
                    deleteId === item.id ? 'opacity-0 transition-opacity duration-300' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {renderCustomCell && renderCustomCell(col.key, item[col.key], item) ? (
                        renderCustomCell(col.key, item[col.key], item)
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item[col.key] != null ? String(item[col.key]) : '-'}
                        </span>
                      )}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {filteredData.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedData.map((item, index) => (
              <div
                key={item.id || index}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  deleteId === item.id ? 'opacity-0 transition-opacity duration-300' : ''
                }`}
              >
                <div className="space-y-2">
                  {columns.map((col) => (
                    <div key={col.key} className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {col.label}
                      </span>
                      <span className="text-sm text-gray-900">
                        {renderCustomCell && renderCustomCell(col.key, item[col.key], item) ? (
                          renderCustomCell(col.key, item[col.key], item)
                        ) : (
                          <span>{item[col.key] != null ? String(item[col.key]) : '-'}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {onDelete && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
