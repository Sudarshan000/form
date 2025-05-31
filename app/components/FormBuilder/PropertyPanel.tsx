import React, { useState } from 'react';
import type { FormField, Option } from '~/lib/types';
import { useFormBuilder, formBuilderActions } from '~/lib/formBuilderContext';
import { generateId } from '~/lib/utils';

export const PropertyPanel: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  
  const selectedField = state.currentForm?.fields.find(
    field => field.id === state.selectedFieldId
  );

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No field selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a field to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    const updatedField = { ...selectedField, ...updates };
    dispatch(formBuilderActions.updateField(updatedField));
  };

  const addOption = () => {
    const newOptions = [
      ...(selectedField.options || []),
      {
        id: generateId(),
        label: `Option ${(selectedField.options?.length || 0) + 1}`,
        value: `option${(selectedField.options?.length || 0) + 1}`,
      },
    ];
    updateField({ options: newOptions });
  };

  const updateOption = (optionId: string, updates: Partial<Option>) => {
    const newOptions = selectedField.options?.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    );
    updateField({ options: newOptions });
  };

  const removeOption = (optionId: string) => {
    const newOptions = selectedField.options?.filter(option => option.id !== optionId);
    updateField({ options: newOptions });
  };

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(selectedField.type);

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Properties</h3>
      
      <div className="space-y-4">
        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600">
            {selectedField.type.charAt(0).toUpperCase() + selectedField.type.slice(1)}
          </div>
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => updateField({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Placeholder */}
        {selectedField.type !== 'radio' && selectedField.type !== 'checkbox' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={selectedField.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Help Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Help Text
          </label>
          <textarea
            value={selectedField.helpText || ''}
            onChange={(e) => updateField({ helpText: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Required */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={selectedField.required}
            onChange={(e) => updateField({ required: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
            Required field
          </label>
        </div>

        {/* Validation */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Validation</h4>
          
          {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={selectedField.validation?.minLength || ''}
                  onChange={(e) => updateField({
                    validation: {
                      ...selectedField.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Length
                </label>
                <input
                  type="number"
                  value={selectedField.validation?.maxLength || ''}
                  onChange={(e) => updateField({
                    validation: {
                      ...selectedField.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </>
          )}

          {(selectedField.type === 'text' || selectedField.type === 'email' || selectedField.type === 'phone') && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern (Regex)
              </label>
              <input
                type="text"
                value={selectedField.validation?.pattern || ''}
                onChange={(e) => updateField({
                  validation: {
                    ...selectedField.validation,
                    pattern: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="^[A-Za-z]+$"
              />
            </div>
          )}

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Error Message
            </label>
            <input
              type="text"
              value={selectedField.validation?.customMessage || ''}
              onChange={(e) => updateField({
                validation: {
                  ...selectedField.validation,
                  customMessage: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="This field is invalid"
            />
          </div>
        </div>

        {/* Options */}
        {hasOptions && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Options</h4>
              <button
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedField.options?.map((option, index) => (
                <div key={option.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Option {index + 1}</span>
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => updateOption(option.id, { label: e.target.value })}
                      placeholder="Option label"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => updateOption(option.id, { value: e.target.value })}
                      placeholder="Option value"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
