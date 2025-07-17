'use client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, code }) => {
  return (
    <div className="my-4 rounded-lg overflow-hidden">
      <div className="bg-gray-800 text-gray-200 text-xs py-1 px-3 flex justify-between items-center">
        <span>{language}</span>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(code);
            // Optional: Show a toast notification
          }}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
      <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: '0' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;