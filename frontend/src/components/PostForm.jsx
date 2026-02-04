import { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, MenuItem, Box,
  Typography, Grid, CircularProgress, Alert
} from '@mui/material';
import { CloudUpload, AutoAwesome, TrendingUp } from '@mui/icons-material';
import { postsAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [engagementLoading, setEngagementLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'Instagram',
    status: 'Draft',
    image_url: '',
    engagement_score: 0,
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getOne(id);
      const post = response.data;
      setFormData({
        ...post,
      });
    } catch (error) {
      setError('Error fetching post');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateEngagement = () => {
    setEngagementLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 1000) + 1;
      setFormData({
        ...formData,
        engagement_score: randomScore,
      });
      setEngagementLoading(false);
    }, 500);
  };

  const handleFetchImage = async () => {
    setImageLoading(true);
    try {
      const response = await postsAPI.fetchImage(formData.platform);
      setFormData({
        ...formData,
        image_url: response.data.url,
      });
    } catch (error) {
      setError('Error fetching image from Unsplash');
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    setQuoteLoading(true);
    try {
      const response = await postsAPI.getRandomQuote();
      setFormData({
        ...formData,
        content: response.data.content,
      });
    } catch (error) {
      setError('Error fetching quote');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let submitData = { ...formData };

      if (id) {
        await postsAPI.update(id, submitData);
      } else {
        await postsAPI.create(submitData);
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Post' : 'Create New Post'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                />
                <Button
                  variant="outlined"
                  startIcon={quoteLoading ? <CircularProgress size={20} /> : <AutoAwesome />}
                  onClick={handleGenerateQuote}
                  disabled={quoteLoading}
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Twitter">Twitter</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Published">Published</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Engagement Score"
                  name="engagement_score"
                  type="number"
                  value={formData.engagement_score}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
                <Button
                  variant="outlined"
                  startIcon={engagementLoading ? <CircularProgress size={20} /> : <TrendingUp />}
                  onClick={handleGenerateEngagement}
                  disabled={engagementLoading}
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                />
                <Button
                  variant="outlined"
                  startIcon={imageLoading ? <CircularProgress size={20} /> : <CloudUpload />}
                  onClick={handleFetchImage}
                  disabled={imageLoading}
                >
                  Fetch Image
                </Button>
              </Box>
            </Grid>

            {formData.image_url && (
              <Grid item xs={12}>
                <Box
                  component="img"
                  src={formData.image_url}
                  alt="Preview"
                  sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 1 }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : (id ? 'Update' : 'Create')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PostForm;