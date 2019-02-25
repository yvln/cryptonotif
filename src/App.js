import React, { Component } from 'react';

import Form from './Components/Form';
import List from './Components/List';
import { initializeFirebase } from './firebase';

import './App.scss';

class App extends Component {
  state = {
    isInitialized: false,
  };

  componentDidMount() {
    initializeFirebase();
    this.setState({
      isInitialized: true,
    });
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }

    return (
      <div className="App">
        <Form />
        <List />
      </div>
    );
  }
}

export default App;
