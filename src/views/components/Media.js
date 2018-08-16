import React from 'react';
import PropTypes from 'prop-types';

const defaultMediaStyles = {
  width: '300px'
};

const Media = ({
  src,
  alt,
  styles
}) => (
  <div>
    <img src={src}
      alt={alt}
      style={styles || defaultMediaStyles} />
  </div>
);

Media.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  styles: PropTypes.object
};

export default Media;