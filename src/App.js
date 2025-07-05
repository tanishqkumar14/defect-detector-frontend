import React, { useState } from 'react';
import './App.css';
import tataLogo from './assets/tata.png';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://tanishq89-defect-detector-hf.hf.space/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <img src={tataLogo} alt="Tata Steel Logo" className="logo" />
      <h1>Steel Surface Defect Detector</h1>

      <p className="subtext">
        This project was part of an internship assignment by Tata Steel under the mentorship of <strong>Suman Kumari Ma’am</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Detect Defect'}
        </button>
      </form>

      {preview && (
        <div className="preview">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Uploaded Preview" />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>Prediction Result:</h3>
          <p><strong>Defect Type:</strong> {result.defect}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
