import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { FormData } from "~/lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "My Forms - FormCraft" },
    { name: "description", content: "Manage your created forms." },
  ];
};

export default function Forms() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load forms from localStorage
    const loadForms = () => {
      try {
        const savedForms = localStorage.getItem('formcraft_forms');
        if (savedForms) {
          setForms(JSON.parse(savedForms));
        }
      } catch (error) {
        console.error('Error loading forms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  const deleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      const updatedForms = forms.filter(form => form.id !== formId);
      setForms(updatedForms);
      localStorage.setItem('formcraft_forms', JSON.stringify(updatedForms));
    }
  };

  const duplicateForm = (form: FormData) => {
    const newForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedForms = [...forms, newForm];
    setForms(updatedForms);
    localStorage.setItem('formcraft_forms', JSON.stringify(updatedForms));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
              <p className="text-gray-600 mt-1">Manage your created forms</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/builder"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Form
              </Link>
              <Link
                to="/"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {forms.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first form</p>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Form
            </Link>
          </div>
        ) : (
          /* Forms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Form Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {form.title || 'Untitled Form'}
                    </h3>
                    {form.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                    )}
                  </div>
                  
                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={(e) => {
                        const menu = e.currentTarget.nextElementSibling as HTMLElement;
                        menu?.classList.toggle('hidden');
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    <div className="hidden absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                      <Link
                        to={`/builder?formId=${form.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/forms/${form.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => duplicateForm(form)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Duplicate
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => deleteForm(form.id!)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {form.fields.length} fields
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {form.updatedAt ? formatDate(form.updatedAt) : 'Recently'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/builder?formId=${form.id}`}
                    className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/forms/${form.id}`}
                    className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/forms/${form.id}`;
                      navigator.clipboard.writeText(url);
                      alert('Form link copied to clipboard!');
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    title="Copy form link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}