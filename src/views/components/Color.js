import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

const defaultUnitStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '15px'
};
const colorUnitPropTypes = {
  rgb: PropTypes.string.isRequired,
  hex: PropTypes.string.isRequired
};

const ColorLabelsCard = ({
  rgb,
  hex
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column'
  }}>
    <span>{`RGB: ${rgb}`}</span>
    <span>{`HEX: ${hex}`}</span>
  </div>
);

ColorLabelsCard.propTypes = colorUnitPropTypes;

const Color = ({
  hex,
  rgb,
  isPlaceHolder
}) => (
  <Popover content={<ColorLabelsCard hex={hex} rgb={rgb} />}>
    <span className={ isPlaceHolder ? 'blinkers' : null } style={{
    ...defaultUnitStyles,
    ...{
      backgroundColor: rgb
    }
  }}></span>
  </Popover>
);

Color.propTypes = {
  ...colorUnitPropTypes,
  isPlaceHolder: PropTypes.bool.isRequired
};

export default Color;