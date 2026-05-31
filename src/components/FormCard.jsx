import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const FormCard = ({ fields, onSubmit, submitLabel = 'Add Item', isSubmitting = false }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      // Reset form
      const reset = {};
      fields.forEach((field) => {
        reset[field.name] = field.defaultValue || '';
      });
      setFormData(reset);
    }
  };

  const inputClasses = (fieldName) =>
    `form-input w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 transition-all ${
      errors[fieldName]
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200'
    }`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.fullWidth ? 'md:col-span-2 lg:col-span-4' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  className={inputClasses(field.name)}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={inputClasses(field.name)}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  min={field.min}
                  step={field.step}
                  className={inputClasses(field.name)}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin-slow" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isSubmitting ? 'Adding...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCard;
