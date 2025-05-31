import { useFormBuilder } from "~/lib/formBuilderContext";
import { FieldRenderer } from "~/components/FieldRenderer";
import { useState } from "react";

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const viewportSizes = {
  desktop: { width: '100%', maxWidth: 'none' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' }
};

const viewportIcons = {
  desktop: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  tablet: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  mobile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
};

export function PreviewPanel() {
  const { state } = useFormBuilder();
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Form Preview</h2>
          
          {/* Viewport Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">View:</span>
            {(Object.keys(viewportSizes) as ViewportMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewportMode(mode)}
                className={`p-2 rounded-md transition-colors ${
                  viewportMode === mode
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
              >
                {viewportIcons[mode]}
              </button>
            ))}
          </div>
        </div>

        {/* Form Info */}
        <div className="mt-2 text-sm text-gray-600">
          {state.form.title && (
            <div>
              <span className="font-medium">Title:</span> {state.form.title}
            </div>
          )}
          <div>
            <span className="font-medium">Fields:</span> {state.form.fields.length}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300"
            style={{
              width: viewportSizes[viewportMode].width,
              maxWidth: viewportSizes[viewportMode].maxWidth,
              minHeight: '500px'
            }}
          >
            <div className="p-6">
              {/* Form Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {state.form.title || 'Untitled Form'}
                </h1>
                {state.form.description && (
                  <p className="text-gray-600">{state.form.description}</p>
                )}
              </div>

              {/* Form Fields */}
              {state.form.fields.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No fields added yet</p>
                  <p className="text-sm text-gray-400">Drag fields from the library to start building your form</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {state.form.fields.map((field) => (
                    <FieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.id] || ''}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      mode="preview"
                    />
                  ))}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Info */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="text-center text-sm text-gray-500">
          {viewportMode === 'desktop' && 'Desktop view (responsive)'}
          {viewportMode === 'tablet' && 'Tablet view (768px)'}
          {viewportMode === 'mobile' && 'Mobile view (375px)'}
        </div>
      </div>
    </div>
  );
}