import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import AffectivaCanvas from './components/Recognition/AffectivaCanvas';
import AffectivaFacialRecognition from './components/Recognition/AffectivaFacialRecognition';

class App extends Component {
  state = {
    testRequest: '',
    canvasIsReady: false,
  }

  componentDidMount = async () => {
    try {
      const { data } = await axios.get('/api/hello');
      this.setState({ testRequest: data });
    } catch (err) {
      this.setState({ testRequest: 'Nope!' });
    }
  }

  // This is used to enforce the canvas affectiva renders to,
  // affectivacanvas, is rendered before everything else related
  // to affectiva. If this was not here, it would not bind to the 
  // DOM correctly. Kind of hacky, if there's a better way definitely do it.
  toggleCanvasReady = () => this.setState(prevState => ({ canvasIsReady: !prevState.canvasIsReady }));

  render = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <AffectivaCanvas toggleCanvasReady={this.toggleCanvasReady} />
      <p className="App-intro">
        Hello!
        Is the API working?
        {this.state.testRequest}
      </p>
      <h1>Work</h1>
      {
        this.state.canvasIsReady
        &&
        <AffectivaFacialRecognition />
      }
    </div>
  );
}

export default App;
