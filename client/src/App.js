import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import AffectivaFacialRecognition from './components/Recognition/AffectivaFacialRecognition';

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
          {this.state.testRequest}
        </p>
        <h1>Work</h1>
        <AffectivaFacialRecognition />
      </div>
    );
  }
}

export default App;
