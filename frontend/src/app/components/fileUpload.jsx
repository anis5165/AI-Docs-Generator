'use client';
import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");
      
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
      
        try {
          const response = await axios.post("http://localhost:5000/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          if (response.data && response.data.data) {
            // Success toast instead of alert
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Documentation</h2>
            
            <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-300 hover:border-indigo-400"
                } transition-all duration-200 ease-in-out`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    
                    <div className="text-gray-500">
                        {file ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">{file.name}</span>
                                <button 
                                    onClick={() => setFile(null)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="mb-2">Drag and drop a code file, or click to select</p>
                                <p className="text-sm">
                                    Supported formats: 
                                    {acceptedExtensions.join(', ')}
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
                            className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-md font-medium transition-colors"
                        >
                            {file ? "Choose Another File" : "Select File"}
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`flex items-center justify-center px-5 py-2 rounded-md text-white font-medium transition-all ${
                        !file || loading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Generate Documentation
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;