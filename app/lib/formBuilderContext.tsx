import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { FormData, FormField } from "~/lib/types";
import { createDefaultForm, generateId } from "~/lib/utils";

// Form Builder State
interface FormBuilderState {
  form: FormData;
  selectedFieldId: string | null;
  isDirty: boolean;
  autoSaveEnabled: boolean;
}

// Action types
type FormBuilderAction =
  | { type: "LOAD_FORM"; payload: FormData }
  | { type: "UPDATE_FORM_SETTINGS"; payload: Partial<FormData> }
  | { type: "ADD_FIELD"; payload: FormField }
  | { type: "UPDATE_FIELD"; payload: FormField }
  | { type: "REMOVE_FIELD"; payload: string }
  | { type: "REORDER_FIELDS"; payload: FormField[] }
  | { type: "SELECT_FIELD"; payload: string | null }
  | { type: "SET_DIRTY"; payload: boolean }
  | { type: "SAVE_FORM" }
  | { type: "NEW_FORM" };

// Initial state
const initialState: FormBuilderState = {
  form: createDefaultForm(),
  selectedFieldId: null,
  isDirty: false,
  autoSaveEnabled: true,
};

// Reducer
const formBuilderReducer = (
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState => {
  switch (action.type) {
    case "LOAD_FORM":
      return {
        ...state,
        form: action.payload,
        isDirty: false,
        selectedFieldId: null,
      };

    case "UPDATE_FORM_SETTINGS":
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      };

    case "ADD_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          fields: [...state.form.fields, action.payload],
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId: action.payload.id,
        isDirty: true,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          fields: state.form.fields.map((field) =>
            field.id === action.payload.id ? action.payload : field
          ),
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      };

    case "REMOVE_FIELD":
      const newFields = state.form.fields.filter(
        (field) => field.id !== action.payload
      );
      return {
        ...state,
        form: {
          ...state.form,
          fields: newFields,
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId:
          state.selectedFieldId === action.payload
            ? null
            : state.selectedFieldId,
        isDirty: true,
      };

    case "REORDER_FIELDS":
      return {
        ...state,
        form: {
          ...state.form,
          fields: action.payload,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      };

    case "SELECT_FIELD":
      return {
        ...state,
        selectedFieldId: action.payload,
      };

    case "SET_DIRTY":
      return {
        ...state,
        isDirty: action.payload,
      };

    case "SAVE_FORM":
      // Save form to localStorage
      const savedForms = JSON.parse(
        localStorage.getItem("formcraft_forms") || "[]"
      );
      const existingFormIndex = savedForms.findIndex(
        (f: FormData) => f.id === state.form.id
      );

      if (existingFormIndex >= 0) {
        savedForms[existingFormIndex] = state.form;
      } else {
        savedForms.push(state.form);
      }

      localStorage.setItem("formcraft_forms", JSON.stringify(savedForms));

      return {
        ...state,
        isDirty: false,
      };

    case "NEW_FORM":
      return {
        ...state,
        form: createDefaultForm(),
        selectedFieldId: null,
        isDirty: false,
      };
    default:
      return state;
  }
};

// Context
const FormBuilderContext = createContext<{
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
} | null>(null);

// Provider component
export const FormBuilderProvider: React.FC<{
  children: React.ReactNode;
  initialFormId?: string;
}> = ({ children, initialFormId }) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Load form on mount if formId provided
  useEffect(() => {
    if (initialFormId) {
      const savedForms = JSON.parse(
        localStorage.getItem("formcraft_forms") || "[]"
      );
      const form = savedForms.find((f: FormData) => f.id === initialFormId);
      if (form) {
        dispatch({ type: "LOAD_FORM", payload: form });
      }
    }
  }, [initialFormId]);

  // Auto-save effect
  useEffect(() => {
    if (state.autoSaveEnabled && state.isDirty && state.form.id) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: "SAVE_FORM" });
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [state.isDirty, state.form, state.autoSaveEnabled]);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
};

// Hook to use the context
export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

// Action creators for better type safety
export const formBuilderActions = {
  loadForm: (form: FormData): FormBuilderAction => ({
    type: "LOAD_FORM",
    payload: form,
  }),
  updateFormSettings: (settings: Partial<FormData>): FormBuilderAction => ({
    type: "UPDATE_FORM_SETTINGS",
    payload: settings,
  }),
  addField: (field: FormField): FormBuilderAction => ({
    type: "ADD_FIELD",
    payload: field,
  }),
  updateField: (field: FormField): FormBuilderAction => ({
    type: "UPDATE_FIELD",
    payload: field,
  }),
  removeField: (fieldId: string): FormBuilderAction => ({
    type: "REMOVE_FIELD",
    payload: fieldId,
  }),
  reorderFields: (fields: FormField[]): FormBuilderAction => ({
    type: "REORDER_FIELDS",
    payload: fields,
  }),
  selectField: (fieldId: string | null): FormBuilderAction => ({
    type: "SELECT_FIELD",
    payload: fieldId,
  }),
  saveForm: (): FormBuilderAction => ({ type: "SAVE_FORM" }),
  newForm: (): FormBuilderAction => ({ type: "NEW_FORM" }),
};