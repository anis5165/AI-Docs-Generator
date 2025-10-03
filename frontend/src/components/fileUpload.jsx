'use client';
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

const FileUpload = ({ onUploadSuccess, userId }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { data: session } = useSession();
    if (session) {
        var useremail = session.user?.email
    }

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        if (useremail == null){
            formData.append("userId", userId); // <-- Add userId here
        }
        else{
            formData.append("userId", useremail); // <-- Add userId here
        }

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          if (response.data && response.data.data) {
            onUploadSuccess();
            setFile(null);
          } else {
            alert("Upload successful but no documentation was generated");
          }
        } catch (error) {
          console.error("Upload failed", error);
          const errorMessage = error.response?.data?.error || error.message || "Unknown error";
          alert(`Upload failed: ${errorMessage}`);
        }
        setLoading(false);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    // List of accepted file extensions
    const acceptedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.html', '.css'];

    return (
        <div className="bg-[#16181a] rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-[#3f474e]">
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Generate Documentation</h2>
                <div className="bg-indigo-900/20 border border-indigo-800/50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-indigo-300 font-medium text-xs sm:text-sm">Enhanced AI Documentation</span>
                    </div>
                    <p className="text-indigo-200 text-xs">
                        Now generates structured documentation with sections, dependencies, function details, and usage examples
                    </p>
                </div>
            </div>
            
            <div 
                className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center ${
                    dragActive 
                        ? "border-indigo-500 bg-[#23272b]" 
                        : "border-[#3f474e] hover:border-indigo-400 bg-[#16181a]"
                } transition-all duration-200 ease-in-out`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    
                    <div className="text-slate-200">
                        {file ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium text-slate-100 text-sm sm:text-base truncate max-w-xs">{file.name}</span>
                                <button 
                                    onClick={() => setFile(null)}
                                    className="text-red-400 hover:text-red-600 flex-shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="mb-2 text-indigo-300 text-sm sm:text-base">Drag and drop a code file, or click to select</p>
                                <p className="text-xs sm:text-sm text-indigo-400">
                                    Supported: {acceptedExtensions.join(', ')}
                                </p>
                            </>
                        )}
                    </div>
                    
                    <div>
                        <input 
                            type="file" 
                            id="fileInput"
                            onChange={(e) => setFile(e.target.files[0])} 
                            className="hidden"
                            accept={acceptedExtensions.join(',')}
                        />
                        <label 
                            htmlFor="fileInput"
                            className="cursor-pointer inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-[#3f474e] text-white hover:bg-indigo-700 rounded-md font-medium transition-colors text-sm sm:text-base"
                        >
                            {file ? "Choose Another File" : "Select File"}
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg text-white font-semibold transition-all text-sm sm:text-base ${
                        !file || loading 
                            ? "bg-[#3f474e] opacity-60 cursor-not-allowed" 
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Processing...</span>
                            <span className="sm:hidden">...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="hidden sm:inline">Generate Structured Docs</span>
                            <span className="sm:hidden">Generate</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;