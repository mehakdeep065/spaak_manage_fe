import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import { getSales, createSale, deleteSale } from '../api/saleApi';
import { useToast } from '../context/ToastContext';

const saleFields = [
  {
    name: 'salad_name',
    label: 'Salad Name',
    type: 'text',
    placeholder: 'e.g., Chicken Protein Salad',
    required: true,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: 'e.g., 2',
    required: true,
    min: 1,
    step: 1,
  },
  {
    name: 'selling_price',
    label: 'Selling Price (\u20b9)',
    type: 'number',
    placeholder: 'e.g., 250',
    required: true,
    min: 0,
    step: 'any',
  },
  {
    name: 'sale_date',
    label: 'Sale Date',
    type: 'date',
    required: true,
    defaultValue: new Date().toISOString().split('T')[0],
  },
];

const saleColumns = [
  { key: 'id', label: 'ID' },
  { key: 'salad_name', label: 'Salad Name' },
  { key: 'quantity', label: 'Qty' },
  { key: 'selling_price', label: 'Price (\u20b9)' },
  { key: 'total_amount', label: 'Total (\u20b9)' },
  { key: 'sale_date', label: 'Sale Date' },
];

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load sales:', err);
      addToast('Failed to load sales', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createSale({
        salad_name: formData.salad_name,
        quantity: parseInt(formData.quantity),
        selling_price: parseFloat(formData.selling_price),
        sale_date: formData.sale_date,
      });
      addToast('Sale recorded successfully', 'success');
      fetchSales();
    } catch (err) {
      console.error('Failed to create sale:', err);
      addToast('Failed to record sale', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSale(id);
      addToast('Sale deleted successfully', 'success');
      fetchSales();
    } catch (err) {
      console.error('Failed to delete sale:', err);
      addToast('Failed to delete sale', 'error');
    }
  };

  const renderCustomCell = (key, value, item) => {
    if ((key === 'selling_price' || key === 'total_amount') && value != null) {
      return <span className="text-sm font-medium text-gray-900">\u20b9{Number(value).toLocaleString()}</span>;
    }
    if (key === 'sale_date' && value) {
      return <span className="text-sm text-gray-600">{new Date(value).toLocaleDateString('en-IN')}</span>;
    }
    if (key === 'total_amount' && value == null && item) {
      const total = (item.quantity || 0) * (item.selling_price || 0);
      return <span className="text-sm font-medium text-gray-900">\u20b9{total.toLocaleString()}</span>;
    }
    return null;
  };

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Record and track your salad sales"
      />

      <FormCard
        fields={saleFields}
        onSubmit={handleCreate}
        submitLabel="Record Sale"
        isSubmitting={isSubmitting}
      />

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={saleColumns}
          data={sales}
          onDelete={handleDelete}
          searchPlaceholder="Search sales..."
          emptyTitle="No sales yet"
          emptyDescription="Record your first sale using the form above."
          emptyIcon={TrendingUp}
          renderCustomCell={renderCustomCell}
        />
      )}
    </div>
  );
};

export default Sales;
