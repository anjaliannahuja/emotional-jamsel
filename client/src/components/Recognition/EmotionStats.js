import React from 'react';
import PropTypes from 'prop-types';

const EmotionStats = (props) => {
  const { timestamp, numFaces, ...emotions } = props;
  return (
    <div>
      {Object.entries(emotions).map(([name, value]) => (<Emotion name={name} value={value} />))}
    </div>
  );
};

EmotionStats.propTypes = {
  timestamp: PropTypes.number.isRequired,
  numFaces: PropTypes.number.isRequired,
  joy: PropTypes.number.isRequired,
  sadness: PropTypes.number.isRequired,
  disgust: PropTypes.number.isRequired,
  contempt: PropTypes.number.isRequired,
  anger: PropTypes.number.isRequired,
  fear: PropTypes.number.isRequired,
  surprise: PropTypes.number.isRequired,
  valence: PropTypes.number.isRequired,
  engagement: PropTypes.number.isRequired,
};

const Emotion = (name, value) => (
  <p>{`${name}: ${value.toFixed(2)}`}</p>
);

export default EmotionStats;
