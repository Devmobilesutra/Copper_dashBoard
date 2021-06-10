import React, { Component } from 'react';
import './styles/foundation.css';
import './styles/custom.css';
import './App.scss';
import Routes from './routes';

class App extends Component {

  render() {
    return (
      <div>
        <Routes />
      </div>
    )
  }
}

export default App;
