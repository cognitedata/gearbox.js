import React from 'react';

export interface ComplexStringProps {
  input: string;
  [name: string]: string | number;
}

/**
 * Input string should con
 * @param props
 * @constructor
 */

export const ComplexString = (props: ComplexStringProps) => {
  const { input, ...rest } = props;
  let resultString = input;

  Object.keys(rest).forEach(key => {
    const regexp = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');

    // @ts-ignore
    resultString = resultString.replace(regexp, rest[key]);
  });

  return <p>{resultString}</p>;
};
