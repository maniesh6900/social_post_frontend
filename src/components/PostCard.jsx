import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip
} from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function PostCard({ post, canInteract, onLike, onComment, currentUser }) {
  const [text, setText] = useState('');
  const liked = useMemo(() => post.likes?.includes(currentUser?.username), [post.likes, currentUser]);

  const handleComment = async () => {
    if (!text.trim()) return;
    await onComment(post.id, text.trim());
    setText('');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid #e5e7eb',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 5,
          width: '100%',
          background: 'linear-gradient(90deg,#1b6ab3,#3cd1e3)'
        }}
      />
      <Stack direction="row" gap={1.4} alignItems="center" mb={1}>
        <Avatar sx={{ bgcolor: '#1b6ab3' }}>{post.author?.[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1">{post.author}</Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(post.createdAt)}
          </Typography>
        </Box>
      </Stack>

      {post.content && (
        <Typography variant="body1" sx={{ mb: 1.2, lineHeight: 1.6 }}>
          {post.content}
        </Typography>
      )}

      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt="post"
          sx={{ width: '100%', borderRadius: 2, mb: 1.2, border: '1px solid #e5e7eb', objectFit: 'cover', maxHeight: 320 }}
        />
      )}

      <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
        <IconButton
          color={liked ? 'primary' : 'default'}
          onClick={() => canInteract && onLike(post.id)}
          disabled={!canInteract}
        >
          <FavoriteRoundedIcon />
        </IconButton>
        <Typography variant="body2">{post.likes?.length || 0} likes</Typography>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <ChatBubbleRoundedIcon fontSize="small" color="action" />
          <Typography variant="body2">{post.comments?.length || 0} comments</Typography>
        </Stack>
      </Stack>

      {post.likes?.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap" mb={1}>
          {post.likes.slice(0, 6).map((name) => (
            <Chip key={name} size="small" label={name} variant="outlined" />
          ))}
          {post.likes.length > 6 && (
            <Chip size="small" label={`+${post.likes.length - 6} more`} variant="outlined" />
          )}
        </Stack>
      )}

      {post.comments?.length > 0 && (
        <Stack spacing={1} mb={1.5} sx={{ background: '#f8fafc', p: 1.2, borderRadius: 2 }}>
          {post.comments.slice(-3).map((c, idx) => (
            <Stack key={idx} direction="row" gap={1} alignItems="flex-start">
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#0f172a', fontSize: 13 }}>
                {c.user?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{c.user}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.text}
                </Typography>
              </Box>
            </Stack>
          ))}
          {post.comments.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              Showing latest 3 of {post.comments.length} comments
            </Typography>
          )}
        </Stack>
      )}

      <Stack direction="row" gap={1} alignItems="center">
        <TextField
          size="small"
          placeholder={canInteract ? 'Add a comment…' : 'Login to comment'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!canInteract}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleComment}
          disabled={!canInteract || !text.trim()}
          sx={{ textTransform: 'none' }}
        >
          Post
        </Button>
      </Stack>
    </Paper>
  );
}

export default PostCard;
