import React, { Component } from 'react';
import $ from 'jquery';
import EmotionSeriesChart from './EmotionSeriesChart';
import '../../../node_modules/dc/dc.min.css';

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
      canMount: false,
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
        const timestampFixed = +timestamp.toFixed(2);
        if (this.state.emotionSeriesChart) {
          const newBatchRecords = Object.entries(faces[0].emotions).reduce((newBatch, [name, value]) => {
            newBatch.push({ name, value, timestamp: timestampFixed });
            return newBatch;
          }, []);
          this.state.emotionSeriesChart.addRecords(newBatchRecords);
        }
        this.drawFeaturePoints(image, faces[0].featurePoints);
      }
    });
  }

  componentDidMount = () => {
    if (!this.state.emotionSeriesChart) {
      console.log('Making chart!');
      this.setState(() => ({ emotionSeriesChart: new EmotionSeriesChart(this.results) }), () => console.log('chart created!'));
    }
  }

  startDetector = () => {
    const { detector } = this.state;
    if (detector && !detector.isRunning) detector.start();
  }

  stopDetector = () => {
    const { detector } = this.state;
    if (detector && detector.isRunning) {
      detector.removeEventListener();
      detector.stop();
    }
  }

  resetDetector = () => {
    const { detector } = this.state;
    if (detector && detector.isRunning) {
      detector.reset();
    }
  }

  drawFeaturePoints = (img, featurePoints) => {
    if ($('#face_video_canvas')[0]) {
      const contxt = $('#face_video_canvas')[0].getContext('2d');
      const hRatio = contxt.canvas.width / img.width;
      const vRatio = contxt.canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);    
      contxt.strokeStyle = '#FFFFFF';
      for (let id of Object.values(featurePoints)) {
        contxt.beginPath();
        contxt.arc(id.x, id.y, 2, 0, 2 * Math.PI);
        contxt.stroke();
      }
    }
  }

  results = [
    { timestamp: 0, name: 'joy', value: 0 },
    { timestamp: 0, name: 'sadness', value: 0 },
    { timestamp: 0, name: 'disgust', value: 0 },
    { timestamp: 0, name: 'contempt', value: 0 },
    { timestamp: 0, name: 'anger', value: 0 },
    { timestamp: 0, name: 'fear', value: 0 },
    { timestamp: 0, name: 'surprise', value: 0 },
    { timestamp: 0, name: 'valence', value: 0 },
    { timestamp: 0, name: 'engagement', value: 0 }
  ];

  render = () => (
    <div>
      Affectiva!
      <div id="emotionSeriesChart" style={{ minHeight: '400px' }} />
      <div id="counts" className="dc-data-count" />
      <div id="emotionsDonut" />
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
