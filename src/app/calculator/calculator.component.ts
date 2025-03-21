import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelUploadComponent } from '../common/components/excel-upload/excel-upload.component';
import { ElectricityCalculationService } from '../core/services/electricity-calculation.service';
import {
  ActewAGLElectricityCost,
  ActewAGLElectricityUsage,
  getDefaultActewAGLElectricityCostList,
} from '../common/models/electricity.model';
import { ExcelData } from '../common/models/file-upload.model';
import { getHeaderIndices } from '../common/utils/excel.utils';
import { ActewaglTableCostComponent } from './actewagl-table-cost/actewagl-table-cost.component';
import { CommonModule } from '@angular/common';
import { ActewaglDailyBreakdownComponent } from './actewagl-daily-breakdown/actewagl-daily-breakdown.component';
import {
  calculateActewAGLElectricityCostTotal,
  roundingFloatIssue,
} from '../common/utils/calculation.utils';

@Component({
  selector: 'app-calculator',
  imports: [
    CommonModule,
    FormsModule,
    ExcelUploadComponent,
    ActewaglTableCostComponent,
    ActewaglDailyBreakdownComponent,
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.sass',
  standalone: true,
})
export class CalculatorComponent implements OnInit {
  private electricityCalculationService = inject(ElectricityCalculationService);
  listOfTotalActewAGLCost: ActewAGLElectricityCost[] = [];
  dateCostBreakdowns: Record<string, ActewAGLElectricityCost[]> = {};
  numberOfDays = 0;
  fromDate = '';
  toDate = '';

  ngOnInit() {
    this.resetCost();
  }

  /**
   * Reset cost
   */
  resetCost() {
    this.listOfTotalActewAGLCost = getDefaultActewAGLElectricityCostList();
    this.dateCostBreakdowns = {};
  }

  /**
   * Calculate electricity bill
   * @param data (ExcelData)
   */
  calculateElectricityBill(data: ExcelData) {
    this.resetCost();
    const { headerIndices, headerRowIndex } = getHeaderIndices(
      ['Register Description', 'Reading Date', 'Units'],
      data
    );

    // Calculate usage for each type
    for (let i = headerRowIndex + 1; i < data.data.length; i++) {
      const usageType: ActewAGLElectricityUsage = data.data[i][
        headerIndices[0].arrayIndex
      ] as ActewAGLElectricityUsage;

      // Update quantity
      const date = data.data[i][headerIndices[1].arrayIndex];
      const quantity = Number.parseFloat(
        data.data[i][headerIndices[2].arrayIndex]
      );
      const cost = this.listOfTotalActewAGLCost.find(
        (l) => l.usageType === usageType
      );
      // Check if we have any date in the breakdowns
      if (!this.dateCostBreakdowns[date]) {
        this.dateCostBreakdowns[date] = getDefaultActewAGLElectricityCostList();
      }
      const costbreakdown = this.dateCostBreakdowns[date].find(
        (l) => l.usageType === usageType
      );

      if (cost) {
        cost.quantity += isNaN(quantity) ? 0 : quantity;
        cost.total = calculateActewAGLElectricityCostTotal(cost);
      }

      if (costbreakdown) {
        costbreakdown.quantity += isNaN(quantity) ? 0 : quantity;
        costbreakdown.total =
          calculateActewAGLElectricityCostTotal(costbreakdown);
      }
    }

    // Rounding quantity and total
    Object.keys(this.dateCostBreakdowns).forEach((date) => {
      this.dateCostBreakdowns[date].forEach((usage) => {
        usage.quantity = roundingFloatIssue(usage.quantity);
        usage.total = roundingFloatIssue(usage.total);
      });
    });

    // Get from and end dates
    const datePeriod = this.electricityCalculationService.getDatePeriod(
      this.dateCostBreakdowns
    );
    this.fromDate = datePeriod.fromDate;
    this.toDate = datePeriod.toDate;

    // Get number of days in the spreadsheet
    this.numberOfDays = Object.keys(this.dateCostBreakdowns).length;
  }
}
