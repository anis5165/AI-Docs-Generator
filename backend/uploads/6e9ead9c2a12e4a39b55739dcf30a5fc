'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Portfolio from './portfolio/page';
import Portfolio2 from './portfolio2/page';
import Portfolio3 from './portfolio3/page';

const Page = () => {
  const [file, setFile] = useState(null);   //check is file upload or not
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('Portfolio');

  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    const savedData = localStorage.getItem('extractedData');
    if (savedData) {
      setPortfolioData(JSON.parse(savedData));
    }
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    axios.post('http://localhost:5000/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((result) => {
        if (result.data && typeof result.data === 'object') {
          setResponse(result.data);
          setPortfolioData(result.data);
          localStorage.setItem('extractedData', JSON.stringify(result.data));
        } else {
          throw new Error('Invalid response format from server');
        }
      })
      .catch((error) => {
        console.log('Error:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Failed to process PDF');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openPortfolioInNewTab = () => {
    const templateUrls = {
      Portfolio: '/portfolio',
      Portfolio2: '/portfolio2',
      Portfolio3: '/portfolio3',
    };
    window.open(templateUrls[selectedTemplate], '_blank');
  };

  const switchTemplate = () => {
    const templates = ['Portfolio', 'Portfolio2', 'Portfolio3'];
    const currentIndex = templates.indexOf(selectedTemplate);
    const newTemplate = templates[(currentIndex + 1) % templates.length];

    setSelectedTemplate(newTemplate);
    localStorage.setItem('selectedTemplate', newTemplate);
  };

  return (
    <div className='p-10'>
      <h1>Upload PDF</h1>
      <form onSubmit={handleSubmit} className='pb-5'>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit" className='bg-slate-600 px-4 py-2 rounded-lg text-white' disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {response && (
        <div>
          <h2 className='text-2xl'>Structured Data:</h2>
          {portfolioData && (
            <div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={switchTemplate}
              >
                Switch Template
              </button>
              <button onClick={openPortfolioInNewTab} className='mt-3 ml-24 mb-5 bg-neutral-700 px-4 py-2 rounded-lg text-white'>
                Open Portfolio in New Tab
              </button>

              {selectedTemplate === 'Portfolio' && <Portfolio portfolioData={portfolioData} />}
              {selectedTemplate === 'Portfolio2' && <Portfolio2 portfolioData={portfolioData} />}
              {selectedTemplate === 'Portfolio3' && <Portfolio3 portfolioData={portfolioData} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
