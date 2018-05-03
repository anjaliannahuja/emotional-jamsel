import React, { Component } from 'react';
import $ from 'jquery';
import EmotionStats from './EmotionStats';

const { affdex } = window;

class AffectivaFacialRecognition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayLoadError: false,
      detector: new affdex.CameraDetector(
        $('#affdex_elements')[0],
        640,
        480,
        affdex.FaceDetectorMode.LARGE_FACES,
      ),
      results: {
        timestamp: 0,
        numFaces: 0,
        emotions: {},
      },
    };

    const { detector } = this.state;
    // Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions();
    detector.addEventListener('onInitializeSuccess', () => this.setState({ displayLoadError: false }));
    detector.addEventListener('onInitializeFailure', () => this.setState({ displayLoadError: true }));
    // Add a callback to notify when camera access is allowed
    detector.addEventListener('onWebcamConnectSuccess', () => console.log('Webcam access granted!'));

    // Add a callback to notify when camera access is denied
    detector.addEventListener('onWebcamConnectFailure', () => console.log('Webcam access denied'));

    // Add a callback to notify when detector is stopped
    detector.addEventListener('onStopSuccess', () => {});
    detector.addEventListener('onImageResultsSuccess', (faces, image, timestamp) => {
      if (faces[0]) {
        this.setState(() => ({
          results: {
            timestamp: timestamp.toFixed(2),
            numFaces: faces.length,
            emotions: faces[0].emotions,
          },
        }));
        this.drawFeaturePoints(image, faces[0].featurePoints);
      }
    });
  }

  resetResults = () => this.setState(() => ({
    results: {
      timestamp: 0,
      numFaces: 0,
      emotions: {},
    },
  }));

  startDetector = () => {
    const { detector } = this.state;
    if (detector && !detector.isRunning) detector.start();
    console.log('started detector!');
  }

  stopDetector = () => {
    const { detector } = this.state;
    if (detector && detector.isRunning) {
      detector.removeEventListener();
      detector.stop();
      this.resetResults();
    }
  }

  resetDetector = () => {
    const { detector } = this.state;
    if (detector && detector.isRunning) {
      detector.reset();
      this.resetResults();
    }
  }

  drawFeaturePoints = (img, featurePoints) => {
    if ($('#face_video_canvas')[0]) {
      const contxt = $('#face_video_canvas')[0].getContext('2d');
  
      const hRatio = contxt.canvas.width / img.width;
      const vRatio = contxt.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
  
      contxt.strokeStyle = "#FFFFFF";
      for (let id of Object.values(featurePoints)) {
        contxt.beginPath();
        contxt.arc(id.x,
          id.y, 2, 0, 2 * Math.PI);
        contxt.stroke();
  
      }
    }
  }


  render = () => (
    <div>
      Affectiva!
      <EmotionStats
        timestamp={this.state.results.timestamp}
        numFaces={this.state.results.numFaces}
        {...this.state.results.emotions}
      />
      <button id="start" onClick={() => this.startDetector()}>Start</button>
      <button id="stop" onClick={() => this.stopDetector()}>Stop</button>
      <button id="reset" onClick={() => this.resetDetector()}>Reset</button>
      {
        this.state.displayLoadError 
        ? <h3>Could not load affectiva</h3>
        : <h3>Affectiva loaded!</h3>
      }
    </div>
  );
}

export default AffectivaFacialRecognition;
