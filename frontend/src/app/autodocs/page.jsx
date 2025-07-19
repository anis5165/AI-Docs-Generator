'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "@/components/fileUpload";
import CodeBlock from "@/components/syntaxHilighter";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDoc, setActiveDoc] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/docs");
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


  const router = useRouter();
  
  

  const handleDeleteDocs = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/docs/${id}`);
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

  useEffect(() => {
    if(!localStorage.getItem('token')) {
      toast.error("Please login to continue", {
        icon: '🚫',
      });
      router.push('/login');
      return; 
    }

    fetchDocs();
    // eslint-disable-next-line
  }, []);

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
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html: section.content
                    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-indigo-400 mt-5 mb-2">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-indigo-300 mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
                    .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
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
      <div className="py-8 mx-auto max-w-5xl mb-10">
        <div className="px-8 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
            CodocAI
          </h1>
          <p className="text-[#3F474E] text-lg mb-2">
            Upload your code files and let AI create beautiful documentation for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <FileUpload onUploadSuccess={fetchDocs} />
        </div>

        {loading ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3f474e]"></div>
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center my-16 p-8 bg-[#16181a] rounded-xl shadow-lg border border-[#3f474e]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-2xl font-bold text-white">No documentation yet</h3>
            <p className="mt-2 text-indigo-300">Upload a code file to generate your first documentation</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-[#16181a] rounded-xl shadow-lg p-6 h-fit border border-[#3f474e]">
              <h2 className="font-bold text-xl mb-4 text-indigo-200 border-b border-indigo-700 pb-2">Documents</h2>
              <ul className="space-y-3">
                {docs.map((doc) => (
                  <li key={doc._id}>
                    <button
                      onClick={() => setActiveDoc(doc._id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-[#23272b] ${
                        activeDoc === doc._id
                          ? "bg-[#3f474e] border-l-4 border-indigo-500 font-semibold text-indigo-100"
                          : "text-indigo-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {doc.filename}
                      </div>
                      <div>
                        
                      </div>
                      <div className="text-xs text-indigo-400 mt-1">
                        <button onClick={() => handleDeleteDocs(doc._id)} className="mr-5 hover:text-red-900">Delete</button>
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              {activeDoc && (
                <div className="bg-[#16181a] text-[#7f8b95] rounded-xl shadow-lg overflow-hidden border border-[#3f474e]">
                  {docs.filter(doc => doc._id === activeDoc).map((doc) => (
                    <div key={doc._id}>
                      <div className="bg-[#23272b ] p-5 border-b border-[#3f474e]">
                        <h3 className="font-bold text-2xl text-indigo-300">
                          {doc.filename}
                        </h3>
                        <p className="text-sm text-indigo-400 mt-1">
                          Generated on {new Date(doc.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="prose max-w-none prose-invert">
                          {renderDocContent(doc.content)}
                        </div>
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
