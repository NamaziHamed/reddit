import React, { Component } from "react";
import Subreddit from "./assets/components/subreddit";
import DataContext from "./assets/context/dataContext.jsx";

class App extends Component {
  render() {
    return (
      <DataContext.Provider value={
       { setData: this.setData}
      }>
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
      </DataContext.Provider>
    );
  }
}

export default App;
