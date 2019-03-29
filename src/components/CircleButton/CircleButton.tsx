import React from 'react';
import PropTypes from 'prop-types';
import AntButton from 'antd/lib/button';

const propTypes = {
  iconType: PropTypes.string,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['secondary', 'primary', 'success', 'danger']),
  size: PropTypes.string,
  className: PropTypes.string,
  'data-test-id': PropTypes.string,
};

const defaultProps = {
  iconType: '',
  disabled: false,
  onClick: () => {},
  onMouseDown: () => {},
  type: 'secondary',
  size: '',
  className: '',
  'data-test-id': '',
};

const CircleButton = props => (
  <AntButton
    size="large"
    shape="circle"
    onClick={props.onClick}
    onMouseDown={props.onMouseDown}
    disabled={props.disabled}
    icon={props.iconType}
    className={`${
      props.size === 'extraLarge' ? 'extra-large-button' : ''
      } button-${props.type} ${props.className && props.className}`}
    data-test-id={props['data-test-id'] ? props['data-test-id'] : undefined}
  />
);

CircleButton.propTypes = propTypes;
CircleButton.defaultProps = defaultProps;

export default CircleButton;
