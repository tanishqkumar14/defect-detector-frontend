import React, { useState } from 'react';
import './App.css';
import tataLogo from './assets/tata.png';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError('');
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
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
        throw new Error('Server error. Please try again.');
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
      <nav className="navbar">
        <img src={tataLogo} alt="Tata Steel Logo" className="navbar-logo" />
        <h2 className="navbar-title">Steel Defect Detector</h2>
      </nav>

      <div className="content">
        <div className="header">
          <h1>Steel Surface Defect Detector</h1>
        </div>

        <div className="project-info">
          <p><strong>Organization:</strong> Tata Steel Ltd.</p>
          <p><strong>Department:</strong> SNTI</p>
          <p><strong>Mentor:</strong> Suman Kumari Ma’am</p>
          <p><strong>VT ID:</strong> VT20254749</p>
          <p className="note">This project was part of an internship assignment by Tata Steel under the mentorship of Suman Kumari Ma’am.</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-section">
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button type="submit" disabled={loading}>Submit</button>
        </form>

        {previewUrl && <img src={previewUrl} alt="Preview" className="preview-image" />}

        {loading && <p className="loading">Loading prediction...</p>}
        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result">
            <h3>Prediction Result:</h3>
            <p><strong>Defect:</strong> {result.defect}</p>
            <p><strong>Confidence:</strong> {result.confidence}%</p>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2025 Tata Steel Internship Project | Built by Tanishq Kumar</p>
      </footer>
    </div>
  );
}

export default App;
