import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Detail.css';

function ToolDetail() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchTool();
  }, [id]);

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/ai-tools/${id}`);
      const data = await response.json();
      setTool(data);
    } catch (error) {
      console.error('Error fetching tool:', error);
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/ai-tools/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        fetchTool();
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!tool) return <div className="error">Tool not found</div>;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-header">
          {tool.thumbnail && <img src={tool.thumbnail} alt={tool.name} className="main-image" />}
          <div className="detail-info">
            <h1>{tool.name}</h1>
            <p className="creator">By {tool.creator?.username}</p>
            <div className="meta-info">
              <span>Rating: ⭐ {tool.rating}/5</span>
              <span>Downloads: {tool.downloads}</span>
              <span>Status: {tool.status}</span>
            </div>
            <a href={tool.fileUrl} download className="btn btn-primary">Download</a>
          </div>
        </div>

        <div className="detail-content">
          <section className="section">
            <h2>Description</h2>
            <p>{tool.description}</p>
          </section>

          <section className="section">
            <h2>Details</h2>
            <div className="details-grid">
              <div>
                <strong>Category:</strong>
                <p>{tool.category}</p>
              </div>
              <div>
                <strong>Status:</strong>
                <p>{tool.status}</p>
              </div>
              <div>
                <strong>File Size:</strong>
                <p>{(tool.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <strong>Requirements:</strong>
                <p>{tool.requirements}</p>
              </div>
            </div>
          </section>

          {tool.documentation && (
            <section className="section">
              <h2>Documentation</h2>
              <p>{tool.documentation}</p>
            </section>
          )}

          <section className="section">
            <h2>Reviews ({tool.reviews?.length || 0})</h2>
            {tool.reviews && tool.reviews.length > 0 ? (
              <div className="reviews-list">
                {tool.reviews.map((review, idx) => (
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

export default ToolDetail;
