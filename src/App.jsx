import React, { Component } from "react";
import Subreddit from "./assets/components/subreddit";

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col border border-dark">
            <Subreddit />
          </div>
          <div className="col border border-dark">
            <Subreddit />
          </div>
          <div className="col border border-dark">
            <Subreddit />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
