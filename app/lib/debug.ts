import type { FormData } from './types';

// Debug flag - set to false to disable logging in production
const DEBUG = true;

/**
 * Utility function for logging debug information
 */
export function debugLog(source: string, message: string, data?: any): void {
  if (!DEBUG) return;
  
  console.group(`[FormCraft Debug] ${source}`);
  console.log(message);
  if (data) console.log(data);
  console.groupEnd();
}

/**
 * Validate that a form object has all required properties
 * @param form - The form object to validate
 * @param source - The source/location of the validation for logging
 * @returns A validated form object with all required properties
 */
export function validateForm(form: FormData | null | undefined, source: string): FormData | null {
  if (!form) {
    debugLog(source, "Form is null or undefined");
    return null;
  }

  // Make a copy to avoid mutating the original
  const validatedForm = { ...form };

  // Check if fields is defined and an array
  if (!Array.isArray(validatedForm.fields)) {
    debugLog(source, "Form fields is not an array", validatedForm);
    validatedForm.fields = [];
  } else if (validatedForm.fields.length === 0) {
    debugLog(source, "Form has empty fields array");
  } else {
    debugLog(source, `Form has ${validatedForm.fields.length} fields`, validatedForm.fields);
  }

  // Check for other required properties
  if (!validatedForm.id) {
    debugLog(source, "Form has no ID");
    validatedForm.id = `form_${Date.now()}`;
  }

  if (!validatedForm.title) {
    debugLog(source, "Form has no title");
    validatedForm.title = 'Untitled Form';
  }

  if (!validatedForm.createdAt) {
    debugLog(source, "Form has no createdAt timestamp");
    validatedForm.createdAt = new Date().toISOString();
  }

  if (!validatedForm.updatedAt) {
    debugLog(source, "Form has no updatedAt timestamp");
    validatedForm.updatedAt = new Date().toISOString();
  }
  // Ensure settings object exists
  if (!validatedForm.settings) {
    debugLog(source, "Form has no settings");
    validatedForm.settings = {
      theme: 'light',
      primaryColor: '#3B82F6',
      submitButtonText: 'Submit',
      successMessage: 'Thank you for your submission!',
      allowSaveProgress: false,
    };
  }

  return validatedForm;
}

/**
 * Helper function to safely store form in localStorage
 */
export function safelyStoreForm(form: FormData, operation: string): void {
  try {
    const savedForms = JSON.parse(
      localStorage.getItem("formcraft_forms") || "[]"
    );

    const validatedForm = validateForm(form, operation);
    if (!validatedForm) return;

    const existingFormIndex = savedForms.findIndex(
      (f: FormData) => f.id === validatedForm.id
    );

    if (existingFormIndex >= 0) {
      debugLog(operation, `Updating existing form: ${validatedForm.id}`);
      savedForms[existingFormIndex] = validatedForm;
    } else {
      debugLog(operation, `Adding new form: ${validatedForm.id}`);
      savedForms.push(validatedForm);
    }

    localStorage.setItem("formcraft_forms", JSON.stringify(savedForms));
    debugLog(operation, `Saved form with ${validatedForm.fields.length} fields`, validatedForm);
  } catch (error) {
    debugLog(operation, "Error storing form", error);
  }
}

/**
 * Helper function to safely retrieve a form from localStorage
 */
export function safelyRetrieveForm(formId: string, operation: string): FormData | null {
  try {
    debugLog(operation, `Retrieving form: ${formId}`);
    const savedForms = JSON.parse(
      localStorage.getItem("formcraft_forms") || "[]"
    );
    
    const form = savedForms.find((f: FormData) => f.id === formId);
    if (!form) {
      debugLog(operation, `Form not found: ${formId}`);
      return null;
    }
    
    const validatedForm = validateForm(form, operation);
    return validatedForm;
  } catch (error) {
    debugLog(operation, "Error retrieving form", error);
    return null;
  }
}

/**
 * Debug utility to show all forms in localStorage
 */
export function inspectLocalStorageForms(operation: string): void {
  try {
    const savedForms = JSON.parse(
      localStorage.getItem("formcraft_forms") || "[]"
    );
    
    debugLog(operation, `Found ${savedForms.length} forms in localStorage`);
    
    savedForms.forEach((form: FormData, index: number) => {
      const fieldsCount = Array.isArray(form.fields) ? form.fields.length : 'undefined';
      debugLog(
        operation, 
        `Form #${index + 1}: ${form.title || 'Untitled'} (ID: ${form.id}) - ${fieldsCount} fields`
      );
    });
  } catch (error) {
    debugLog(operation, "Error inspecting localStorage", error);
  }
}

/**
 * Reset a form's fields if they're corrupted or missing
 */
export function resetFormFields(formId: string, operation: string): FormData | null {
  try {
    const form = safelyRetrieveForm(formId, operation);
    if (!form) {
      debugLog(operation, `Form not found: ${formId}`);
      return null;
    }
    
    // Create a fresh form with empty fields array
    const resetForm = {
      ...form,
      fields: [],
      updatedAt: new Date().toISOString()
    };
    
    // Save the reset form
    safelyStoreForm(resetForm, `${operation}.resetFields`);
    debugLog(operation, `Reset fields for form: ${formId}`);
    
    return resetForm;
  } catch (error) {
    debugLog(operation, "Error resetting form fields", error);
    return null;
  }
}
