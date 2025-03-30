import React, { useRef, useState, useEffect } from "react";

// Subreddit Component
const Subreddit = () => {
  // State variables
  const [inputValue, setInputValue] = useState(""); // Stores the user's input for subreddit name
  const [redditData, setRedditData] = useState(""); // Stores fetched data from the Reddit API
  const [isData, setIsData] = useState(false); // Determines whether subreddit data is displayed
  const [isLoading, setIsLoading] = useState(false); // Indicates loading state
  const [dropdownStyle, setDropdownStyle] = useState({ display: "none" }); // Controls dropdown menu visibility
  const [error, setError] = useState(null); // Stores error messages



  // Refs for dropdown and dialog elements
  const dialogRef = useRef(null); // Reference for the dialog element
  const dropdownRef = useRef(null); // Reference for the dropdown menu element

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Add listener for clicks outside dropdown
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener when component unmounts
    };
  }, []);

  // Handles clicks outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownStyle({ display: "none" }); // Close dropdown menu
    }
  };

  // Opens the dialog for entering subreddit name
  const openDialog = () => {
    if (dialogRef.current) {
      setInputValue(""); // Reset input value
      dialogRef.current.showModal(); // Show the dialog
    }
  };

  // Closes the dialog
  const closeDialog = (e) => {
    e.preventDefault();
    if (dialogRef.current) {
      dialogRef.current.close(); // Close the dialog
    }
  };

  // Updates the state when user types in the input field
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Store the input value in state
  };

  // Fetches data from the Reddit API based on input
  const fetchRedditData = async (subreddit) => {
    setIsLoading(true); // Start loading indicator
    try {
      // Make a request to your backend instead of the Reddit API directly
      const response = await fetch(`http://localhost:3001/api/reddit?subreddit=${subreddit}`, {
        method: 'GET', // Backend handles the HTTP method
        headers: {
          'Content-Type': 'application/json', // Ensure JSON response handling
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch subreddit data: ${response.status}`);
      }
  
      const redditData = await response.json();
  
      // Ensure subreddit data is in the correct format
      if (redditData && redditData.data && redditData.data.children) {
        setRedditData(redditData.data.children); // Update state with subreddit posts data
        setIsData(true); // Indicate data is available
      } else {
        throw new Error('Invalid subreddit data received');
      }
    } catch (error) {
      console.error('Error fetching subreddit data:', error.message);
      alert(error.message); // Display error to the user
      setRedditData(""); // Clear previous data on error
      setIsData(false); // Reset data indicator
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };
  
  

  // Handles the search operation from the dialog
  const fetchReddit = async (e) => {
    e.preventDefault();
    closeDialog(e); // Close dialog
    await fetchRedditData(inputValue); // Fetch data for the entered input
  };

  // Refreshes the subreddit data
  const handleRefresh = async () => {
    setIsLoading(true); // Start loading
    setRedditData(""); // Clear existing data
    setDropdownStyle({ display: "none" }); // Close dropdown menu
    await fetchRedditData(inputValue, true); // Fetch data for refresh
  };

  // Deletes current subreddit data and clears input
  const handleDelete = () => {
    setInputValue(""); // Reset input field
    setRedditData(""); // Clear subreddit data
    setIsData(false); // Hide the header
    setDropdownStyle({ display: "none" }); // Close dropdown menu
  };

  // Toggles the dropdown menu visibility
  const handleDropdown = () => {
    setDropdownStyle((prevStyle) => ({
      display: prevStyle.display === "none" ? "block" : "none",
    }));
  };

  return (
    <div className="reddit-card p-2">
      {/* Header section */}
      {!isData && (
        <div className="header p-2">
          <i
            onClick={openDialog}
            className="fa-solid fa-plus tomato-rounded"
          ></i>
        </div>
      )}
      {isData && (
        <div className="header p-2">
          <div className="row">
            <span className="text-start col fs-2">{inputValue}</span>
            <div className="text-end col dropdown" ref={dropdownRef}>
              <button onClick={handleDropdown} className="btn dropdown-btn">
                <i className="fa-solid fa-ellipsis-vertical fs-2"></i>
              </button>
              <div id="dropdown-menu" style={dropdownStyle}>
                <a className="dropdown-item" onClick={handleRefresh}>
                  Refresh
                </a>
                <a className="dropdown-item" onClick={handleDelete}>
                  Delete
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content section */}
      <div className="main pt-5">
        {isLoading && <div>Loading...</div>} {/* Loading indicator */}
        {redditData &&
          redditData.map((item, index) => (
            <div
              className="subreddit-item"
              key={index}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className="row">
                <span className="col-3 col-md-2">{item.data.score}</span>
                <a href={item.data.url} target="_blank" rel="noreferrer" className="col">
                  {item.data.title}
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Dialog section for entering subreddit name */}
      <dialog ref={dialogRef}>
        <form onSubmit={fetchReddit}>
          <label htmlFor="user-input" className="form-label">
            Enter Subreddit name:
          </label>
          <input
            value={inputValue}
            type="text"
            name="user-input"
            id="user-input"
            className="form-control"
            onChange={handleInputChange}
          />
          <div className="pt-2">
            <div className="row justify-content-around">
              <button onClick={fetchReddit} className="btn btn-success col-4">
                Search
              </button>
              <button onClick={closeDialog} className="btn btn-danger col-4">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Subreddit;
