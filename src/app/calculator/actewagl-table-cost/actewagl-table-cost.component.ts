import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { ActewAGLElectricityCost } from '../../common/models/electricity.model';
import { CurrencyPipe, DecimalPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-actewagl-table-cost',
  imports: [CurrencyPipe, DecimalPipe, CommonModule],
  templateUrl: './actewagl-table-cost.component.html',
  styleUrl: './actewagl-table-cost.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActewaglTableCostComponent {
  listOfTotalActewAGLCost = input<ActewAGLElectricityCost[]>([]);
  numberOfDays = input<number>(0);
  supplyChargeRate = model<number>(1.01);
  supplyChargeRateGst = input<number>(0.1);

  total = computed<number>(() =>
    Math.abs(
      this.listOfTotalActewAGLCost().reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0)
    )
  );

  totalSupplyCharge = computed<number>(
    () =>
      this.numberOfDays() * this.supplyChargeRate() +
      this.numberOfDays() * this.supplyChargeRate() * this.supplyChargeRateGst()
  );

  totalIncludingSupply = computed<number>(
    () => this.total() + this.totalSupplyCharge()
  );

  saving = computed<boolean>(() => {
    return this.totalIncludingSupply() < 0;
  });
}
