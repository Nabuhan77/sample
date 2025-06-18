import React, { useState, useRef } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Please select files to upload');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('uploaded_file', file);
      });

      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Files uploaded successfully!');
      setUploadedFiles(prev => [...prev, ...selectedFiles.map(f => f.name)]);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (uploadedFiles.length === 0) {
      setMessage('No files available for encryption');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/admin/encrypt', {
        files: uploadedFiles
      });

      setMessage(response.data.message);
      setUploadedFiles([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          👨‍💼 Admin Dashboard
        </h2>
        
        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📁 File Upload</h3>
          
          <div
            className="upload-area"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <p style={{ marginBottom: '10px', color: '#666' }}>
              📎 Click to select files or drag and drop here
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              Supported formats: All file types
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="file-input"
          />

          {selectedFiles.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Selected Files:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {selectedFiles.map((file, index) => (
                  <li key={index} style={{ padding: '5px 0', color: '#666' }}>
                    📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
              <button onClick={handleUpload} className="btn" disabled={loading}>
                {loading ? <span className="loading"></span> : 'Upload Files'}
              </button>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="card">
            <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 Uploaded Files</h3>
            <ul className="file-list">
              {uploadedFiles.map((filename, index) => (
                <li key={index} className="file-item">
                  <div className="file-name">📄 {filename}</div>
                </li>
              ))}
            </ul>
            <button onClick={handleEncrypt} className="btn" disabled={loading}>
              {loading ? <span className="loading"></span> : '🔐 Encrypt Files'}
            </button>
          </div>
        )}

        <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>🔒 Encryption Process</h3>
          <ol style={{ paddingLeft: '20px', color: '#666' }}>
            <li style={{ marginBottom: '8px' }}>Upload files to the server</li>
            <li style={{ marginBottom: '8px' }}>Generate RSA key pair (2048-bit)</li>
            <li style={{ marginBottom: '8px' }}>Generate AES key using quantum random numbers</li>
            <li style={{ marginBottom: '8px' }}>Encrypt files with AES-256-GCM</li>
            <li style={{ marginBottom: '8px' }}>Encrypt AES key with RSA public key</li>
            <li style={{ marginBottom: '8px' }}>Store encrypted data in MongoDB</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 