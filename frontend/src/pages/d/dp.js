import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dp.css'; // Global CSS styles
const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Choose Where You Want TO Get Directed</h1>
      <div className="button-grid">
        {/* NewsPage Button */}
        <div className="feature-card" onClick={() => navigate('/news')}>
          <img src={require('./newspage.webp')} alt="News" className="feature-image" />
          <h2>News Page</h2>
          <p>Stay updated with the latest news and trends in the tech world. </p>
        </div>

        {/* MyPosts Button */}
        <div className="feature-card" onClick={() => navigate('/myposts')}>
          <img src={require('./myposts.webp')} alt="My Posts" className="feature-image" />
          <h2>My Posts</h2>
          <p>View and manage all your blog posts in one place. </p>
        </div>

        {/* Text Generator Button */}
        <div className="feature-card" onClick={() => navigate('/generator')}>
          <img src={require('./textgenerator.webp')} alt="Text Generator" className="feature-image" />
          <h2>Text Generator</h2>
          <p>Create AI-powered blogs effortlessly with our text generator. </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
   