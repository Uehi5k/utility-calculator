import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import {
  ActewAGLElectricityCost,
  ActewAGLElectricityUsage,
} from '../../common/models/electricity.model';
import { CurrencyPipe, CommonModule, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateActewAGLElectricityCostTotal } from '../../common/utils/calculation.utils';

@Component({
  selector: 'app-actewagl-table-cost',
  imports: [CurrencyPipe, PercentPipe, CommonModule, FormsModule],
  templateUrl: './actewagl-table-cost.component.html',
  styleUrl: './actewagl-table-cost.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActewaglTableCostComponent {
  listOfTotalActewAGLCost = model<ActewAGLElectricityCost[]>([]);
  numberOfDays = input<number>(0);
  fromDate = input<string>('');
  toDate = input<string>('');
  supplyChargeRate = model<number>(1.01);
  supplyChargeRateGst = input<number>(0.1);
  extraHeading = input<string>('');

  total = computed<number>(() =>
    this.listOfTotalActewAGLCost()
      .filter((c) => c.usageType !== ActewAGLElectricityUsage.SelfConsumption)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0)
  );

  totalWithoutSolarSystem = computed<number>(() =>
    this.listOfTotalActewAGLCost()
      .filter((c) => c.usageType !== ActewAGLElectricityUsage.Solar)
      .reduce((accumulator, currentValue) => {
        // Self Consumption case, we would expect the saving, and add the negative back to the total
        if (
          currentValue.usageType === ActewAGLElectricityUsage.SelfConsumption
        ) {
          return accumulator - currentValue.total;
        }
        return accumulator + currentValue.total;
      }, 0)
  );

  totalSupplyCharge = computed<number>(
    () =>
      this.numberOfDays() * this.supplyChargeRate() +
      this.numberOfDays() * this.supplyChargeRate() * this.supplyChargeRateGst()
  );

  totalIncludingSupplyChargeWithoutSolarSystem = computed<number>(() => {
    return this.totalWithoutSolarSystem() + this.totalSupplyCharge();
  });

  totalIncludingSupply = computed<number>(
    () => this.total() + this.totalSupplyCharge()
  );

  costReduction = computed<number>(
    () =>
      (this.totalIncludingSupplyChargeWithoutSolarSystem() -
        this.totalIncludingSupply()) /
      this.totalIncludingSupplyChargeWithoutSolarSystem()
  );

  /**
   * Update usage type rate
   * @param actewAGLElectricityCost (ActewAGLElectricityCost)
   * @param newRate (number)
   */
  updateUsageTypeRate(
    actewAGLElectricityCost: ActewAGLElectricityCost,
    newRate: number
  ) {
    this.listOfTotalActewAGLCost.update((list) => {
      const cost = list.find(
        (l) => l.usageType === actewAGLElectricityCost.usageType
      );
      if (cost) {
        cost.rate = newRate;
        cost.total = calculateActewAGLElectricityCostTotal(cost);
      }

      return [...list];
    });
  }

  /**
   * Update usage type quantity
   * @param actewAGLElectricityCost (ActewAGLElectricityCost)
   * @param newQuantity (number)
   */
  updateUsageTypeQuantity(
    actewAGLElectricityCost: ActewAGLElectricityCost,
    newQuantity: number
  ) {
    this.listOfTotalActewAGLCost.update((list) => {
      const cost = list.find(
        (l) => l.usageType === actewAGLElectricityCost.usageType
      );
      if (cost) {
        cost.quantity = newQuantity;
        cost.total = calculateActewAGLElectricityCostTotal(cost);
      }

      return [...list];
    });
  }
}
