import { Injectable, signal } from '@angular/core';
import { parse } from 'date-fns';
import {
  ActewAGLElectricityCost,
  ActewAGLElectricityUsage,
  ActewAGLElectricityUsageRate,
  getDefaultActewAGLElectricityCostList,
  getDefaultActewAGLElectricityUsageRateList,
} from '../../common/models/electricity.model';

@Injectable({
  providedIn: 'root',
})
export class ElectricityCalculationService {
  private actewAGLElectricityUsageRateListSignal = signal<
    ActewAGLElectricityUsageRate[]
  >([]);
  readonly actewAGLElectricityUsageRateList =
    this.actewAGLElectricityUsageRateListSignal.asReadonly();

  private rateListLocalStorageKey = 'actewRateList';

  /**
   * Update usage rate
   * @param usageType (ActewAGLElectricityUsage)
   * @param newRate (number)
   */
  updateUsageRate(usageType: ActewAGLElectricityUsage, newRate: number) {
    this.actewAGLElectricityUsageRateListSignal.update((list) => {
      const type = list.find((l) => l.usageType === usageType);
      if (type) {
        type.rate = newRate;
      }
      return [...list];
    });
  }

  /**
   * Save rate to local storage for future usage
   */
  saveRateToLocalStorage() {
    localStorage.setItem(
      this.rateListLocalStorageKey,
      JSON.stringify(this.actewAGLElectricityUsageRateListSignal())
    );
  }

  returnToDefaultRate() {
    localStorage.removeItem(this.rateListLocalStorageKey);
    this.checkSavedRate();
  }

  /**
   * Check saved rate
   */
  checkSavedRate() {
    const savedData = localStorage.getItem(this.rateListLocalStorageKey);
    if (savedData) {
      this.actewAGLElectricityUsageRateListSignal.update(
        () => JSON.parse(savedData) as ActewAGLElectricityUsageRate[]
      );
    } else {
      this.actewAGLElectricityUsageRateListSignal.update(() =>
        getDefaultActewAGLElectricityUsageRateList()
      );
    }
  }

  /**
   * Generate ActewAGL Electricity cost list
   * @returns (ActewAGLElectricityCost[])
   */
  generateActewAGLElectricityCostList() {
    const list = this.actewAGLElectricityUsageRateList();
    return getDefaultActewAGLElectricityCostList(
      list.find((l) => l.usageType === ActewAGLElectricityUsage.Peak)?.rate,
      list.find((l) => l.usageType === ActewAGLElectricityUsage.Shoulder)?.rate,
      list.find((l) => l.usageType === ActewAGLElectricityUsage.Offpeak)?.rate,
      list.find((l) => l.usageType === ActewAGLElectricityUsage.Solar)?.rate
    );
  }

  /**
   * Get date period
   * @param dateCostBreakdowns (Record<string, ActewAGLElectricityCost[]>)
   * @returns ({ fromDate: string, toDate: string })
   */
  getDatePeriod(dateCostBreakdowns: Record<string, ActewAGLElectricityCost[]>) {
    const dates = Object.keys(dateCostBreakdowns).sort(
      (a, b) =>
        parse(a, 'dd/MM/yyyy', new Date()).getTime() -
        parse(b, 'dd/MM/yyyy', new Date()).getTime()
    );
    return { fromDate: dates[0], toDate: dates[dates.length - 1] };
  }
}
