'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "@/components/fileUpload";
import CodeBlock from "@/components/syntaxHilighter";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAppContext } from "@/context/appcontext";

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const { user } = useAppContext(); // JWT user
  const { data: session } = useSession(); // NextAuth user

  // Get userId from JWT or NextAuth
  const userId = user?.id || session?.user?.email;

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/docs/user/${userId}`);
      setDocs(data);
      if (data.length > 0 && !activeDoc) {
        setActiveDoc(data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch docs", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocById = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/docs/${id}`);
      setActiveDoc(id);
      // Optionally, update docs state if you want to show only the selected doc
      // setDocs([data]);
      // Or just store the fetched doc in a separate state if needed
    } catch (error) {
      toast.error("Failed to fetch document");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteDocs = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete/docs/${id}`);
      setDocs(docs.filter(doc => doc._id !== id));
      fetchDocs(); // Refresh the list after deletion
      // setActiveDoc(null); // Reset active doc if it was deleted
      toast.success("Documentation deleted successfully");
    }
    catch (error) {
      console.error("Failed to delete doc", error);
      alert("Error deleting documentation: " + error.response.data.error);
    }
  };

  // Download documentation as markdown file
  const downloadDocumentation = (doc) => {
    const filename = `${doc.filename.replace(/\.(js|jsx|ts|tsx|py|java|html|css)$/i, '')}_Documentation.md`;
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Documentation downloaded successfully!");
  };

  // Toggle edit mode
  const toggleEditMode = (docId) => {
    if (editingDocId === docId) {
      // Cancel editing
      setEditingDocId(null);
      setEditedContent('');
    } else {
      // Start editing
      const doc = docs.find(d => d._id === docId);
      if (doc) {
        setEditingDocId(docId);
        setEditedContent(doc.content);
      }
    }
  };

  // Save edited documentation
  const saveEditedDocumentation = async (docId) => {
    setSaving(true);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/docs/${docId}`, {
        content: editedContent
      });
      
      // Update local state
      setDocs(docs.map(doc => 
        doc._id === docId ? { ...doc, content: editedContent } : doc
      ));
      
      setEditingDocId(null);
      setEditedContent('');
      toast.success("Documentation updated successfully!");
    } catch (error) {
      console.error("Failed to update doc", error);
      toast.error("Failed to update documentation");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if(!session && !localStorage.getItem('token')) {
      toast.error("Please login to continue", {
        icon: '🚫',
      });
      router.push('/login');
      return; 
    }

    fetchDocs();
    // eslint-disable-next-line
  }, [session]);

  // Function to render documentation content with proper code highlighting
  const renderDocContent = (content) => {
    const sections = [];
    const lines = content.split('\n');
    let currentSection = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          sections.push({
            type: 'text',
            content: currentSection.join('\n')
          });
          sections.push({
            type: 'code',
            language: codeBlockLanguage,
            content: codeBlockContent
          });
          inCodeBlock = false;
          codeBlockContent = '';
          currentSection = [];
        } else {
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim() || 'plaintext';
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n';
      } else {
        currentSection.push(line);
      }
      if (index === lines.length - 1 && currentSection.length > 0) {
        sections.push({
          type: 'text',
          content: currentSection.join('\n')
        });
      }
    });

    return (
      <>
        {sections.map((section, index) => {
          if (section.type === 'code') {
            return <CodeBlock key={index} language={section.language} code={section.content.trim()} />;
          } else {
            return (
              <div
                key={index}
                className="mb-6"
                dangerouslySetInnerHTML={{
                  __html: section.content
                    // Main title
                    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-4 border-b border-indigo-600 pb-2">$1</h1>')
                    // Section headers
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-indigo-300 mt-8 mb-4 border-l-4 border-indigo-500 pl-4">$1</h2>')
                    // Subsection headers
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-indigo-200 mt-6 mb-3">$1</h3>')
                    // Function headers (#### )
                    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold text-indigo-100 mt-4 mb-2 bg-indigo-900/20 px-3 py-2 rounded border border-indigo-800">$1</h4>')
                    // Bold text
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-100">$1</strong>')
                    // Italic text
                    .replace(/\*(.*?)\*/g, '<em class="italic text-indigo-200">$1</em>')
                    // Code inline
                    .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">$1</code>')
                    // Lists with proper styling
                    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2 text-indigo-200 list-disc">$1</li>')
                    // Purpose, Parameters, Returns sections
                    .replace(/^- \*\*Purpose\*\*: (.*$)/gm, '<div class="ml-6 mb-2"><span class="font-semibold text-yellow-300">Purpose:</span> <span class="text-indigo-200">$1</span></div>')
                    .replace(/^- \*\*Parameters\*\*: (.*$)/gm, '<div class="ml-6 mb-2"><span class="font-semibold text-yellow-300">Parameters:</span> <span class="text-indigo-200">$1</span></div>')
                    .replace(/^- \*\*Returns\*\*: (.*$)/gm, '<div class="ml-6 mb-2"><span class="font-semibold text-yellow-300">Returns:</span> <span class="text-indigo-200">$1</span></div>')
                    .replace(/^- \*\*Usage\*\*: (.*$)/gm, '<div class="ml-6 mb-2"><span class="font-semibold text-yellow-300">Usage:</span> <span class="text-indigo-200">$1</span></div>')
                    // Nested parameter lists
                    .replace(/^  - \*\*(.*?)\*\* \((.*?)\): (.*$)/gm, '<div class="ml-8 mb-1"><span class="font-semibold text-cyan-300">$1</span> <span class="text-gray-400">($2)</span>: <span class="text-indigo-200">$3</span></div>')
                    // Horizontal rules
                    .replace(/^---$/gm, '<hr class="my-6 border-indigo-600">')
                }}
              />
            );
          }
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="py-4 sm:py-8 mx-auto max-w-5xl mb-6 sm:mb-10">
        <div className="px-4 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
            CodocAI
          </h1>
          <p className="text-[#3F474E] text-sm sm:text-base lg:text-lg mb-2 px-4">
            Upload your code files and let AI create beautiful documentation for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <FileUpload onUploadSuccess={fetchDocs} />
        </div>

        {loading ? (
          <div className="flex justify-center my-8 sm:my-16">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-4 border-b-4 border-[#3f474e]"></div>
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center my-8 sm:my-16 p-6 sm:p-8 bg-[#16181a] rounded-xl shadow-lg border border-[#3f474e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-xl sm:text-2xl font-bold text-white">No documentation yet</h3>
            <p className="mt-2 text-sm sm:text-base text-indigo-300 px-4">Upload a code file to generate your first documentation</p>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-1 bg-[#16181a] rounded-xl shadow-lg p-4 sm:p-6 h-fit border border-[#3f474e] order-2 lg:order-1">
              <h2 className="font-bold text-lg sm:text-xl mb-4 text-indigo-200 border-b border-indigo-700 pb-2">Documents</h2>
              <ul className="space-y-2 sm:space-y-3">
                {docs.map((doc) => (
                  <li key={doc._id} className="relative">
                    <div
                      onClick={() => fetchDocById(doc._id)}
                      className={`w-full text-left px-2 sm:px-3 py-2 rounded-md transition-colors hover:bg-[#23272b] cursor-pointer ${
                        activeDoc === doc._id
                          ? "bg-[#3f474e] border-l-4 border-indigo-500 font-semibold text-indigo-100"
                          : "text-indigo-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate text-xs sm:text-sm">{doc.filename}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocs(doc._id);
                          }}
                          className="ml-2 text-xs text-red-400 hover:text-red-900 px-1 sm:px-2 py-1 rounded flex-shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-xs text-indigo-400 mt-1">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              {activeDoc && (
                <div className="bg-[#16181a] text-[#7f8b95] rounded-xl shadow-lg overflow-hidden border border-[#3f474e]">
                  {docs.filter(doc => doc._id === activeDoc).map((doc) => (
                    <div key={doc._id}>
                      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 sm:p-6 border-b border-[#3f474e]">
                        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-white mb-2 truncate">
                              📄 {doc.filename.replace(/\.(js|jsx|ts|tsx|py|java|html|css)$/i, '')} Documentation
                            </h3>
                            <p className="text-xs sm:text-sm text-indigo-300">
                              Generated on {new Date(doc.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                ✓ AI Generated
                              </div>
                              <div className="bg-indigo-500/20 text-indigo-400 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                📋 Structured
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => downloadDocumentation(doc)}
                                className="flex items-center px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                                title="Download as Markdown file"
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="hidden sm:inline">Download</span>
                                <span className="sm:hidden">↓</span>
                              </button>
                              <button
                                onClick={() => toggleEditMode(doc._id)}
                                className={`flex items-center px-2 sm:px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors ${
                                  editingDocId === doc._id 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-yellow-600 hover:bg-yellow-700'
                                }`}
                                title={editingDocId === doc._id ? "Cancel editing" : "Edit documentation"}
                              >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {editingDocId === doc._id ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  )}
                                </svg>
                                <span className="hidden sm:inline">{editingDocId === doc._id ? 'Cancel' : 'Edit'}</span>
                                <span className="sm:hidden">{editingDocId === doc._id ? '✕' : '✏️'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 lg:p-8">
                        {editingDocId === doc._id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3 sm:p-4 mb-4">
                              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span className="text-yellow-300 font-semibold text-sm sm:text-base">Edit Mode</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => saveEditedDocumentation(doc._id)}
                                    disabled={saving}
                                    className="flex items-center px-2 sm:px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    {saving ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-1 sm:mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Saving...</span>
                                        <span className="sm:hidden">...</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="hidden sm:inline">Save</span>
                                        <span className="sm:hidden">✓</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => toggleEditMode(doc._id)}
                                    className="flex items-center px-2 sm:px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    <svg className="w-3 h-3 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="hidden sm:inline">Cancel</span>
                                    <span className="sm:hidden">✕</span>
                                  </button>
                                </div>
                              </div>
                              <p className="text-yellow-200 text-xs sm:text-sm mt-2">
                                Edit the markdown content below. Changes will be saved to the database.
                              </p>
                            </div>
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full h-64 sm:h-80 lg:h-96 p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 font-mono text-xs sm:text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Edit your documentation here..."
                            />
                          </div>
                        ) : (
                          // View Mode
                          <div className="prose max-w-none prose-invert prose-sm sm:prose-base lg:prose-lg">
                            <div className="bg-indigo-900/10 border border-indigo-800/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-indigo-300 font-semibold text-sm sm:text-base">Documentation Overview</span>
                              </div>
                              <p className="text-indigo-200 text-xs sm:text-sm">
                                This documentation was automatically generated using AI to provide comprehensive insights into your code structure, functionality, and usage patterns.
                              </p>
                            </div>
                            <div className="overflow-x-auto">
                              {renderDocContent(doc.content)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
