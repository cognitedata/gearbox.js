// Copyright 2020 Cognite AS
/**
 * Convert input into a safe CDP project name format ([a-z0-9\-]+)
 *
 * @param input possible CDP project name
 *
 * @return the sanitized CDP project name
 */
export const sanitizeTenant = (input: string): string =>
  input
    // CDP projects cannot have upper-case characters
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '');

/**
 * Check if input empty, consist of spaces or its a number
 * @param input – checked value
 * @return <true> if input empty, <false> otherwise
 */
export function isEmptyString(input: string | number): boolean {
  return typeof input === 'number'
    ? false
    : !Boolean(input && input.replace(/\s/gi, ''));
}
