import { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  Typography,
  Avatar,
  Divider
} from '@mui/material';

function AuthPanel({ onLogin, onSignup, user }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin({ email: form.email, password: form.password });
      } else {
        await onSignup(form);
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Paper sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Avatar>{user.username?.[0]?.toUpperCase()}</Avatar>
        <div>
          <Typography variant="subtitle1">Welcome, {user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            You are ready to post, like, and comment.
          </Typography>
        </div>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Tabs
        value={mode}
        onChange={(_e, v) => setMode(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab value="login" label="Login" />
        <Tab value="signup" label="Sign Up" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {mode === 'signup' && (
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              size="small"
            />
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            size="small"
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ textTransform: 'none', py: 1.1 }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default AuthPanel;
