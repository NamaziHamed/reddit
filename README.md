# Subreddit Explorer
Subreddit Explorer is a React-based web application designed to fetch and display subreddit data using Reddit's API. To securely handle API requests and bypass common issues like CORS errors, the app employs a Node.js backend as a proxy server. This ensures sensitive credentials are protected and the frontend operates seamlessly.

# Features
Search Subreddits: Search for any subreddit and fetch its "hot" posts.

View Data: Displays post titles and scores with direct links to the posts.

Secure API Calls: Utilizes Node.js for secure interaction with Reddit's API.

Bypass CORS: Solves cross-origin issues by routing all API requests through a backend.

Dynamic UI: User-friendly interface with loading indicators, error handling, and data refresh capabilities.

# How the App Works
**Backend**
Node.js Server:

A lightweight Node.js backend is implemented using the Express framework.

The backend handles API calls to Reddit, including OAuth authentication, fetching subreddit data, and passing the response to the frontend.

Secure Authentication:

The backend uses Reddit's OAuth2 client_credentials flow to obtain an access token.

It keeps the CLIENT_ID and CLIENT_SECRET secure by storing them on the server, preventing exposure to frontend users.

**CORS Bypass:**

The backend serves as a proxy server, bypassing CORS issues that occur when directly calling Reddit's API from the frontend.

#Frontend
**React Application:**

The frontend is built with React and includes a user-friendly interface for searching and exploring subreddit data.

The fetchRedditData function communicates exclusively with the backend to retrieve data.

**Interactive Features:**

Search subreddits via a modal dialog.

View subreddit posts with scores and clickable links.

Refresh or delete fetched data dynamically.

**Error Handling:**

Displays loading indicators while fetching data.

Handles and displays meaningful error messages for issues like invalid subreddits or failed backend responses.

# Technologies Used
**Frontend:**
React: For building the user interface.

Bootstrap: For styling and responsive design.

JavaScript (ES6): For state management, event handling, and API integration.

**Backend:**
Node.js: For the server-side runtime environment.

Express: For handling HTTP requests.

Axios: For making HTTP requests to Reddit's API.

CORS: To manage cross-origin requests.
