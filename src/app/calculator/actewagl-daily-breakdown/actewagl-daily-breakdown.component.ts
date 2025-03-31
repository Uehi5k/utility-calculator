import { CommonModule, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ActewAGLElectricityCost,
  ActewAGLElectricityUsage,
} from '../../common/models/electricity.model';
import { roundingFloatIssue } from '../../common/utils/calculation.utils';

@Component({
  selector: 'app-actewagl-daily-breakdown',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './actewagl-daily-breakdown.component.html',
  styleUrl: './actewagl-daily-breakdown.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActewaglDailyBreakdownComponent {
  dateCostBreakdowns = input<Record<string, ActewAGLElectricityCost[]>>({});
  totalQuantity = 0;

  tableHeaders = [
    'Date',
    ActewAGLElectricityUsage.Peak,
    ActewAGLElectricityUsage.Shoulder,
    ActewAGLElectricityUsage.Offpeak,
    ActewAGLElectricityUsage.Solar,
    'Cost w/o Solar',
    'Solar Feed-In',
    'Net',
  ];
  tableData = computed<string[][]>(() => {
    const breakdowns: string[][] = [];
    this.totalQuantity = 0;
    let totalPeakQuantity = 0;
    let totalShoulderQuantity = 0;
    let totalOffpeakQuantity = 0;
    let totalSolarQuantity = 0;
    let finalCostWithoutSolar = 0;
    let finalSolarReduction = 0;
    let finalNet = 0;

    // Add body data
    Object.keys(this.dateCostBreakdowns()).forEach((date) => {
      const cost = this.dateCostBreakdowns()[date];
      const peakQuantity =
        cost.find((c) => c.usageType === ActewAGLElectricityUsage.Peak)
          ?.quantity ?? 0;
      const shoulderQuantity =
        cost.find((c) => c.usageType === ActewAGLElectricityUsage.Shoulder)
          ?.quantity ?? 0;
      const offpeakQuantity =
        cost.find((c) => c.usageType === ActewAGLElectricityUsage.Offpeak)
          ?.quantity ?? 0;
      const solarUsage = cost.find(
        (c) => c.usageType === ActewAGLElectricityUsage.Solar
      );
      const solarQuantity = solarUsage?.quantity ?? 0;
      const solarReduction = solarUsage?.total ?? 0;

      const totalCostWithoutSolar = cost
        .filter((c) => c.usageType !== ActewAGLElectricityUsage.Solar)
        .reduce((accumulator, currentValue) => {
          accumulator += currentValue.total;
          return accumulator;
        }, 0);
      const net = cost.reduce((accumulator, currentValue) => {
        accumulator += currentValue.total;
        return accumulator;
      }, 0);

      breakdowns.push([
        date,
        `${roundingFloatIssue(peakQuantity).toString()} kWh`,
        `${roundingFloatIssue(shoulderQuantity).toString()} kWh`,
        `${roundingFloatIssue(offpeakQuantity).toString()} kWh`,
        `${roundingFloatIssue(solarQuantity).toString()} kWh`,
        totalCostWithoutSolar.toLocaleString('en-US', {
          style: 'currency',
          currency: 'AUD',
        }),
        solarReduction.toLocaleString('en-US', {
          style: 'currency',
          currency: 'AUD',
        }),
        net.toLocaleString('en-US', {
          style: 'currency',
          currency: 'AUD',
        }),
      ]);

      totalPeakQuantity += peakQuantity;
      totalShoulderQuantity += shoulderQuantity;
      totalOffpeakQuantity += offpeakQuantity;
      totalSolarQuantity += solarQuantity;
      finalCostWithoutSolar += totalCostWithoutSolar;
      finalSolarReduction += solarReduction;
      finalNet += net;
    });

    breakdowns.push([
      'Total',
      `${roundingFloatIssue(totalPeakQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalShoulderQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalOffpeakQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalSolarQuantity).toString()} kWh`,
      finalCostWithoutSolar.toLocaleString('en-US', {
        style: 'currency',
        currency: 'AUD',
      }),
      finalSolarReduction.toLocaleString('en-US', {
        style: 'currency',
        currency: 'AUD',
      }),
      finalNet.toLocaleString('en-US', { style: 'currency', currency: 'AUD' }),
    ]);

    this.totalQuantity =
      totalOffpeakQuantity + totalPeakQuantity + totalShoulderQuantity;

    return breakdowns;
  });
}
