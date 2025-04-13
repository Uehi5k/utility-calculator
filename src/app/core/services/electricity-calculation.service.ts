import { Injectable, signal } from '@angular/core';
import { parse } from 'date-fns';
import {
  ActewAGLElectricityCost,
  ActewAGLElectricityUsage,
  ActewAGLElectricityUsageRate,
  getDefaultActewAGLElectricityCostList,
  getDefaultActewAGLElectricityUsageRateList,
} from '../../common/models/electricity.model';
import { DEFAULT_SUPPLY_RATE } from '../../common/models/constant';

@Injectable({
  providedIn: 'root',
})
export class ElectricityCalculationService {
  private actewAGLElectricityUsageRateListSignal = signal<
    ActewAGLElectricityUsageRate[]
  >([]);
  readonly actewAGLElectricityUsageRateList =
    this.actewAGLElectricityUsageRateListSignal.asReadonly();

  private supplyChargeRateSignal = signal<number>(DEFAULT_SUPPLY_RATE);
  readonly supplyChargeRate = this.supplyChargeRateSignal.asReadonly();

  private rateListLocalStorageKey = 'actewRateList';
  private supplyChargeRateStorageKey = 'supplyChargeRate';

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
   * Update supply charge rate
   * @param newRate (number) - new supply charge rate
   */
  updateSupplyChargeRate(newRate: number) {
    this.supplyChargeRateSignal.update(() => newRate);
  }

  /**
   * Save rate to local storage for future usage
   */
  saveRateToLocalStorage() {
    localStorage.setItem(
      this.rateListLocalStorageKey,
      JSON.stringify(this.actewAGLElectricityUsageRateListSignal())
    );
    localStorage.setItem(
      this.supplyChargeRateStorageKey,
      this.supplyChargeRateSignal().toString()
    );
  }

  /**
   * Return to default rate
   */
  returnToDefaultRate() {
    this.actewAGLElectricityUsageRateListSignal.update(() =>
      getDefaultActewAGLElectricityUsageRateList()
    );
    this.supplyChargeRateSignal.update(() => DEFAULT_SUPPLY_RATE);
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

    const savedSupplyRate = localStorage.getItem(
      this.supplyChargeRateStorageKey
    );
    if (savedSupplyRate) {
      const supplyRate = Number.parseFloat(savedSupplyRate);
      this.supplyChargeRateSignal.update(() =>
        Number.isNaN(supplyRate) ? DEFAULT_SUPPLY_RATE : supplyRate
      );
    } else {
      this.supplyChargeRateSignal.update(() => DEFAULT_SUPPLY_RATE);
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
