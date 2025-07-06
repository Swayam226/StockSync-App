import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        setCsvData(rows);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      alert('Please upload a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      setProgress(20);
      await axios.post('http://localhost:5000/api', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      setProgress(100);
      console.log('✅ Backend processing completed.');

      // Navigate to dashboard AFTER backend processing
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Upload failed:', error);
      setProgress(0);
      alert('Upload failed. See console for details.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-green-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Supply Chain Dashboard Upload</h1>

        <div className="mb-6">
          <label htmlFor="csvUpload" className="block text-gray-700 text-sm font-bold mb-2">
            Upload CSV
          </label>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {csvData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Preview</h2>
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-200">
                    {csvData[0].map((header, index) => (
                      <th key={index} className="py-2 px-4 border-b">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-4 border-b">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!csvFile}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6 w-full sm:w-auto"
        >
          Submit
        </button>

        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
