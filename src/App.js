import React, { Component } from "react";

import Form from "./Components/Form";
import List from "./Components/List";
import { initializeFirebase } from "./firebase";

import "./App.css";

class App extends Component {
  state = {
    isInitialized: false
  };

  componentDidMount() {
    initializeFirebase();
    this.setState({
      isInitialized: true
    });
  }

  render() {
    return this.state.isInitialized ? (
      <div className="App">
        <Form />
        <List />
      </div>
    ) : (
      "Loading..."
    );
  }
}

export default App;
