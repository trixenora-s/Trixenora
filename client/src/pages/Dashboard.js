import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!dashboardData) return <div className="error">Failed to load dashboard</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {dashboardData.user.displayName || dashboardData.user.username}!</h1>
        <Link to="/upload" className="btn btn-primary">Upload New Content</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{dashboardData.gameStats.total}</h3>
          <p>Games Uploaded</p>
          <small>{dashboardData.gameStats.published} published</small>
        </div>
        <div className="stat-box">
          <h3>{dashboardData.gameStats.totalDownloads}</h3>
          <p>Game Downloads</p>
        </div>
        <div className="stat-box">
          <h3>{dashboardData.toolStats.total}</h3>
          <p>AI Tools</p>
          <small>{dashboardData.toolStats.released} released</small>
        </div>
        <div className="stat-box">
          <h3>{dashboardData.toolStats.totalDownloads}</h3>
          <p>Tool Downloads</p>
        </div>
      </div>

      <div className="content-sections">
        <section className="content-section">
          <h2>Your Games</h2>
          {dashboardData.recentGames.length === 0 ? (
            <p className="empty-state">No games uploaded yet. <Link to="/upload">Upload your first game</Link></p>
          ) : (
            <div className="content-list">
              {dashboardData.recentGames.map(game => (
                <div key={game._id} className="content-item">
                  <Link to={`/games/${game._id}`}>
                    <h3>{game.title}</h3>
                  </Link>
                  <p>{game.platforms?.join(', ')}</p>
                  <span className="badge">{game.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="content-section">
          <h2>Your AI Tools</h2>
          {dashboardData.recentTools.length === 0 ? (
            <p className="empty-state">No AI tools uploaded yet. <Link to="/upload">Upload your first tool</Link></p>
          ) : (
            <div className="content-list">
              {dashboardData.recentTools.map(tool => (
                <div key={tool._id} className="content-item">
                  <Link to={`/ai-tools/${tool._id}`}>
                    <h3>{tool.name}</h3>
                  </Link>
                  <p>{tool.category}</p>
                  <span className="badge">{tool.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
