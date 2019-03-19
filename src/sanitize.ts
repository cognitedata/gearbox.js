/**
 * Convert input into a safe CDP project name format ([a-z0-9\-]+)
 *
 * @param input possible CDP project name
 *
 * @return the sanitized CDP project name
 */
export const sanitizeTests = (input: string): string =>
  input
    // CDP projects cannot have upper-case characters
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '');
