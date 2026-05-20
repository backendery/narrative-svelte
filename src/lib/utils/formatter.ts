/**
 * Shortens a string by keeping the requested number of characters at both ends.
 *
 * @description Preserves the leading and trailing portions of a value so long identifiers stay
 * recognizable in compact UI spaces.
 * Returns an empty string for `undefined` or `''`, and the original string when it is already
 * short enough to fit without truncation.
 * @param text {string | undefined} String to be shortened.
 * @param chars {number} Number of characters to keep at the beginning and end of the string.
 * @returns {string} Shortened string with an ellipsis in the middle.
 * @example
 * ```ts
 * const result = getEllipsisStr('abcdefghij', 3);
 * console.log(result); // Output: "abc...hij"
 * ```
 */
export function getEllipsisStr(text?: string, chars = 6): string {
  // If the input is undefined or null and return an empty string if it is
  if (text === undefined || text === '') {
    return ''
  }
  // If the input string is shorter than twice the number of characters to keep
  // and return the original string if it is
  if (text.length <= chars * 2) {
    return text
  }
  // If the input string is longer than twice the number of characters to keep
  // and return the shortened string with ellipsis if it is
  return `${text.slice(0, chars)}...${text.slice(-chars)}`
}
