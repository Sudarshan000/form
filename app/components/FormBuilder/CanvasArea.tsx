import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField, FieldType } from '~/lib/types';
import { FieldRenderer } from '~/components/FieldRenderer';
import { useFormBuilder, formBuilderActions } from '~/lib/formBuilderContext';
import { createDefaultField, generateId } from '~/lib/utils';

interface CanvasAreaProps {
  draggedFieldType: FieldType | null;
}

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const SortableField: React.FC<SortableFieldProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 cursor-move"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-8 p-1 text-gray-400 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Field Renderer */}
      <FieldRenderer
        field={field}
        mode="builder"
        disabled
      />

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Selected
          </div>
        </div>
      )}
    </div>
  );
};

export const CanvasArea: React.FC<CanvasAreaProps> = ({ draggedFieldType }) => {
  const { state, dispatch } = useFormBuilder();
  const [dragOverlay, setDragOverlay] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = state.currentForm?.fields.findIndex(field => field.id === active.id);
      const newIndex = state.currentForm?.fields.findIndex(field => field.id === over?.id);

      if (oldIndex !== undefined && newIndex !== undefined && state.currentForm) {
        const newFields = arrayMove(state.currentForm.fields, oldIndex, newIndex);
        dispatch(formBuilderActions.reorderFields(newFields));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverlay(false);

    if (draggedFieldType) {
      const defaultField = createDefaultField(draggedFieldType);
      const newField: FormField = {
        ...defaultField,
        id: generateId(),
        order: state.currentForm?.fields.length || 0,
      };

      dispatch(formBuilderActions.addField(newField));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverlay(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverlay(false);
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    dispatch(formBuilderActions.selectField(fieldId));
  };

  const handleFieldDelete = (fieldId: string) => {
    dispatch(formBuilderActions.removeField(fieldId));
  };

  if (!state.currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Form Header */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <input
            type="text"
            value={state.currentForm.title}
            onChange={(e) => dispatch(formBuilderActions.updateFormInfo({ title: e.target.value }))}
            className="text-2xl font-bold text-gray-900 border-none outline-none w-full bg-transparent"
            placeholder="Form Title"
          />
          <textarea
            value={state.currentForm.description || ''}
            onChange={(e) => dispatch(formBuilderActions.updateFormInfo({ description: e.target.value }))}
            className="mt-2 text-gray-600 border-none outline-none w-full bg-transparent resize-none"
            placeholder="Form description (optional)"
            rows={2}
          />
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            min-h-[400px] border-2 border-dashed rounded-lg transition-all duration-200
            ${dragOverlay 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-white'
            }
          `}
        >
          {state.currentForm.fields.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No fields yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop fields from the library to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={state.currentForm.fields.map(field => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {state.currentForm.fields.map((field) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        isSelected={state.selectedFieldId === field.id}
                        onSelect={() => handleFieldSelect(field.id)}
                        onDelete={() => handleFieldDelete(field.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Submit Button Preview */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            disabled
          >
            {state.currentForm.settings.submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
