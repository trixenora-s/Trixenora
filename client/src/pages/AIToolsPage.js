import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AIToolsPage.css';

function AIToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    fetchTools();
  }, [filters]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/ai-tools?${params}`);
      const data = await response.json();
      setTools(data);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="ai-tools-page">
      <div className="tools-container">
        <div className="filters">
          <h3>Filters</h3>
          <input
            type="text"
            name="search"
            placeholder="Search AI tools..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="image-generation">Image Generation</option>
            <option value="text-generation">Text Generation</option>
            <option value="video-generation">Video Generation</option>
            <option value="code-generation">Code Generation</option>
            <option value="data-analysis">Data Analysis</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="tools-grid">
          {loading ? (
            <div className="loading">Loading tools...</div>
          ) : tools.length === 0 ? (
            <div className="no-results">No AI tools found</div>
          ) : (
            tools.map(tool => (
              <Link to={`/ai-tools/${tool._id}`} key={tool._id} className="tool-card">
                {tool.thumbnail && <img src={tool.thumbnail} alt={tool.name} />}
                <div className="tool-info">
                  <h3>{tool.name}</h3>
                  <p className="creator">{tool.creator?.username}</p>
                  <p className="category">{tool.category}</p>
                  <div className="meta">
                    <span className="rating">⭐ {tool.rating}</span>
                    <span className="downloads">⬇ {tool.downloads}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AIToolsPage;
