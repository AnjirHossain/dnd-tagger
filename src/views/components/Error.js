import React from 'react';
import PropTypes from 'prop-types';

const defaultErrorStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  color: '#F44336',
  width: '100%',
  padding: '5vw'
};

const Error = ({
  type,
  message,
  dismissError
}) => (
  <span style={defaultErrorStyles}>
    {`${type} - ${message}!`}
    <button type="button"
      style={{
        maxWidth: '30px',
        MozAppearance: 'none',
        WebkitAppearance: 'none',
        margin: '0px 5px',
        appearance: 'none',
        color: '#F44336',
        border: '2px solid #F44336',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
      onClick={dismissError}>
      x
    </button>
  </span>
);

Error.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Error;