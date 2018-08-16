import React from 'react';
import PropTypes from 'prop-types';
import Color from './Color';

const defaultStyles = {
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '900',
  margin: '10px',
  display: 'flex',
  flexDirection: 'row',
  border: '5px solid #fff'
};

const ColorInspector = ({
  colors,
  styles,
  isPlaceHolder
}) => {
  return <div style={styles || defaultStyles}>
    { colors.map((col, index) => <Color {...col} key={index} isPlaceHolder={isPlaceHolder} />)}
  </div>;
};

ColorInspector.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.shape({
    hex: PropTypes.string.isRequired,
    rgb: PropTypes.string.isRequired
  })).isRequired,
  styles: PropTypes.object
};

export default ColorInspector;