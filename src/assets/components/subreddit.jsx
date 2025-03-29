import React, { useRef, useState, useEffect } from "react";

const Subreddit = () => {
  const [inputValue, setInputValue] = useState("");
  const [redditData, setRedditData] = useState("");
  const [isData, setIsData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ display: "none" });
  const dialogRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownStyle({ display: "none" });
    }
  };

  const openDialog = () => {
    if (dialogRef.current) {
      setInputValue("");
      dialogRef.current.showModal();
    }
  };

  const closeDialog = (e) => {
    e.preventDefault();
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchReddit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const saveData = (data) => {
      setRedditData(data.data.children);
    };

    const authCode =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQzMzE4NzAyLjM4MjE3OSwiaWF0IjoxNzQzMjMyMzAyLjM4MjE3OSwianRpIjoiVnJOWlNYa3BMdGRlTVZKMkZ6enNhNWd4VkwtZjlnIiwiY2lkIjoiam5BZ0NuU0JKazhxdzROWEUxZXRaZyIsImxpZCI6InQyXzFtMXc1dWVmNmUiLCJhaWQiOiJ0Ml8xbTF3NXVlZjZlIiwibGNhIjoxNzQzMDY0OTUwNjA1LCJzY3AiOiJlSnlLVnRKU2lnVUVBQURfX3dOekFTYyIsImZsbyI6OX0.p3HQMjbvnm0H6jhUptHsn2Tbm9C_RCr8kJ8Gi7p3Af2RxoESsrXPlLy99EkfJwhLHzdpRHGnkfA-4HZdEK4K63vOLHUemXDo-MF-FfaFsaX7icgOCTbDgXFj2ZKrPFzTfsx1f02_76Jt-HeJQKdH2uXQz2UhYK71okg1abi3hART_s1DCd1cHjzdcX-7eD-xpMUpqsponsc0fmHgidi1rD9tW6M-NsA3IiIxNN_y3JAdPIlcfKHQ4wUUh0Er-9vrzNB8BiZPj5qvlyKwamtTRGOnSaWXgBx856Aa0EYaiEg4Rg-chPLdby7GjbeVaGISJlzy3UM2GN5_BQjdsx5WeQ";

    try {
      const response = await fetch(
        `https://oauth.reddit.com/r/${inputValue}/.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authCode}`,
            "User-Agent": "client/1.0 (by hamed-namazi)",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          alert(
            "Subreddit does not exist! Please check the name and try again."
          );
        } else if (response.status === 403) {
          alert("This subreddit is restricted! Access is not allowed.");
        } else {
          alert(`An error occurred: HTTP status ${response.status}`);
        }
        setIsData(false); 
        return;
      }
      const data = await response.json();

      if (data.kind) {
        saveData(data);
        setIsData(true);
      } else {
        alert("Wrong subreddit name or restricted subreddit!");
        setIsData(false);
      }
    } catch (err) {
      console.error("Error fetching subreddit data:", err);
      alert("An error occurred while fetching data.");
      setIsData(false);
    }
    setIsLoading(false)
    closeDialog(e);
  };

  const handleDropdown = () => {
    dropdownStyle.display === "none"
      ? setDropdownStyle({ display: "block" })
      : setDropdownStyle({ display: "none" });
  };

    const handleRefresh = ()=>{
      setDropdownStyle({ display: "none" })
      fetchReddit()
    }

  return (
    <div className="reddit-card p-2">
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
                <a className="dropdown-item">Delete</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="main pt-5">
      {isLoading && <div >Loading...</div>}
        {Object.values(redditData).map((i, index) => (
          <div className="subreddit-item">
            <div className="row">
              <span className="col-3 col-md-2">{i.data.score}</span>
              <a key={index} href={i.data.url} target="_blank" className="col">
                {i.data.title}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog section */}
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
