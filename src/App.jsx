import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, Grid, Paper, Typography, IconButton, Tooltip, Divider, Snackbar, Alert } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AuthPanel from './components/AuthPanel.jsx';
import CreatePost from './components/CreatePost.jsx';
import Feed from './components/Feed.jsx';
import api, { setAuthToken } from './api/client.js';

const brandGradient = 'linear-gradient(120deg, #1f3d7a 0%, #1b6ab3 50%, #3cd1e3 100%)';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [posts, setPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [banner, setBanner] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    fetchPosts();
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#1b6ab3' },
          secondary: { main: '#f2a93b' },
          background: { default: '#f5f7fb' }
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", "Segoe UI", Roboto, sans-serif',
          h5: { fontWeight: 700 }
        },
        shape: { borderRadius: 16 }
      }),
    []
  );

  async function fetchPosts() {
    setLoadingFeed(true);
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
      setBanner('Could not load feed');
    } finally {
      setLoadingFeed(false);
    }
  }

  const handleSignup = async (payload) => {
    try {
      const { data } = await api.post('/auth/signup', payload);
      setAuthToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setBanner('Signed up — welcome!');
    } catch (err) {
      setBanner(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleLogin = async (payload) => {
    try {
      const { data } = await api.post('/auth/login', payload);
      setAuthToken(data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setBanner('Logged in');
    } catch (err) {
      setBanner(err.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('user');
    setBanner('Logged out');
  };

  const handleCreate = async ({ content, image }) => {
    try {
      const { data } = await api.post('/posts', { content, image });
      setPosts((prev) => [data, ...prev]);
      setBanner('Posted');
    } catch (err) {
      setBanner(err.response?.data?.message || 'Could not post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
      );
    } catch (err) {
      setBanner(err.response?.data?.message || 'Unable to like');
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { text });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: data.comments ?? p.comments.concat(data.newComment) }
            : p
        )
      );
    } catch (err) {
      setBanner(err.response?.data?.message || 'Unable to comment');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-shell">
        <Paper
          elevation={4}
          sx={{
            background: brandGradient,
            color: '#fff',
            borderRadius: 0,
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1
          }}
        >
          <Box display="flex" alignItems="center" gap={1.2}>
            <BoltRoundedIcon />
            <Typography variant="h6">TaskPlanet Social</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Share updates, images, and wins
            </Typography>
          </Box>
          {user && (
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </Paper>

        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7} lg={8}>
              {user ? (
                <CreatePost onSubmit={handleCreate} user={user} />
              ) : (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Login to post, like, and comment
                  </Typography>
                  <Divider />
                </Paper>
              )}
              <Feed
                posts={posts}
                loading={loadingFeed}
                canInteract={!!user}
                onLike={handleLike}
                onComment={handleComment}
                currentUser={user}
                refresh={fetchPosts}
              />
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <AuthPanel onLogin={handleLogin} onSignup={handleSignup} user={user} />
              <Paper sx={{ p: 2, mt: 2, background: '#0f172a', color: '#e3edf7' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Design Notes
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Clean cards, neon accent buttons, and soft gradient header mimic the TaskPlanet social page vibe. Real-time like/comment counters keep interactions instant.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Snackbar
          open={!!banner}
          autoHideDuration={3000}
          onClose={() => setBanner('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="info" onClose={() => setBanner('')}>{banner}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
