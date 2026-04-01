import { useState } from 'react';
import {
  Paper,
  Stack,
  Avatar,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ClearIcon from '@mui/icons-material/Clear';

function CreatePost({ onSubmit, user }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    setUploading(true);
    reader.onloadend = () => {
      setImage(reader.result.toString());
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    await onSubmit({ content: content.trim(), image });
    setContent('');
    setImage('');
  };

  return (
    <Paper sx={{ p: 2.5, mb: 2, border: '1px solid #e5e7eb' }}>
      <Stack direction="row" alignItems="center" gap={2} mb={1.5}>
        <Avatar sx={{ bgcolor: '#1b6ab3' }}>{user.username?.[0]?.toUpperCase()}</Avatar>
        <Typography variant="subtitle1">Share an update</Typography>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            multiline
            minRows={3}
            placeholder="Write something motivational, share a win, or drop a question…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {image && (
            <Stack direction="row" alignItems="center" gap={1}>
              <img
                src={image}
                alt="preview"
                style={{ maxHeight: 140, borderRadius: 12, objectFit: 'cover', border: '1px solid #e5e7eb' }}
              />
              <IconButton onClick={() => setImage('')} size="small">
                <ClearIcon />
              </IconButton>
            </Stack>
          )}

          <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
              <Chip
                icon={<ImageIcon />}
                label={uploading ? 'Uploading…' : image ? 'Change image' : 'Add image'}
                variant="outlined"
                clickable
                component="span"
              />
            </label>
            <Button
              variant="contained"
              type="submit"
              disabled={uploading || (!content.trim() && !image)}
              sx={{ textTransform: 'none' }}
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}

export default CreatePost;
