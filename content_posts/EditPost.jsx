import { useEffect, useState } from "react";
import { getPost, updatePost } from "../api/posts";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'facebook',
    status: 'draft',
  });
  const [scheduledTime, setScheduledTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [engagementScore, setEngagementScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "tiktok", label: "TikTok" },
    { value: "youtube", label: "YouTube" },
    { value: "pinterest", label: "Pinterest" },
  ];

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "scheduled", label: "Scheduled" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  useEffect(() => {
    getPost(id).then((res) => {
      const post = res.data;
      setFormData({
        title: post.title || '',
        content: post.content || '',
        platform: post.platform || 'facebook',
        status: post.status || 'draft',
      });
      setScheduledTime(post.scheduled_time || "");
      setImageUrl(post.image_url || "");
      setEngagementScore(post.engagement_score || 0);
    }).catch(err => {
      console.error("Error loading post", err);
      setError("Failed to load post data.");
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await updatePost(id, {
        title: formData.title,
        content: formData.content,
        platform: formData.platform,
        status: formData.status,
        scheduled_time: scheduledTime || null,
        image_url: imageUrl || "",
        engagement_score: engagementScore || 0,
      });
      navigate("/");
    } catch (err) {
      console.error("Error updating post", err);
      setError("Failed to update post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="border p-2 w-full rounded"
          required
        />
        
        <select
          value={formData.platform}
          onChange={(e) => setFormData({...formData, platform: e.target.value})}
          className="border p-2 w-full rounded"
        >
          {platforms.map((platform) => (
            <option key={platform.value} value={platform.value}>
              {platform.label}
            </option>
          ))}
        </select>
        
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="border p-2 w-full rounded"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          className="border p-2 w-full rounded h-32"
          required
        />
        
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="border p-2 w-full rounded"
        />
        
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 w-full rounded"
        />
        
        <input
          type="number"
          placeholder="Engagement Score (optional)"
          value={engagementScore}
          onChange={(e) => setEngagementScore(parseInt(e.target.value) || 0)}
          min="0"
          max="100"
          className="border p-2 w-full rounded"
        />
        
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update"}
          </button>
          <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
