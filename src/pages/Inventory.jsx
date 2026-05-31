import React, { useEffect, useState } from 'react';
import { Package, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { getInventory, createInventoryItem, deleteInventoryItem } from '../api/inventoryApi';
import { useToast } from '../context/ToastContext';

const inventoryFields = [
  {
    name: 'item_name',
    label: 'Item Name',
    type: 'text',
    placeholder: 'e.g., Paneer',
    required: true,
  },
  {
    name: 'stock',
    label: 'Current Stock',
    type: 'number',
    placeholder: 'e.g., 10',
    required: true,
    min: 0,
    step: 'any',
  },
  {
    name: 'unit',
    label: 'Unit',
    type: 'text',
    placeholder: 'e.g., kg, pcs, liters',
    required: true,
  },
  {
    name: 'minimum_stock',
    label: 'Minimum Stock',
    type: 'number',
    placeholder: 'e.g., 5',
    required: true,
    min: 0,
    step: 'any',
  },
];

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { addToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setItems(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      addToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createInventoryItem({
        item_name: formData.item_name,
        stock: parseFloat(formData.stock),
        unit: formData.unit,
        minimum_stock: parseFloat(formData.minimum_stock),
      });
      addToast('Inventory item added successfully', 'success');
      fetchInventory();
    } catch (err) {
      console.error('Failed to add inventory item:', err);
      addToast('Failed to add inventory item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setDeleteId(id);
      await deleteInventoryItem(id);
      addToast('Item deleted successfully', 'success');
      fetchInventory();
    } catch (err) {
      console.error('Failed to delete item:', err);
      addToast('Failed to delete item', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const isLowStock = (item) => {
    return item.stock <= item.minimum_stock;
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and monitor low stock items"
      />

      <FormCard
        fields={inventoryFields}
        onSubmit={handleCreate}
        submitLabel="Add Item"
        isSubmitting={isSubmitting}
      />

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          title="No inventory items"
          description="Add your first inventory item using the form above."
          icon={Package}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Min. Stock
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isLowStock(item) ? 'bg-red-50/50' : ''
                      } ${deleteId === item.id ? 'opacity-0 transition-opacity duration-300' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {item.item_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            isLowStock(item) ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.minimum_stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isLowStock(item) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${
                  isLowStock(item)
                    ? 'border-red-200 bg-red-50/30'
                    : 'border-gray-100'
                } ${deleteId === item.id ? 'opacity-0 transition-opacity duration-300' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.stock} {item.unit}
                    </p>
                  </div>
                  {isLowStock(item) ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
                      Low
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      OK
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Min: <span className="font-medium text-gray-700">{item.minimum_stock} {item.unit}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Inventory;
