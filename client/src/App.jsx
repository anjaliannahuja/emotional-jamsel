import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    testRequest: '',
  }

  componentDidMount = async () => {
    try {
      const { data } = await axios.get('/api/hello');
      this.setState({ testRequest: data });
    } catch (err) {
      this.setState({ testRequest: 'Nope!' });
    }
  }

  render = () => {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Hello!
          Is the API working?
          He
          {this.state.testRequest}
        </p>
      </div>
    );
  }
}

export default App;
