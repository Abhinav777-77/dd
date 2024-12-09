import React, { useState, useEffect } from 'react';
import './news.css';

function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const NEWS_API_KEY = '6f196633134446329e2f6ff4e59a56a3';
  const CONTENT_API_URL = 'http://localhost:5000/generate';

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=technology&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'ok') {
        setArticles(data.articles);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError(`Error fetching news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneratedContentAndImage = async () => {
    try {
      const response = await fetch(CONTENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Generate technology-related news content and an image.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch generated content');
      }



    } catch (err) {
      console.error(`Error fetching generated content: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchGeneratedContentAndImage();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div id="news-page">
      <h1 className="news-heading">Tech News</h1>
      {articles.length === 0 ? (
        <p className="no-news-message">No news available</p>
      ) : (
        <div className="news-grid">
          {articles.map((article, index) => (
            <div className="news-card" key={index}>
              {article.urlToImage && (
                <img
                  className="news-image"
                  src={article.urlToImage}
                  alt={article.title || 'News image'}
                />
              )}
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">
                {article.description || 'No description available'}
              </p>
              <a
                className="read-more"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsPage;
