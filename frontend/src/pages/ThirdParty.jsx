import { useState, useEffect } from 'react';
import './ThirdParty.css';

const API_BASE = 'http://localhost:8000/api';

function ThirdParty() {
  const [posts, setPosts] = useState([]);
  const [quote, setQuote] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [randomImage, setRandomImage] = useState(null);
  const [loading, setLoading] = useState({});
  const [apiResponses, setApiResponses] = useState({});
  const [error, setError] = useState(null);

  // Demo 1: Fetch Posts (GET)
  const fetchPosts = async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/posts/`);
      const data = await response.json();
      setPosts(data);
      setApiResponses(prev => ({ ...prev, posts: { status: response.status, data } }));
    } catch (err) {
      setError(`Failed to fetch posts: ${err.message}`);
    }
    setLoading(prev => ({ ...prev, posts: false }));
  };

  // Demo 2: Fetch Random Quote (External API via backend)
  const fetchQuote = async () => {
    setLoading(prev => ({ ...prev, quote: true }));
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/external/quote/`);
      const data = await response.json();
      setQuote(data);
      setApiResponses(prev => ({ ...prev, quote: { status: response.status, data } }));
    } catch (err) {
      setError(`Failed to fetch quote: ${err.message}`);
    }
    setLoading(prev => ({ ...prev, quote: false }));
  };

  // Demo 3: Fetch Analytics
  const fetchAnalytics = async () => {
    setLoading(prev => ({ ...prev, analytics: true }));
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/posts/analytics/`);
      const data = await response.json();
      setAnalytics(data);
      setApiResponses(prev => ({ ...prev, analytics: { status: response.status, data } }));
    } catch (err) {
      setError(`Failed to fetch analytics: ${err.message}`);
    }
    setLoading(prev => ({ ...prev, analytics: false }));
  };

  // Demo 4: Fetch Random Image
  const fetchImage = async () => {
    setLoading(prev => ({ ...prev, image: true }));
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/posts/fetch_image/`);
      const data = await response.json();
      setRandomImage(data);
      setApiResponses(prev => ({ ...prev, image: { status: response.status, data } }));
    } catch (err) {
      setError(`Failed to fetch image: ${err.message}`);
    }
    setLoading(prev => ({ ...prev, image: false }));
  };

  useEffect(() => {
    fetchPosts();
    fetchQuote();
    fetchAnalytics();
    fetchImage();
  }, []);

  const clearResponses = () => {
    setApiResponses({});
    setError(null);
  };

  return (
    <div className="third-party-demo">
      <h1>🔌 Third-Party API Demo</h1>
      <p className="subtitle">Fetching data from the backend API</p>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="demo-grid">
        {/* Demo 1: Posts API */}
        <div className="demo-card">
          <h2>📝 Posts API</h2>
          <p className="endpoint">GET /api/posts/</p>
          <button 
            onClick={fetchPosts} 
            disabled={loading.posts}
            className="demo-button"
          >
            {loading.posts ? 'Loading...' : 'Fetch Posts'}
          </button>
          
          {apiResponses.posts && (
            <div className="response-preview">
              <h4>Response ({apiResponses.posts.status})</h4>
              <pre>{JSON.stringify(Array.isArray(apiResponses.posts.data) ? apiResponses.posts.data.slice(0, 3) : apiResponses.posts.data, null, 2)}</pre>
              <span className="data-length">
                Total: {Array.isArray(apiResponses.posts.data) ? apiResponses.posts.data.length : 0} posts
              </span>
            </div>
          )}

          <div className="data-display">
            {Array.isArray(posts) && posts.slice(0, 2).map(post => (
              <div key={post.id} className="mini-post">
                <strong>{post.title}</strong>
                <span className={`platform ${post.platform}`}>{post.platform}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo 2: External Quote API */}
        <div className="demo-card">
          <h2>💬 External Quote API</h2>
          <p className="endpoint">GET /api/external/quote/</p>
          <button 
            onClick={fetchQuote} 
            disabled={loading.quote}
            className="demo-button"
          >
            {loading.quote ? 'Loading...' : 'Get Random Quote'}
          </button>

          {apiResponses.quote && (
            <div className="response-preview">
              <h4>Response ({apiResponses.quote.status})</h4>
              <pre>{JSON.stringify(apiResponses.quote.data, null, 2)}</pre>
            </div>
          )}

          {quote && (
            <div className="quote-display">
              <blockquote>"{quote.content}"</blockquote>
              <cite>— {quote.author}</cite>
            </div>
          )}
        </div>

        {/* Demo 3: Analytics API */}
        <div className="demo-card">
          <h2>📊 Analytics API</h2>
          <p className="endpoint">GET /api/posts/analytics/</p>
          <button 
            onClick={fetchAnalytics} 
            disabled={loading.analytics}
            className="demo-button"
          >
            {loading.analytics ? 'Loading...' : 'Fetch Analytics'}
          </button>

          {apiResponses.analytics && (
            <div className="response-preview">
              <h4>Response ({apiResponses.analytics.status})</h4>
              <pre>{JSON.stringify(apiResponses.analytics.data, null, 2)}</pre>
            </div>
          )}

          {analytics && (
            <div className="analytics-display">
              <div className="stat-item">
                <span className="stat-value">{analytics.total_posts}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{analytics.total_engagement}</span>
                <span className="stat-label">Total Engagement</span>
              </div>
            </div>
          )}
        </div>

        {/* Demo 4: Image API */}
        <div className="demo-card">
          <h2>🖼️ Image API</h2>
          <p className="endpoint">GET /api/posts/fetch_image/</p>
          <button 
            onClick={fetchImage} 
            disabled={loading.image}
            className="demo-button"
          >
            {loading.image ? 'Loading...' : 'Fetch Random Image'}
          </button>

          {apiResponses.image && (
            <div className="response-preview">
              <h4>Response ({apiResponses.image.status})</h4>
              <pre>{JSON.stringify(apiResponses.image.data, null, 2)}</pre>
            </div>
          )}

          {randomImage && (
            <div className="image-display">
              <img src={randomImage.url} alt={randomImage.description} />
              <p className="image-author">By: {randomImage.author}</p>
            </div>
          )}
        </div>
      </div>

      {/* API Documentation Section */}
      <div className="api-docs">
        <h2>📚 Available API Endpoints</h2>
        <table className="endpoints-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/posts/</code></td>
              <td>List all posts</td>
              <td>Array of post objects</td>
            </tr>
            <tr>
              <td><span className="method post">POST</span></td>
              <td><code>/api/posts/</code></td>
              <td>Create a new post</td>
              <td>Created post object</td>
            </tr>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/posts/123/</code></td>
              <td>Get a specific post</td>
              <td>Single post object</td>
            </tr>
            <tr>
              <td><span className="method put">PUT</span></td>
              <td><code>/api/posts/123/</code></td>
              <td>Update a post</td>
              <td>Updated post object</td>
            </tr>
            <tr>
              <td><span className="method delete">DELETE</span></td>
              <td><code>/api/posts/123/</code></td>
              <td>Delete a post</td>
              <td>Empty response</td>
            </tr>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/posts/analytics/</code></td>
              <td>Get platform analytics</td>
              <td>Analytics statistics</td>
            </tr>
            <tr>
              <td><span className="method get">GET</span></td>
              <td><code>/api/external/quote/</code></td>
              <td>Fetch random quote (external API)</td>
              <td>Quote object</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* All Responses JSON View */}
      {Object.keys(apiResponses).length > 0 && (
        <div className="all-responses">
          <div className="responses-header">
            <h2>📋 Full API Responses</h2>
            <button onClick={clearResponses} className="clear-button">
              Clear All
            </button>
          </div>
          {Object.entries(apiResponses).map(([key, response]) => (
            <div key={key} className="response-section">
              <h3>{key.toUpperCase()} API Response</h3>
              <pre>{JSON.stringify(response.data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThirdParty;
