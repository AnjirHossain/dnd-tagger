import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

const defaultStyles = {
  margin: '10px',
  display: 'flex',
  flexFlow: 'row wrap'
};

const LabelList = ({
  labels,
  styles,
  noLabels
}) => {
  let labelsContent = noLabels ? noLabels : (labels ? labels.map((lText, lIndex) => {
    return <Label text={lText} key={lIndex} />
  }) : (<span className='blinkers'>
    loading labels...
  </span>));

  return <div style={styles || defaultStyles}>
    { labelsContent }
  </div>;
};

LabelList.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  styles: PropTypes.object
};

export default LabelList;