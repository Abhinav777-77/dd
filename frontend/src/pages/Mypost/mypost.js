import React, { useEffect, useState } from 'react';
import './Myposts.css';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/history');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data); // Debugging: Log fetched data
                    setPosts(data);
                } else {
                    console.error('Failed to fetch posts:', response.status);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const validateImageURL = (url) => {
        return url && url.startsWith("data:image") ? url : 'https://via.placeholder.com/150?text=No+Image';
    };

    return (
        <div className="myposts-container">
            <h1 className="category-title">My Generated Posts</h1>

            {loading ? (
                <p>Loading...</p>
            ) : posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <div className="post-grid">
                    {posts.map((post, index) => (
                        <div key={index} className="post-card">
                            <div className="post-thumbnail">
                                <img
                                    src={validateImageURL(post.image)}
                                    alt={post.prompt || 'Generated Post'}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className="post-details">
                                <h3 className="post-title">{post.prompt || 'Untitled Prompt'}</h3>
                                <p className="post-content">{post.generatedText || 'No generated content available.'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
