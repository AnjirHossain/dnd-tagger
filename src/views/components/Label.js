import React from 'react';
import PropTypes from 'prop-types';

const Label = ({
  text,
  styles
}) => (<span style={styles}>
  {`#${text}`}
</span>);

Label.propTypes = {
  text: PropTypes.string.isRequired
};

Label.defaultProps = {
  styles: {
    marginRight: '5px',
    marginBottom: '5px',
    padding: '5px',
    backgroundColor: '#eee'
  }
};

export default Label;