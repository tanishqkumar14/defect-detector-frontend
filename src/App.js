import React, { useState } from 'react';
import './App.css';
import tataLogo from './assets/tata.png';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

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

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setPreviewUrl(null);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <img src={tataLogo} alt="Tata Steel Logo" className="navbar-logo" />
        <h2 className="navbar-title">Steel Defect Detector</h2>
      </nav>

      <div className="container">
        <h1>Steel Surface Defect Detector</h1>

        <div className="project-info">
          <p><strong>Organization:</strong> Tata Steel Ltd.</p>
          <p><strong>Department:</strong> SNTI</p>
          <p><strong>Mentor:</strong> Suman Kumari Ma’am</p>
          <p><strong>VT ID:</strong> VT20254749</p>
          <p className="note">
            <em>This project was part of an internship assignment by Tata Steel under the mentorship of Suman Kumari Ma’am.</em>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-section">
          <label htmlFor="file-upload" className="file-upload">Upload Image</label>
          <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" hidden />
          <div className="btn-group">
            <button type="submit" disabled={loading}>{loading ? '⏳ Predicting...' : 'Submit'}</button>
            <button type="button" onClick={handleReset}>Reset</button>
            <button type="button" onClick={() => setShowAbout(!showAbout)}>{showAbout ? 'Hide Info' : 'About'}</button>
          </div>
        </form>

        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="preview-image" />
        )}

        {loading && <div className="loader"></div>}

        {error && <p className="error">❌ {error}</p>}

        {result && (
          <div className="result">
            <h3>Prediction Result:</h3>
            <p><strong>Defect:</strong> {result.defect}</p>
            <p><strong>Confidence:</strong> {result.confidence}%</p>
          </div>
        )}

        {showAbout && (
          <div className="about-box">
            <h2>About This Project</h2>
            <p>This web app detects steel surface defects using a deep learning model trained on the NEU dataset. Built using TensorFlow, Flask, and React, and deployed via Hugging Face and Vercel.</p>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; 2025 Tata Steel Internship Project | Built by Tanishq Kumar
      </footer>
    </div>
  );
}

export default App;
