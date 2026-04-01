import { Stack, Typography, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from './PostCard.jsx';

function Feed({ posts, loading, canInteract, onLike, onComment, currentUser, refresh }) {
  if (loading) {
    return (
      <Stack alignItems="center" py={4} spacing={1}>
        <CircularProgress />
        <Typography variant="body2">Loading feed…</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Community Feed</Typography>
        <Button size="small" onClick={refresh}>Refresh</Button>
      </Stack>
      {posts.length === 0 && <Typography>No posts yet. Be the first!</Typography>}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          canInteract={canInteract}
          onLike={onLike}
          onComment={onComment}
          currentUser={currentUser}
        />
      ))}
    </Stack>
  );
}

export default Feed;
