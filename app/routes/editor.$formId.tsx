import { useEffect } from "react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { FormBuilderProvider } from "~/lib/formBuilderContext";
import { FieldLibrary } from "~/components/FormBuilder/FieldLibrary";
import { CanvasArea } from "~/components/FormBuilder/CanvasArea";
import { PropertyPanel } from "~/components/FormBuilder/PropertyPanel";
import { PreviewPanel } from "~/components/FormBuilder/PreviewPanel";
import { Toolbar } from "~/components/FormBuilder/Toolbar";
import { useState } from "react";
import type { FieldType } from "~/lib/types";
import { safelyRetrieveForm, debugLog, inspectLocalStorageForms } from "~/lib/debug";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.formTitle ? `Edit: ${data?.formTitle} - FormCraft` : "Edit Form - FormCraft" },
    { name: "description", content: "Edit your form with our drag-and-drop form builder." },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { formId } = params;
  
  if (!formId) {
    throw new Response("Form ID is required", { status: 400 });
  }

  // In a real app, you'd fetch from a database
  // For now, we'll just return the formId for client-side loading
  return { formId, formTitle: `Form ${formId}` };
}

export default function Editor() {
  const { formId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [draggedFieldType, setDraggedFieldType] = useState<FieldType | null>(null);
  const [formLoaded, setFormLoaded] = useState(false);

  const handleFieldDragStart = (fieldType: FieldType) => {
    setDraggedFieldType(fieldType);
  };

  // Run form inspection on load
  useEffect(() => {
    inspectLocalStorageForms("editor.$formId.mount");
    
    // Check if the form exists
    const form = safelyRetrieveForm(formId as string, "editor.$formId.checkExistence");
    if (!form) {
      debugLog("editor.$formId", "Form not found, redirecting to builder");
      navigate("/builder");
      return;
    }
    
    setFormLoaded(true);
  }, [formId, navigate]);

  if (!formLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form editor...</p>
        </div>
      </div>
    );
  }

  return (
    <FormBuilderProvider initialFormId={formId}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">FormCraft Editor</h1>
            </div>
            <Toolbar onTogglePreview={() => setShowPreview(!showPreview)} showPreview={showPreview} />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {!showPreview ? (
            <>
              {/* Left Sidebar - Field Library */}
              <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                <FieldLibrary onFieldDragStart={handleFieldDragStart} />
              </aside>

              {/* Main Canvas Area */}
              <main className="flex-1 flex">
                <div className="flex-1 overflow-auto">
                  <CanvasArea draggedFieldType={draggedFieldType} />
                </div>
              </main>

              {/* Right Sidebar - Property Panel */}
              <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                <PropertyPanel />
              </aside>
            </>
          ) : (
            /* Preview Mode */
            <main className="flex-1">
              <PreviewPanel />
            </main>
          )}
        </div>
      </div>
    </FormBuilderProvider>
  );
}
