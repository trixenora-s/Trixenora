import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import AIToolsPage from './pages/AIToolsPage';
import GameDetail from './pages/GameDetail';
import ToolDetail from './pages/ToolDetail';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch('/api/dashboard/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/ai-tools" element={<AIToolsPage />} />
        <Route path="/ai-tools/:id" element={<ToolDetail />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />
        {user && <Route path="/dashboard" element={<Dashboard user={user} />} />}
        {user && <Route path="/upload" element={<Upload user={user} />} />}
      </Routes>
    </Router>
  );
}

export default App;
