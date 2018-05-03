import React from 'react';

const EmotionStats = ({ timestamp, numFaces, emotions }) => (
  <div>
    <p>{timestamp}</p>
    <br />
    <p>{numFaces}</p>
    <br />
    <p>{Object.entries(emotions)}</p>
  </div>
);

export default EmotionStats;
