import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalGames: 0, totalTools: 0, totalDownloads: 0 });
  const [recentGames, setRecentGames] = useState([]);
  const [recentTools, setRecentTools] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentItems();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const gamesRes = await fetch('/api/games?limit=3');
      const toolsRes = await fetch('/api/ai-tools?limit=3');
      const games = await gamesRes.json();
      const tools = await toolsRes.json();
      setRecentGames(games);
      setRecentTools(tools);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Trixenora</h1>
          <p>Share, discover, and develop games and AI tools</p>
          <div className="hero-buttons">
            <Link to="/games" className="btn btn-primary">Explore Games</Link>
            <Link to="/ai-tools" className="btn btn-secondary">Discover AI Tools</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Active Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalGames}</h3>
          <p>Games Published</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalTools}</h3>
          <p>AI Tools</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalDownloads}</h3>
          <p>Total Downloads</p>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-column">
          <h2>Recent Games</h2>
          <div className="items-grid">
            {recentGames.map(game => (
              <Link to={`/games/${game._id}`} key={game._id} className="item-card">
                {game.thumbnail && <img src={game.thumbnail} alt={game.title} />}
                <h3>{game.title}</h3>
                <p className="platforms">{game.platforms?.join(', ')}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-column">
          <h2>Recent AI Tools</h2>
          <div className="items-grid">
            {recentTools.map(tool => (
              <Link to={`/ai-tools/${tool._id}`} key={tool._id} className="item-card">
                {tool.thumbnail && <img src={tool.thumbnail} alt={tool.name} />}
                <h3>{tool.name}</h3>
                <p className="category">{tool.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
