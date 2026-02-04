import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Color constants for platforms and statuses
const PLATFORM_COLORS = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  tiktok: "#000000",
  youtube: "#FF0000",
  pinterest: "#BD081C"
};

const STATUS_COLORS = {
  draft: "#9E9E9E",
  scheduled: "#FFC107",
  published: "#4CAF50",
  archived: "#607D8B"
};

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    platform_stats: [],
    status_stats: [],
    engagement_stats: [],
    total_posts: 0,
    total_engagement: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const handleGenerateEngagement = async () => {
    setGenerating(true);
    try {
      await axios.post(`${API_URL}/posts/generate_engagement/`);
      // Refresh data after generating
      fetchData();
      alert("Engagement scores generated successfully!");
    } catch (err) {
      console.error("Error generating engagement:", err);
      alert("Failed to generate engagement scores.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      // Fetch analytics from the optimized endpoint
      axios.get(`${API_URL}/posts/analytics/`)
        .then(res => {
          console.log("Analytics response:", res.data);
          setAnalytics({
            platform_stats: res.data.platform_stats || [],
            status_stats: res.data.status_stats || [],
            engagement_stats: res.data.engagement_stats || [],
            total_posts: res.data.total_posts || 0,
            total_engagement: res.data.total_engagement || 0
          });
        })
        .catch(err => console.error("Error fetching analytics:", err));

      // Fetch recent posts with limit
      axios.get(`${API_URL}/posts/?limit=5`)
        .then(res => {
          console.log("Recent posts response:", res.data);
          const postsData = res.data.results || res.data;
          // Ensure postsData is always an array
          setRecentPosts(Array.isArray(postsData) ? postsData : []);
        })
        .catch(err => {
          console.error("Error fetching recent posts:", err);
          setRecentPosts([]);
        })
        .finally(() => setLoading(false));
    };
    
    // Fetch immediately on mount
    fetchData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px", background: "#fafafa" }}>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

      <Stats 
        totalPosts={analytics.total_posts} 
        totalEngagement={analytics.total_engagement}
        platformCount={analytics.platform_stats.length}
      />

      {/* Generate Engagement Button */}
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={handleGenerateEngagement}
          disabled={generating}
          style={{
            padding: "10px 20px",
            background: generating ? "#ccc" : "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: generating ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {generating ? "Generating..." : "🎲 Generate Random Engagement"}
        </button>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "20px" }}>
        <PlatformDistributionChart data={analytics.platform_stats} />
        <StatusDistributionChart data={analytics.status_stats} />
        <EngagementChart data={analytics.engagement_stats} />
      </div>

      <RecentPosts posts={recentPosts} />
      <PlatformStats stats={analytics.platform_stats} engagementStats={analytics.engagement_stats} />
      <StatusStats stats={analytics.status_stats} />
    </div>
  );
}

// Platform Distribution Bar Chart
function PlatformDistributionChart({ data }) {
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3>Platform Distribution</h3>
      {data.length === 0 ? (
        <p>No platform data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Posts" fill="#4CAF50">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.platform.toLowerCase()] || "#8884d8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Status Distribution Pie Chart
function StatusDistributionChart({ data }) {
  const pieData = data.map(item => ({
    name: item.status,
    value: item.count,
    color: STATUS_COLORS[item.status.toLowerCase()] || "#8884d8"
  }));

  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3>Status Distribution</h3>
      {data.length === 0 ? (
        <p>No status data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Engagement by Platform Bar Chart
function EngagementChart({ data }) {
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3>Engagement by Platform</h3>
      {data.length === 0 ? (
        <p>No engagement data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_engagement" name="Avg. Engagement" fill="#2196F3">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.platform.toLowerCase()] || "#8884d8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function Stats({ totalPosts, totalEngagement, platformCount }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
      <Card title="Total Posts" value={totalPosts} />
      <Card title="Total Engagement" value={totalEngagement.toLocaleString()} />
      <Card title="Platforms" value={platformCount} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      padding: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      width: "200px",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <h4 style={{ margin: "0 0 10px 0" }}>{title}</h4>
      <strong style={{ fontSize: "24px" }}>{value}</strong>
    </div>
  );
}

function RecentPosts({ posts }) {
  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];
  
  return (
    <div style={{ marginBottom: "20px", background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3>Recent Posts</h3>
      {safePosts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {safePosts.map(post => (
            <li key={post.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <strong>{post.title}</strong> — {post.platform}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlatformStats({ stats, engagementStats }) {
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
      <h3>Platform Breakdown</h3>
      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        <div>
          <h4>Posts by Platform</h4>
          {stats.length === 0 ? (
            <p>No platform data available.</p>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              {stats.map(({ platform, count }) => (
                <Card key={platform} title={platform} value={count} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Avg. Engagement per Platform</h4>
          {engagementStats.length === 0 ? (
            <p>No engagement data available.</p>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              {engagementStats.map(({ platform, avg_engagement }) => (
                <Card key={platform} title={platform} value={avg_engagement.toFixed(1)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusStats({ stats }) {
  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h3>Status Breakdown</h3>
      {stats.length === 0 ? (
        <p>No status data available.</p>
      ) : (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {stats.map(({ status, count }) => (
            <Card key={status} title={status} value={count} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
