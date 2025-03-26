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
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-roi-calculator',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './loan-roi-calculator.component.html',
  styleUrl: './loan-roi-calculator.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanRoiCalculatorComponent {
  listOfTotalActewAGLCost = model<ActewAGLElectricityCost[]>([]);
  numberOfDays = input<number>(1);
  loanAmountPerFortnight = model<number>(44.05);

  dailyLoanCost = computed<number>(() => this.loanAmountPerFortnight() / 14);

  solarUsage = computed<ActewAGLElectricityCost | undefined>(() =>
    this.listOfTotalActewAGLCost().find(
      (c) => c.usageType === ActewAGLElectricityUsage.Solar
    )
  );

  selfConsumptionUsage = computed<ActewAGLElectricityCost | undefined>(() =>
    this.listOfTotalActewAGLCost().find(
      (c) => c.usageType === ActewAGLElectricityUsage.SelfConsumption
    )
  );

  resultTotalPrice = computed<number>(() => {
    const solarUsage = this.listOfTotalActewAGLCost().find(
      (c) => c.usageType === ActewAGLElectricityUsage.Solar
    );
    const selfConsumptionUsage = this.listOfTotalActewAGLCost().find(
      (c) => c.usageType === ActewAGLElectricityUsage.SelfConsumption
    );
    return (
      (solarUsage?.total ?? 0) +
      (selfConsumptionUsage?.total ?? 0) +
      this.numberOfDays() * this.dailyLoanCost()
    );
  });

  resultDailyAverage = computed<number>(
    () => this.resultTotalPrice() / this.numberOfDays()
  );
}
