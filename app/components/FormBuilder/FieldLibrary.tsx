import React from 'react';
import type { FieldType } from '~/lib/types';

interface FieldLibraryProps {
  onFieldDragStart: (fieldType: FieldType) => void;
}

const fieldTypes: Array<{
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    type: 'text',
    label: 'Text Input',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    description: 'Single line text input'
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    description: 'Multi-line text input'
  },
  {
    type: 'email',
    label: 'Email',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
      </svg>
    ),
    description: 'Email address input'
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    description: 'Phone number input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
    description: 'Numeric input'
  },
  {
    type: 'date',
    label: 'Date',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Date picker'
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    description: 'Select from options'
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Single choice from options'
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Multiple choice from options'
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    description: 'File upload field'
  },
];

export const FieldLibrary: React.FC<FieldLibraryProps> = ({ onFieldDragStart }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Library</h3>
      
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <div
            key={fieldType.type}
            draggable
            onDragStart={() => onFieldDragStart(fieldType.type)}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-600 group-hover:text-blue-600">
                {fieldType.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                  {fieldType.label}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-blue-700">
                  {fieldType.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Tips</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Drag fields to the canvas</li>
          <li>• Click to select and edit</li>
          <li>• Drag to reorder fields</li>
          <li>• Use preview to test your form</li>
        </ul>
      </div>
    </div>
  );
};