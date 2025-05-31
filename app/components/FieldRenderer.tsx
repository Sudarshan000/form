import React from 'react';
import type { FormField } from '~/lib/types';
import { validateField } from '~/lib/utils';

interface FieldRendererProps {
  field: FormField;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  mode = 'preview'
}) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "";
  
  const inputClasses = `${baseClasses} ${errorClasses}`;

  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={inputClasses}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            className={`${inputClasses} min-h-[100px] resize-y`}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
            rows={4}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            className={inputClasses}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            className={inputClasses}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className={inputClasses}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={inputClasses}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          />
        );

      case 'dropdown':
        return (
          <select
            className={inputClasses}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  required={field.required}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleChange([...currentValues, option.value]);
                    } else {
                      handleChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            className={inputClasses}
            onChange={(e) => handleChange(e.target.files?.[0])}
            disabled={disabled}
            required={field.required}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded-md text-center text-gray-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {field.helpText && (
        <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};
