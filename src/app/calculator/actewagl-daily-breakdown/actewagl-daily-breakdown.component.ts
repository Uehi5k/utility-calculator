import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './actewagl-daily-breakdown.component.html',
  styleUrl: './actewagl-daily-breakdown.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActewaglDailyBreakdownComponent {
  dateCostBreakdowns = input<Record<string, ActewAGLElectricityCost[]>>({});

  tableHeaders = [
    'Date',
    ActewAGLElectricityUsage.Peak,
    ActewAGLElectricityUsage.Shoulder,
    ActewAGLElectricityUsage.Offpeak,
    ActewAGLElectricityUsage.Solar,
  ];
  tableData = computed<string[][]>(() => {
    const breakdowns: string[][] = [];
    let totalPeakQuantity = 0;
    let totalShoulderQuantity = 0;
    let totalOffpeakQuantity = 0;
    let totalSolarQuantity = -0;

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
      const solarQuantity =
        cost.find((c) => c.usageType === ActewAGLElectricityUsage.Solar)
          ?.quantity ?? 0;
      breakdowns.push([
        date,
        `${peakQuantity.toString()} kWh`,
        `${shoulderQuantity.toString()} kWh`,
        `${offpeakQuantity.toString()} kWh`,
        `${solarQuantity.toString()} kWh`,
      ]);

      totalPeakQuantity += peakQuantity;
      totalShoulderQuantity += shoulderQuantity;
      totalOffpeakQuantity += offpeakQuantity;
      totalSolarQuantity += solarQuantity;
    });

    breakdowns.push([
      'Total',
      `${roundingFloatIssue(totalPeakQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalShoulderQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalOffpeakQuantity).toString()} kWh`,
      `${roundingFloatIssue(totalSolarQuantity).toString()} kWh`,
    ]);

    return breakdowns;
  });
}
