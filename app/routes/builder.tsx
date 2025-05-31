import type { MetaFunction } from "@remix-run/node";
import { FormBuilderProvider } from "~/lib/formBuilderContext";
import { FieldLibrary } from "~/components/FormBuilder/FieldLibrary";
import { CanvasArea } from "~/components/FormBuilder/CanvasArea";
import { PropertyPanel } from "~/components/FormBuilder/PropertyPanel";
import { PreviewPanel } from "~/components/FormBuilder/PreviewPanel";
import { Toolbar } from "~/components/FormBuilder/Toolbar";
import { useState } from "react";
import type { FieldType } from "~/lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Builder - FormCraft" },
    { name: "description", content: "Build beautiful, responsive forms with our drag-and-drop form builder." },
  ];
};

export default function Builder() {
  const [showPreview, setShowPreview] = useState(false);
  const [draggedFieldType, setDraggedFieldType] = useState<FieldType | null>(null);

  const handleFieldDragStart = (fieldType: FieldType) => {
    setDraggedFieldType(fieldType);
  };

  return (
    <FormBuilderProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">FormCraft Builder</h1>
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
