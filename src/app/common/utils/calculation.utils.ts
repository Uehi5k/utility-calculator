/**
 * Fix rounding issue with float numbers
 * @param a (number)
 * @returns (number)
 */
export const roundingFloatIssue = (a: number) => {
  return Math.round(a * 100) / 100;
};
