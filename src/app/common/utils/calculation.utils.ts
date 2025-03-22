import { ActewAGLElectricityCost } from '../models/electricity.model';

/**
 * Fix rounding issue with float numbers
 * @param a (number)
 * @returns (number)
 */
export const roundingFloatIssue = (a: number) => {
  return Math.round(a * 100) / 100;
};

/**
 * Calculate ActewAGL electricity cost total
 * @param cost (ActewAGLElectricityCost)
 * @returns (number)
 */
export const calculateActewAGLElectricityCostTotal = (
  cost: ActewAGLElectricityCost
): number => {
  return cost.rate * cost.quantity + cost.rate * cost.quantity * cost.gst;
};
