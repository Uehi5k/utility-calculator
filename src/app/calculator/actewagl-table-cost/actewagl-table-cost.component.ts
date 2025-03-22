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

@Component({
  selector: 'app-actewagl-table-cost',
  imports: [CurrencyPipe, DecimalPipe, PercentPipe, CommonModule],
  templateUrl: './actewagl-table-cost.component.html',
  styleUrl: './actewagl-table-cost.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActewaglTableCostComponent {
  listOfTotalActewAGLCost = input<ActewAGLElectricityCost[]>([]);
  numberOfDays = input<number>(0);
  fromDate = input<string>('');
  toDate = input<string>('');
  supplyChargeRate = model<number>(1.01);
  supplyChargeRateGst = input<number>(0.1);

  total = computed<number>(() =>
    Math.abs(
      this.listOfTotalActewAGLCost().reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0)
    )
  );

  totalWithoutSolar = computed<number>(() =>
    Math.abs(
      this.listOfTotalActewAGLCost()
        .filter((c) => c.usageType !== ActewAGLElectricityUsage.Solar)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.total;
        }, 0)
    )
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
}
