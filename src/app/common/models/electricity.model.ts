export enum ActewAGLElectricityUsage {
  Solar = 'Solar',
  Offpeak = 'Offpeak',
  Shoulder = 'Shoulder',
  Peak = 'Peak',
}

export interface ActewAGLElectricityCost {
  usageType: ActewAGLElectricityUsage;
  rate: number;
  quantity: number;
  gst: number;
  total: number;
}

/**
 * Get default ACTEWAGL electricity cost list
 * @returns (ActewAGLElectricityCost[])
 */
export const getDefaultActewAGLElectricityCostList =
  (): ActewAGLElectricityCost[] => {
    return [
      {
        usageType: ActewAGLElectricityUsage.Peak,
        rate: 0.286,
        quantity: 0,
        gst: 0.1,
        total: 0,
      },
      {
        usageType: ActewAGLElectricityUsage.Shoulder,
        rate: 0.21,
        quantity: 0,
        gst: 0.1,
        total: 0,
      },
      {
        usageType: ActewAGLElectricityUsage.Offpeak,
        rate: 0.170591,
        quantity: 0,
        gst: 0.1,
        total: 0,
      },
      {
        usageType: ActewAGLElectricityUsage.Solar,
        rate: -0.06,
        quantity: 0,
        gst: 0,
        total: 0,
      },
    ];
  };
