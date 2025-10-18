import express from 'express';
import { getSpotifyAccessToken } from '../utils/getSpotifyAccessToken.js';

const router = express.Router();

// Get Spotify access token
router.get('/token', async (req, res) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    res.json({ access_token: accessToken });
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    res.status(500).json({ error: 'Failed to get Spotify access token' });
  }
});

export default router;