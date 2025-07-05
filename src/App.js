import React, { useState } from 'react';
import './App.css';
import tataLogo from './assets/tata.png';
import upesLogo from './assets/upes.png';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

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
      const response = await fetch(
        'https://tanishq89-defect-detector-hf.hf.space/predict',
        {
          method: 'POST',
          body: formData,
        }
      );

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
      <header>
        <img src={tataLogo} alt="Tata Steel" className="logo" />
        <img src={upesLogo} alt="UPES" className="logo" />
      </header>

      <h1>Steel Surface Defect Detector</h1>
      <p className="subtitle">
        Internship project assigned by Tata Steel during my internship, mentored by Suman Kumari Ma'am.
      </p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {preview && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" />
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>Prediction Result:</h3>
          <p><strong>Defect:</strong> {result.defect}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
