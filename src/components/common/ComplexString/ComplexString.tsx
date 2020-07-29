// Copyright 2020 Cognite AS
import React from 'react';
import { ID } from '../../../interfaces';

export interface ComplexStringProps {
  input: string;
  [name: string]: ID;
}

/**
 * Input string should has {{ <key> }} structure to embed provided values
 * @param props <ComplexStringProps> – contain <input> property – string with <keys> to be replaced
 * @example { input: 'Hey, {{ developer }}', developer: 'Dude' }
 */
export const ComplexString = (props: ComplexStringProps) => {
  const { input, ...rest } = props;
  let resultString = input;

  Object.keys(rest).forEach(key => {
    const regexp = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');

    // @ts-ignore
    resultString = resultString.replace(
      regexp,
      typeof rest[key] !== 'undefined' ? rest[key].toString() : ''
    );
  });

  return <>{resultString}</>;
};
