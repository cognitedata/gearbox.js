export const ColorList = [
  '#0097e6',
  '#e1b12c',
  '#8E44AD',
  '#c23616',
  '#40739e',
  '#273c75',
  '#8c7ae6',
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
];

const hashCode = (a: string) =>
  String(a)
    .split('')
    .map(c => c.charCodeAt(0))
    .reduce((hash, char) => (31 * hash + char) | 0, 0);

export const getColorByString = (value: string) =>
  ColorList[
    ((hashCode(value) % ColorList.length) + ColorList.length) % ColorList.length
  ];

export const getColorFromPercentage = (value: number) => {
  const hue = (value * 120).toString(10);
  return ['hsl(', hue, ',69%,72%)'].join('');
};

export default {
  primary: '#304ffe',
  success: '#b8e986',
  danger: '#d32f2f',
  dark: '#546e7a',
  black: '#263238',
  grey: '#cccccc',
  light: '#f5f5f5',
  white: '#ffffff',
};
