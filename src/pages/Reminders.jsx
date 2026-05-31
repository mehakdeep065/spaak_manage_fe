import React, { useEffect, useState } from 'react';
import { Bell, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FormCard from '../components/FormCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  getReminders,
  createReminder,
  deleteReminder,
  completeReminder,
} from '../api/reminderApi';
import { useToast } from '../context/ToastContext';

const reminderFields = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'e.g., Buy Paneer',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'e.g., Purchase 5kg Paneer from vendor',
    required: true,
    fullWidth: true,
  },
  {
    name: 'reminder_time',
    label: 'Reminder Date & Time',
    type: 'datetime-local',
    required: true,
  },
];

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await getReminders();
      setReminders(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load reminders:', err);
      addToast('Failed to load reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createReminder({
        title: formData.title,
        description: formData.description,
        reminder_time: formData.reminder_time,
      });
      addToast('Reminder created successfully', 'success');
      fetchReminders();
    } catch (err) {
      console.error('Failed to create reminder:', err);
      addToast('Failed to create reminder', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await deleteReminder(id);
      addToast('Reminder deleted successfully', 'success');
      fetchReminders();
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      addToast('Failed to delete reminder', 'error');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeReminder(id);
      addToast('Reminder marked as completed', 'success');
      fetchReminders();
    } catch (err) {
      console.error('Failed to complete reminder:', err);
      addToast('Failed to update reminder', 'error');
    }
  };

  const pendingReminders = reminders.filter((r) => r.status !== 'completed');
  const completedReminders = reminders.filter((r) => r.status === 'completed');

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ReminderCard = ({ reminder, isCompleted }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${
        isCompleted ? 'border-gray-100 opacity-75' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => !isCompleted && handleComplete(reminder.id)}
          disabled={isCompleted}
          className={`flex-shrink-0 mt-0.5 transition-colors ${
            isCompleted
              ? 'text-green-500 cursor-default'
              : 'text-gray-300 hover:text-green-500'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold ${
              isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}
          >
            {reminder.title}
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isCompleted ? 'text-gray-400 line-through' : 'text-gray-500'
            }`}
          >
            {reminder.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">
              {formatDateTime(reminder.reminder_time)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
          <button
            onClick={() => handleDelete(reminder.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Reminders"
        subtitle="Manage your tasks and to-dos"
      />

      <FormCard
        fields={reminderFields}
        onSubmit={handleCreate}
        submitLabel="Add Reminder"
        isSubmitting={isSubmitting}
      />

      {loading ? (
        <Loader />
      ) : reminders.length === 0 ? (
        <EmptyState
          title="No reminders yet"
          description="Create your first reminder using the form above."
          icon={Bell}
        />
      ) : (
        <div className="space-y-6">
          {/* Pending Reminders */}
          {pendingReminders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Circle className="w-4 h-4 text-amber-500" />
                Pending ({pendingReminders.length})
              </h2>
              <div className="space-y-3">
                {pendingReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    isCompleted={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Completed ({completedReminders.length})
              </h2>
              <div className="space-y-3">
                {completedReminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    isCompleted={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reminders;
