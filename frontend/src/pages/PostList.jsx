import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

const STATUS_LABELS = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const STATUS_COLORS = {
  draft: "#9E9E9E",
  scheduled: "#FFC107",
  published: "#4CAF50",
  archived: "#607D8B",
};

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await api.get("/posts/");
      setPosts(res.data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/posts/${id}/`);
        loadPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Posts</h1>
        <Link
          to="/create"
          style={{
            padding: "12px 24px",
            background: "#4CAF50",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          + Create Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
          No posts yet. Create your first post!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
                  <p style={{ color: "#666", margin: "0 0 12px 0" }}>
                    {post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content}
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        background: "#E3F2FD",
                        color: "#1976D2",
                        fontSize: "14px",
                      }}
                    >
                      {PLATFORM_LABELS[post.platform] || post.platform}
                    </span>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        background: `${STATUS_COLORS[post.status]}20`,
                        color: STATUS_COLORS[post.status],
                        fontSize: "14px",
                      }}
                    >
                      {STATUS_LABELS[post.status] || post.status}
                    </span>
                    {post.scheduled_time && (
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        📅 {new Date(post.scheduled_time).toLocaleString()}
                      </span>
                    )}
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        background: "#E8F5E9",
                        color: "#2E7D32",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📈 {post.engagement_score || 0}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                  <Link
                    to={`/edit/${post.id}`}
                    style={{
                      padding: "8px 16px",
                      background: "#2196F3",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{
                      padding: "8px 16px",
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
