import { useState } from "react";
import { createPost } from "../api/posts";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'facebook',
    status: 'draft',
  });
  const [scheduledTime, setScheduledTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [engagementScore, setEngagementScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createPost({
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
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setSaving(false);
    }
  };

  const generateCaption = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.get("https://api.quotable.io/random");
      const quote = res.data.content;
      const author = res.data.author;
      setFormData(prevData => ({...prevData, content: `${quote} — ${author}`}));
    } catch (error) {
      setError("Could not fetch caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="border p-2 w-full rounded"
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
        />
        
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={generateCaption}
            disabled={loading || formData.content.length > 0}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Generating..." : "Generate Caption"}
          </button>
          <small className="text-gray-500">Powered by Quotable API</small>
        </div>
        
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
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
