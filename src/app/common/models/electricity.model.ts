import {
  DEFAULT_OFFPEAK_RATE,
  DEFAULT_PEAK_RATE,
  DEFAULT_SHOULDER_RATE,
  DEFAULT_SOLAR_RATE,
} from './constant';

export enum ActewAGLElectricityUsage {
  Solar = 'Solar',
  Offpeak = 'Offpeak',
  Shoulder = 'Shoulder',
  SelfConsumption = 'Self Consumption',
  Peak = 'Peak',
}

export interface ActewAGLElectricityCost {
  usageType: ActewAGLElectricityUsage;
  rate: number;
  quantity: number;
  gst: number;
  total: number;
  hours: string;
}

export interface ActewAGLElectricityUsageRate {
  usageType: ActewAGLElectricityUsage;
  rate: number;
}

/**
 * Get default ActewAGL electricity cost list
 * @param peakRate (number)
 * @param shoulderRate (number)
 * @param offPeakRate (number)
 * @param solarRate (number)
 * @returns (ActewAGLElectricityCost[])
 */
export const getDefaultActewAGLElectricityCostList = (
  peakRate = DEFAULT_PEAK_RATE,
  shoulderRate = DEFAULT_SHOULDER_RATE,
  offPeakRate = DEFAULT_OFFPEAK_RATE,
  solarRate = DEFAULT_SOLAR_RATE
): ActewAGLElectricityCost[] => {
  return [
    {
      usageType: ActewAGLElectricityUsage.Peak,
      rate: peakRate,
      quantity: 0,
      gst: 0.1,
      total: 0,
      hours: '7am-9am and 5pm-8pm daily',
    },
    {
      usageType: ActewAGLElectricityUsage.Shoulder,
      rate: shoulderRate,
      quantity: 0,
      gst: 0.1,
      total: 0,
      hours: '9am-5pm and 8pm-10pm daily',
    },
    {
      usageType: ActewAGLElectricityUsage.Offpeak,
      rate: offPeakRate,
      quantity: 0,
      gst: 0.1,
      total: 0,
      hours: 'All other times (10pm - 7am)',
    },
    {
      usageType: ActewAGLElectricityUsage.SelfConsumption,
      rate: -shoulderRate,
      quantity: 0,
      gst: 0.1,
      total: 0,
      hours: 'Self-usage from Solar during daytime (Shoulder charge)',
    },
    {
      usageType: ActewAGLElectricityUsage.Solar,
      rate: solarRate,
      quantity: 0,
      gst: 0,
      total: 0,
      hours: '',
    },
  ];
};

/**
 * Get default ActewAGL electricity usage rate list
 * @param peakRate (number)
 * @param shoulderRate (number)
 * @param offPeakRate (number)
 * @param solarRate (number)
 * @returns (ActewAGLElectricityUsageRate[])
 */
export const getDefaultActewAGLElectricityUsageRateList = (
  peakRate = DEFAULT_PEAK_RATE,
  shoulderRate = DEFAULT_SHOULDER_RATE,
  offPeakRate = DEFAULT_OFFPEAK_RATE,
  solarRate = DEFAULT_SOLAR_RATE
): ActewAGLElectricityUsageRate[] => {
  return [
    {
      usageType: ActewAGLElectricityUsage.Peak,
      rate: peakRate,
    },
    {
      usageType: ActewAGLElectricityUsage.Shoulder,
      rate: shoulderRate,
    },
    {
      usageType: ActewAGLElectricityUsage.Offpeak,
      rate: offPeakRate,
    },
    {
      usageType: ActewAGLElectricityUsage.Solar,
      rate: solarRate,
    },
  ];
};
