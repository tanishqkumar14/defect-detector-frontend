import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError('');

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
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
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Steel Surface Defect Detector</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>

      {preview && (
        <div style={{ marginTop: '20px' }}>
          <h3>Image Preview:</h3>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      {loading && <p style={{ marginTop: '20px' }}>Loading prediction...</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Prediction Result:</h3>
          <p><strong>Defect:</strong> {result.defect}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
