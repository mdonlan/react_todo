import React, { Component } from 'react';
import './App.css';

import Home from './components/Home';
import TopNav from './components/TopNav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNav />
        <Home />
      </div>
    );
  }
}

export default App;
