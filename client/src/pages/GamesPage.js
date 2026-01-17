import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/GamesPage.css';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ platform: '', genre: '', search: '' });

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/games?${params}`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="games-page">
      <div className="games-container">
        <div className="filters">
          <h3>Filters</h3>
          <input
            type="text"
            name="search"
            placeholder="Search games..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <select name="platform" value={filters.platform} onChange={handleFilterChange}>
            <option value="">All Platforms</option>
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            <option value="mac">Mac</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
          </select>
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="puzzle">Puzzle</option>
            <option value="strategy">Strategy</option>
            <option value="rpg">RPG</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div className="games-grid">
          {loading ? (
            <div className="loading">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="no-results">No games found</div>
          ) : (
            games.map(game => (
              <Link to={`/games/${game._id}`} key={game._id} className="game-card">
                {game.thumbnail && <img src={game.thumbnail} alt={game.title} />}
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p className="developer">{game.developer?.username}</p>
                  <div className="meta">
                    <span className="rating">⭐ {game.rating}</span>
                    <span className="downloads">⬇ {game.downloads}</span>
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

export default GamesPage;
