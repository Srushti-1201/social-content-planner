import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Dashboard, List, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Social Media Content Planner
        </Typography>
        <Box>
          <Button color="inherit" startIcon={<Dashboard />} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" startIcon={<List />} onClick={() => navigate('/')}>
            Posts
          </Button>
          <Button color="inherit" startIcon={<BarChart />} onClick={() => navigate('/reports')}>
            Reports
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;