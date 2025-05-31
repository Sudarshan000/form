// Core types for the form builder
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  validation?: FieldValidation;
  options?: Option[]; // For dropdown, radio, checkbox
  order: number;
  stepId?: string; // For multi-step forms
}

export interface Option {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export type FieldType = 
  | 'text'
  | 'textarea' 
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface FormData {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  isMultiStep: boolean;
  steps?: FormStep[];
  createdAt: string;
  updatedAt: string;
  settings: FormSettings;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface FormSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  submitButtonText: string;
  successMessage: string;
  allowSaveProgress: boolean;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  isComplete: boolean;
}

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export interface DragItem {
  id: string;
  type: 'field';
  fieldType: FieldType;
}

// Form builder state
export interface FormBuilderState {
  currentForm: FormData | null;
  selectedFieldId: string | null;
  previewMode: PreviewMode;
  isDirty: boolean;
  autoSaveEnabled: boolean;
}