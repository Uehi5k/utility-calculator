import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
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

  total = computed(() =>
    Math.abs(
      this.listOfTotalActewAGLCost().reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total;
      }, 0)
    )
  );
  saving = computed(() => {
    const total = this.listOfTotalActewAGLCost().reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.total;
      },
      0
    );
    return total < 0;
  });
}
