import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user/files');
      setFiles(response.data.files || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axios.get(`/api/user/download/${fileId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage('Download failed');
    }
  };

  const handleDecrypt = async (fileId) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`/api/user/decrypt/${fileId}`);
      setMessage(response.data.message);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Decryption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          👤 User Dashboard
        </h2>
        
        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📁 Available Files</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <span className="loading"></span>
              <p style={{ marginTop: '10px', color: '#666' }}>Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>📭 No files available</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Files will appear here once an admin uploads and encrypts them.
              </p>
            </div>
          ) : (
            <ul className="file-list">
              {files.map((file) => (
                <li key={file._id} className="file-item">
                  <div className="file-name">📄 {file.originalName}</div>
                  <div className="file-date">
                    Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      onClick={() => handleDownload(file._id, file.originalName)}
                      className="btn"
                      style={{ marginRight: '10px' }}
                    >
                      📥 Download
                    </button>
                    <button 
                      onClick={() => handleDecrypt(file._id)}
                      className="btn"
                      disabled={loading}
                    >
                      🔓 Decrypt
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>🔓 Decryption Process</h3>
          <ol style={{ paddingLeft: '20px', color: '#666' }}>
            <li style={{ marginBottom: '8px' }}>Retrieve encrypted file from MongoDB</li>
            <li style={{ marginBottom: '8px' }}>Decrypt AES key using RSA private key</li>
            <li style={{ marginBottom: '8px' }}>Decrypt file content using AES-256-GCM</li>
            <li style={{ marginBottom: '8px' }}>Verify file integrity with authentication tag</li>
            <li style={{ marginBottom: '8px' }}>Provide decrypted file for download</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 