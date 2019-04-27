module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx|ts)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'json', 'node'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  modulePaths: ['./src'],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "<rootDir>/node_modules/jest-css-modules-transform",
  },
  transformIgnorePatterns: [
    "\/node_modules\/(?!three\/*)"
  ]
};
