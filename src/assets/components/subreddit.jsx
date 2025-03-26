import React, { useRef, useState } from "react";

const Subreddit = () => {
  const [inputValue, setInputValue] = useState("");
  const dialogRef = useRef(null);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeDialog = (e) => {
    e.preventDefault();
    if (dialogRef.current) {
      setInputValue("")
      dialogRef.current.close();
    }
  };
  
  const handleInputChange = (e)=>{
    setInputValue(e.target.value)
  }

  const fetchReddit = (e) => {
    e.preventDefault();
    console.log(inputValue)
  };

  return (
    <div className="reddit-card p-2">
      <div className="header">
        <i onClick={openDialog} className="fa-solid fa-plus"></i>
      </div>
      <div className="main"></div>
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
