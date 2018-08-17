import React from 'react';
import PropTypes from 'prop-types';
import Label from './Label';

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

  return <div style={styles}>
    { labelsContent }
  </div>;
};

LabelList.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  styles: PropTypes.object
};

LabelList.defaultProps = {
  styles: {
    margin: '10px 0px',
    display: 'flex',
    flexFlow: 'row wrap'
  }
};

export default LabelList;