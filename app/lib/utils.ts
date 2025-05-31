import { v4 as uuidv4 } from 'uuid';
import type { FormData, FormField, FormStep, FieldType } from './types';

// Generate unique IDs
export const generateId = () => uuidv4();

// Default field configurations
export const createDefaultField = (type: FieldType): Omit<FormField, 'id' | 'order'> => {
  const baseField = {
    type,
    label: getDefaultLabel(type),
    required: false,
    helpText: '',
  };

  switch (type) {
    case 'text':
      return {
        ...baseField,
        placeholder: 'Enter text...',
        validation: { maxLength: 255 }
      };
    case 'textarea':
      return {
        ...baseField,
        placeholder: 'Enter your message...',
        validation: { maxLength: 1000 }
      };
    case 'email':
      return {
        ...baseField,
        placeholder: 'your@email.com',
        validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$' }
      };
    case 'phone':
      return {
        ...baseField,
        placeholder: '+1 (555) 123-4567',
        validation: { pattern: '^\\+?[1-9]\\d{1,14}$' }
      };
    case 'number':
      return {
        ...baseField,
        placeholder: '0',
      };
    case 'date':
      return {
        ...baseField,
      };
    case 'dropdown':
      return {
        ...baseField,
        options: [
          { id: generateId(), label: 'Option 1', value: 'option1' },
          { id: generateId(), label: 'Option 2', value: 'option2' },
        ]
      };
    case 'radio':
      return {
        ...baseField,
        options: [
          { id: generateId(), label: 'Option 1', value: 'option1' },
          { id: generateId(), label: 'Option 2', value: 'option2' },
        ]
      };
    case 'checkbox':
      return {
        ...baseField,
        options: [
          { id: generateId(), label: 'Option 1', value: 'option1' },
          { id: generateId(), label: 'Option 2', value: 'option2' },
        ]
      };
    case 'file':
      return {
        ...baseField,
        helpText: 'Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)'
      };
    default:
      return baseField;
  }
};

export const getDefaultLabel = (type: FieldType): string => {
  const labels: Record<FieldType, string> = {
    text: 'Text Field',
    textarea: 'Text Area',
    email: 'Email Address',
    phone: 'Phone Number',
    number: 'Number',
    date: 'Date',
    dropdown: 'Dropdown',
    radio: 'Radio Buttons',
    checkbox: 'Checkboxes',
    file: 'File Upload',
  };
  return labels[type];
};

// Form creation utilities
export const createDefaultForm = (): FormData => ({
  id: generateId(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  isMultiStep: false,
  steps: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    theme: 'light',
    primaryColor: '#3B82F6',
    submitButtonText: 'Submit',
    successMessage: 'Thank you for your submission!',
    allowSaveProgress: false,
  },
});

export const createDefaultStep = (order: number): FormStep => ({
  id: generateId(),
  title: `Step ${order + 1}`,
  description: '',
  order,
});

// Validation utilities
export const validateField = (field: FormField, value: any): string | null => {
  if (field.required && (!value || value.toString().trim() === '')) {
    return `${field.label} is required`;
  }

  if (!value) return null;

  const { validation } = field;
  if (!validation) return null;

  const stringValue = value.toString();

  if (validation.minLength && stringValue.length < validation.minLength) {
    return validation.customMessage || `${field.label} must be at least ${validation.minLength} characters`;
  }

  if (validation.maxLength && stringValue.length > validation.maxLength) {
    return validation.customMessage || `${field.label} must be no more than ${validation.maxLength} characters`;
  }

  if (validation.pattern && !new RegExp(validation.pattern).test(stringValue)) {
    return validation.customMessage || `${field.label} format is invalid`;
  }

  return null;
};

// Storage utilities
export const saveFormToStorage = (form: FormData): void => {
  try {
    const existingForms = getFormsFromStorage();
    const updatedForms = existingForms.filter(f => f.id !== form.id);
    updatedForms.push({ ...form, updatedAt: new Date().toISOString() });
    localStorage.setItem('formcraft_forms', JSON.stringify(updatedForms));
  } catch (error) {
    console.error('Error saving form to storage:', error);
  }
};

export const getFormFromStorage = (id: string): FormData | null => {
  try {
    const forms = getFormsFromStorage();
    return forms.find(form => form.id === id) || null;
  } catch (error) {
    console.error('Error getting form from storage:', error);
    return null;
  }
};

export const getFormsFromStorage = (): FormData[] => {
  try {
    const stored = localStorage.getItem('formcraft_forms');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting forms from storage:', error);
    return [];
  }
};

export const deleteFormFromStorage = (id: string): void => {
  try {
    const forms = getFormsFromStorage();
    const filteredForms = forms.filter(form => form.id !== id);
    localStorage.setItem('formcraft_forms', JSON.stringify(filteredForms));
  } catch (error) {
    console.error('Error deleting form from storage:', error);
  }
};

// Export utilities
export const exportFormAsJSON = (form: FormData): void => {
  const dataStr = JSON.stringify(form, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Form URL generation
export const generateShareableUrl = (formId: string): string => {
  return `${window.location.origin}/forms/${formId}`;
};