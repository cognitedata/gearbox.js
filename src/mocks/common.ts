// Copyright 2020 Cognite AS
/**
 * Mock wait for Promise resolve after @param timeout
 *
 * @param ms milliseconds timeout
 *
 * @return resolved Promise
 */

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate random Number with @param (or default: 10) number of digits
 *
 * @param length possible positive digit
 *
 * @return randomized Number
 */

export const generateNumber = (length: number = 10): number => {
  if (length > 15) {
    return 0;
  }

  const aggregator = new Array(length).fill(null);

  return Number(
    aggregator.map(() => Math.floor(Math.random() * 10) || 1).join('')
  );
};
