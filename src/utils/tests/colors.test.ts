// Copyright 2020 Cognite AS
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { getColorByString, getColorFromPercentage } from '../colors';

configure({ adapter: new Adapter() });

describe('colors', () => {
  describe('getColorByString', () => {
    it.each`
      param       | expected
      ${'string'} | ${'#8B0707'}
    `(
      'Should return element from ColorList array upon $param input',
      ({ param, expected }) => {
        expect(getColorByString(param)).toBe(expected);
      }
    );
  });

  describe('getColorFromPercentage', () => {
    it.each`
      input  | expected
      ${0.1} | ${'hsl(12,69%,72%)'}
      ${1}   | ${'hsl(120,69%,72%)'}
      ${2.5} | ${'hsl(300,69%,72%)'}
    `(
      'Should return HSL code in hue range 0 - 360 degree, where 1 input is 120 degrees',
      ({ input, expected }) => {
        expect(getColorFromPercentage(input)).toBe(expected);
      }
    );
  });
});
