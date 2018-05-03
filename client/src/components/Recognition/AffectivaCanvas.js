import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AffectivaCanvas extends Component {
  componentDidMount = () => this.props.toggleCanvasReady();

  // Give affectiva a place to bind everything.
  render = () => (
    <div id="affdex_elements" />
  );
}

AffectivaCanvas.propTypes = {
  toggleCanvasReady: PropTypes.func.isRequired,
};

export default AffectivaCanvas;
