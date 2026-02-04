import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
];

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [status, setStatus] = useState("draft");
  const [scheduled_time, setScheduledTime] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}/`)
      .then(res => {
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setPlatform(post.platform);
        setStatus(post.status);
        setScheduledTime(post.scheduled_time ? post.scheduled_time.slice(0, 16) : "");
        setImageUrl(post.image_url || "");
      })
      .catch(err => console.error("Error fetching post:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/posts/${id}/`, {
        title,
        content,
        platform,
        status,
        scheduled_time: scheduled_time || null,
        image_url: image_url || null,
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Edit Post</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Scheduled Time (optional)</label>
          <input
            type="datetime-local"
            value={scheduled_time}
            onChange={(e) => setScheduledTime(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px" }}>Image URL (optional)</label>
          <input
            type="url"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: saving ? "#ccc" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Update Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
