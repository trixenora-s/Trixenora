import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Upload.css';

function Upload({ user }) {
  const [uploadType, setUploadType] = useState('game');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    platforms: [],
    category: '',
    genre: '',
    version: '1.0.0'
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        platforms: checked
          ? [...prev.platforms, value]
          : prev.platforms.filter(p => p !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();

    if (uploadType === 'game') {
      formDataObj.append('title', formData.title);
      formDataObj.append('platforms', JSON.stringify(formData.platforms));
      formDataObj.append('genre', formData.genre);
    } else {
      formDataObj.append('name', formData.name);
      formDataObj.append('category', formData.category);
    }

    formDataObj.append('description', formData.description);
    formDataObj.append('version', formData.version);
    formDataObj.append('file', file);
    if (thumbnail) formDataObj.append('thumbnail', thumbnail);

    try {
      const endpoint = uploadType === 'game' ? '/api/games/upload' : '/api/ai-tools/upload';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataObj
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Upload failed');
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload New Content</h1>

        <div className="upload-type-selector">
          <button
            className={`type-btn ${uploadType === 'game' ? 'active' : ''}`}
            onClick={() => setUploadType('game')}
          >
            Game
          </button>
          <button
            className={`type-btn ${uploadType === 'ai-tool' ? 'active' : ''}`}
            onClick={() => setUploadType('ai-tool')}
          >
            AI Tool
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}

          {uploadType === 'game' ? (
            <>
              <div className="form-group">
                <label>Game Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Platforms *</label>
                <div className="checkboxes">
                  {['android', 'ios', 'mac', 'windows', 'linux'].map(platform => (
                    <label key={platform}>
                      <input
                        type="checkbox"
                        name="platforms"
                        value={platform}
                        checked={formData.platforms.includes(platform)}
                        onChange={handleChange}
                      />
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="">Select a genre</option>
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="puzzle">Puzzle</option>
                  <option value="strategy">Strategy</option>
                  <option value="rpg">RPG</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Tool Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  <option value="image-generation">Image Generation</option>
                  <option value="text-generation">Text Generation</option>
                  <option value="video-generation">Video Generation</option>
                  <option value="code-generation">Code Generation</option>
                  <option value="data-analysis">Data Analysis</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Version</label>
            <input
              type="text"
              name="version"
              value={formData.version}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="form-group">
            <label>Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
