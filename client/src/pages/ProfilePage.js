import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    try {
      await fetch(`/api/users/${profile._id}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not found</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <h1>{profile.displayName || profile.username}</h1>
            <p className="username">@{profile.username}</p>
            {profile.bio && <p className="bio">{profile.bio}</p>}
            <div className="stats">
              <span>{profile.followers?.length || 0} Followers</span>
              <span>{profile.following?.length || 0} Following</span>
            </div>
            <button onClick={handleFollow} className="btn btn-primary">Follow</button>
          </div>
        </div>

        <div className="profile-content">
          <section className="section">
            <h2>Published Games ({profile.gamesUploaded?.length || 0})</h2>
            {profile.gamesUploaded && profile.gamesUploaded.length > 0 ? (
              <div className="items-grid">
                {profile.gamesUploaded.map(game => (
                  <a key={game._id} href={`/games/${game._id}`} className="item-card">
                    <h3>{game.title}</h3>
                    <p>{game.platforms?.join(', ')}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p>No games published yet</p>
            )}
          </section>

          <section className="section">
            <h2>AI Tools ({profile.aiToolsUploaded?.length || 0})</h2>
            {profile.aiToolsUploaded && profile.aiToolsUploaded.length > 0 ? (
              <div className="items-grid">
                {profile.aiToolsUploaded.map(tool => (
                  <a key={tool._id} href={`/ai-tools/${tool._id}`} className="item-card">
                    <h3>{tool.name}</h3>
                    <p>{tool.category}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p>No AI tools published yet</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
