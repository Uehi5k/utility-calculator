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
import {
  CurrencyPipe,
  DecimalPipe,
  CommonModule,
  PercentPipe,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { calculateActewAGLElectricityCostTotal } from '../../common/utils/calculation.utils';

@Component({
  selector: 'app-actewagl-table-cost',
  imports: [CurrencyPipe, DecimalPipe, PercentPipe, CommonModule, FormsModule],
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

  total = computed<number>(() =>
    this.listOfTotalActewAGLCost().reduce((accumulator, currentValue) => {
      return accumulator + currentValue.total;
    }, 0)
  );

  totalWithoutSolar = computed<number>(() =>
    this.listOfTotalActewAGLCost()
      .filter((c) => c.usageType !== ActewAGLElectricityUsage.Solar)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0)
  );

  totalSupplyCharge = computed<number>(
    () =>
      this.numberOfDays() * this.supplyChargeRate() +
      this.numberOfDays() * this.supplyChargeRate() * this.supplyChargeRateGst()
  );

  totalIncludingSupplyChargeWithoutSolar = computed<number>(
    () => this.totalWithoutSolar() + this.totalSupplyCharge()
  );

  totalIncludingSupply = computed<number>(
    () => this.total() + this.totalSupplyCharge()
  );

  costReduction = computed<number>(
    () =>
      (this.totalIncludingSupplyChargeWithoutSolar() -
        this.totalIncludingSupply()) /
      this.totalIncludingSupplyChargeWithoutSolar()
  );

  saving = computed<boolean>(() => {
    return this.totalIncludingSupply() < 0;
  });

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
}
