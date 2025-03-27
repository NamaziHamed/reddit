import React, { useRef, useState, useEffect } from "react";

const Subreddit = () => {
  const [inputValue, setInputValue] = useState("");
  const [redditData, setRedditData] = useState("");
  const [isData, setIsData] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ display: "none" });
  const dialogRef = useRef(null);
  const dropdownRef = useRef(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownStyle({ display: "none" })
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

    const saveData = (data) => {
      setRedditData(data.data.children);
    };

    const authCode =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQzMTUxNzYxLjUxNjM2MiwiaWF0IjoxNzQzMDY1MzYxLjUxNjM2MSwianRpIjoiZExBMUtfNkN2TFRUeW4zWnUtcjFWZmxnQVg1ZFVBIiwiY2lkIjoiam5BZ0NuU0JKazhxdzROWEUxZXRaZyIsImxpZCI6InQyXzFtMXc1dWVmNmUiLCJhaWQiOiJ0Ml8xbTF3NXVlZjZlIiwibGNhIjoxNzQzMDY0OTUwNjA1LCJzY3AiOiJlSnlLVnRKU2lnVUVBQURfX3dOekFTYyIsImZsbyI6OX0.lCRUC7wBJ3yYjV403mo5o4st2IBe5RQQAGOYJwJY6irtttG8hdnpfwOHj1TOhX88djsoCRkZjhTZF_zj_3EJ7kVLEe9848mpbxlRQ0h-8ackj3C_kh0mbpGMjoy9HIJ_HoG8nQYMypz9Y2ftSgKlVCq4a-roBmo8VI2c7pRDlLqt96Inl3yvb_PQGeLTg0e5ft_f1rIeXVcvqpL3Ur0c6-m8X_k1X6D7DUpvNatB8bvdnODY3o3ftem6RoD4GvHNlyMFoF9Br36LStuxmbR_O05FSQv5oN81_7mTVx3qxJVnH1QxuOBrySbvh9pT7repxAoAqd9wsSj0YR3BIK3lyg";

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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      data.kind
        ? saveData(data)
        : alert("Wrong subreddit name or restricted subreddit!");
    } catch (err) {
      console.error("Error fetching subreddit data:", err);
    }
    setIsData(true);
    closeDialog(e);
  };

  const handleDropdown = () => {
    dropdownStyle.display === "none"
      ? setDropdownStyle({ display: "block" })
      : setDropdownStyle({ display: "none" });
  };

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
                <a className="dropdown-item">Refresh</a>
                <a className="dropdown-item">Delete</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="main pt-5">
        {Object.values(redditData).map((i, index) => (
          <a key={index} href={i.data.url} target="_blank" className="subreddit-item">
            {i.data.title}
          </a>
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
