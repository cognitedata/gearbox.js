/**
 * This is wrapper for react-odometerjs component that replaces
 * default odometer theme. Origin - https://github.com/HubSpot/odometer/blob/master/themes/odometer-theme-default.css
 * It's needed to avoid loading odometer theme CSS from CDN.
 */

import styled from 'styled-components';

const StyledOdometer = styled.div`
  .odometer.odometer-auto-theme,
  .odometer.odometer-theme-default {
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }
  .odometer.odometer-auto-theme .odometer-digit,
  .odometer.odometer-theme-default .odometer-digit {
    display: inline-block;
    vertical-align: middle;
    position: relative;
  }
  .odometer.odometer-auto-theme .odometer-digit .odometer-digit-spacer,
  .odometer.odometer-theme-default .odometer-digit .odometer-digit-spacer {
    display: inline-block;
    vertical-align: middle;
    visibility: hidden;
  }
  .odometer.odometer-auto-theme .odometer-digit .odometer-digit-inner,
  .odometer.odometer-theme-default .odometer-digit .odometer-digit-inner {
    text-align: left;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .odometer.odometer-auto-theme .odometer-digit .odometer-ribbon,
  .odometer.odometer-theme-default .odometer-digit .odometer-ribbon {
    display: block;
  }
  .odometer.odometer-auto-theme .odometer-digit .odometer-ribbon-inner,
  .odometer.odometer-theme-default .odometer-digit .odometer-ribbon-inner {
    display: block;
    backface-visibility: hidden;
  }
  .odometer.odometer-auto-theme .odometer-digit .odometer-value,
  .odometer.odometer-theme-default .odometer-digit .odometer-value {
    display: block;
    transform: translateZ(0);
  }
  .odometer.odometer-auto-theme
    .odometer-digit
    .odometer-value.odometer-last-value,
  .odometer.odometer-theme-default
    .odometer-digit
    .odometer-value.odometer-last-value {
    position: absolute;
  }
  .odometer.odometer-auto-theme.odometer-animating-up .odometer-ribbon-inner,
  .odometer.odometer-theme-default.odometer-animating-up
    .odometer-ribbon-inner {
    transition: transform 2s;
  }
  .odometer.odometer-auto-theme.odometer-animating-up.odometer-animating
    .odometer-ribbon-inner,
  .odometer.odometer-theme-default.odometer-animating-up.odometer-animating
    .odometer-ribbon-inner {
    transform: translateY(-100%);
  }
  .odometer.odometer-auto-theme.odometer-animating-down .odometer-ribbon-inner,
  .odometer.odometer-theme-default.odometer-animating-down
    .odometer-ribbon-inner {
    transform: translateY(-100%);
  }
  .odometer.odometer-auto-theme.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner,
  .odometer.odometer-theme-default.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner {
    transition: transform 2s;
    transform: translateY(0);
  }

  .odometer.odometer-auto-theme,
  .odometer.odometer-theme-default {
    font-family: 'Helvetica Neue', sans-serif;
    line-height: 1.1em;
  }
  .odometer.odometer-auto-theme .odometer-value,
  .odometer.odometer-theme-default .odometer-value {
    text-align: center;
  }
`;

export default StyledOdometer;
