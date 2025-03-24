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
  hours: string;
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
        hours: '7am-9am and 5pm-8pm daily',
      },
      {
        usageType: ActewAGLElectricityUsage.Shoulder,
        rate: 0.21,
        quantity: 0,
        gst: 0.1,
        total: 0,
        hours: '9am-5pm and 8pm-10pm daily',
      },
      {
        usageType: ActewAGLElectricityUsage.Offpeak,
        rate: 0.170591,
        quantity: 0,
        gst: 0.1,
        total: 0,
        hours: 'All other times (10pm - 7am)',
      },
      {
        usageType: ActewAGLElectricityUsage.Solar,
        rate: -0.06,
        quantity: 0,
        gst: 0,
        total: 0,
        hours: '',
      },
    ];
  };
