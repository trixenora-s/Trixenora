import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Detail.css';

function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${id}`);
      const data = await response.json();
      setGame(data);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/games/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        fetchGame();
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!game) return <div className="error">Game not found</div>;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-header">
          {game.thumbnail && <img src={game.thumbnail} alt={game.title} className="main-image" />}
          <div className="detail-info">
            <h1>{game.title}</h1>
            <p className="developer">By {game.developer?.username}</p>
            <div className="meta-info">
              <span>Rating: ⭐ {game.rating}/5</span>
              <span>Downloads: {game.downloads}</span>
              <span>Version: {game.version}</span>
            </div>
            <a href={game.downloadUrl} download className="btn btn-primary">Download</a>
          </div>
        </div>

        <div className="detail-content">
          <section className="section">
            <h2>Description</h2>
            <p>{game.description}</p>
          </section>

          <section className="section">
            <h2>Details</h2>
            <div className="details-grid">
              <div>
                <strong>Platforms:</strong>
                <p>{game.platforms?.join(', ')}</p>
              </div>
              <div>
                <strong>Genre:</strong>
                <p>{game.genre}</p>
              </div>
              <div>
                <strong>File Size:</strong>
                <p>{(game.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <strong>Minimum Requirements:</strong>
                <p>{game.minRequirements}</p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Reviews ({game.reviews?.length || 0})</h2>
            {game.reviews && game.reviews.length > 0 ? (
              <div className="reviews-list">
                {game.reviews.map((review, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <strong>{review.userId?.username}</strong>
                      <span className="rating">⭐ {review.rating}/5</span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet</p>
            )}

            {localStorage.getItem('token') && (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <h3>Leave a Review</h3>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
                <textarea
                  placeholder="Your comment..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  rows="4"
                />
                <button type="submit" className="btn-submit">Submit Review</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
