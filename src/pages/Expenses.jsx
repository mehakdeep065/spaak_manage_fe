import React, { useEffect, useState } from 'react';
import { Receipt, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { getExpenses, createExpense, deleteExpense } from '../api/expenseApi';
import { useToast } from '../context/ToastContext';

const expenseFields = [
  {
    name: 'item_name',
    label: 'Item Name',
    type: 'text',
    placeholder: 'e.g., Paneer',
    required: true,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: 'e.g., 1',
    required: true,
    min: 0,
    step: 'any',
  },
  {
    name: 'amount',
    label: 'Amount (\u20b9)',
    type: 'number',
    placeholder: 'e.g., 150',
    required: true,
    min: 0,
    step: 'any',
  },
  {
    name: 'purchase_date',
    label: 'Purchase Date',
    type: 'date',
    required: true,
    defaultValue: new Date().toISOString().split('T')[0],
  },
];

const expenseColumns = [
  { key: 'id', label: 'ID' },
  { key: 'item_name', label: 'Item Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'amount', label: 'Amount (\u20b9)' },
  { key: 'purchase_date', label: 'Purchase Date' },
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      addToast('Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createExpense({
        item_name: formData.item_name,
        quantity: parseFloat(formData.quantity),
        amount: parseFloat(formData.amount),
        purchase_date: formData.purchase_date,
      });
      addToast('Expense added successfully', 'success');
      fetchExpenses();
    } catch (err) {
      console.error('Failed to create expense:', err);
      addToast('Failed to add expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      addToast('Expense deleted successfully', 'success');
      fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      addToast('Failed to delete expense', 'error');
    }
  };

  const renderCustomCell = (key, value) => {
    if (key === 'amount' && value != null) {
      return <span className="text-sm font-medium text-gray-900">\u20b9{Number(value).toLocaleString()}</span>;
    }
    if (key === 'purchase_date' && value) {
      return <span className="text-sm text-gray-600">{new Date(value).toLocaleDateString('en-IN')}</span>;
    }
    return null;
  };

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage your business expenses"
      />

      <FormCard
        fields={expenseFields}
        onSubmit={handleCreate}
        submitLabel="Add Expense"
        isSubmitting={isSubmitting}
      />

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={expenseColumns}
          data={expenses}
          onDelete={handleDelete}
          searchPlaceholder="Search expenses..."
          emptyTitle="No expenses yet"
          emptyDescription="Add your first expense using the form above."
          emptyIcon={Receipt}
          renderCustomCell={renderCustomCell}
        />
      )}
    </div>
  );
};

export default Expenses;
