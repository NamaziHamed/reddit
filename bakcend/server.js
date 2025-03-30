const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Configuration for Reddit API (replace with your own)
  const CLIENT_ID = "example";
  const CLIENT_SECRET = "example";
  const USER_AGENT = "Client/1.0 (by Hamed-namazi)";

// Enable CORS for React app (Update origin if necessary)
app.use(cors({ origin: 'http://localhost:5173' }));

// Proxy route for Reddit API
app.get('/api/reddit', async (req, res) => {
  const subreddit = req.query.subreddit || 'all'; // Get subreddit from query or default to 'all'

  try {
    // Step 1: Obtain access token from Reddit
    const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', null, {
      auth: { username: CLIENT_ID, password: CLIENT_SECRET },
      params: { grant_type: 'client_credentials' },
      headers: { 'User-Agent': USER_AGENT },
    });

    const accessToken = tokenResponse.data.access_token; // Extract access token

    // Step 2: Fetch subreddit data
    const redditResponse = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot.json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include access token
        'User-Agent': USER_AGENT,
      },
    });

    // Send subreddit data to React frontend
    res.json(redditResponse.data);
  } catch (error) {
    console.error('Error fetching Reddit API:', error.response?.data || error.message);

    // Handle Reddit errors or backend issues
    if (error.response && error.response.status) {
      // Return the exact Reddit error
      res.status(error.response.status).json({ error: `Reddit API Error: ${error.response.status}` });
    } else {
      // Return a generic backend error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Start the server
app.listen(3001, () => console.log('Backend running at http://localhost:3001'));
