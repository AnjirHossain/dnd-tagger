import React from 'react';
import PropTypes from 'prop-types';

const defaultStyles = {
  marginRight: '5px',
  marginBottom: '5px',
  padding: '5px',
  backgroundColor: '#eee'
};

const Label = ({
  text
}) => (<span style={defaultStyles}>
  {`#${text}`}
</span>);

Label.propTypes = {
  text: PropTypes.string.isRequired
};

export default Label;