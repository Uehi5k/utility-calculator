import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
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
import { LoanRoiCalculatorComponent } from './loan-roi-calculator/loan-roi-calculator.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calculator',
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    ExcelUploadComponent,
    ActewaglTableCostComponent,
    ActewaglDailyBreakdownComponent,
    LoanRoiCalculatorComponent,
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
  standalone: true,
})
export class CalculatorComponent implements OnInit {
  private electricityCalculationService = inject(ElectricityCalculationService);
  listOfTotalActewAGLCost = signal<ActewAGLElectricityCost[]>([]);
  duplicatedData: Record<string, WritableSignal<ActewAGLElectricityCost[]>> =
    {};
  dateCostBreakdowns: Record<string, ActewAGLElectricityCost[]> = {};
  numberOfDays = 0;
  fromDate = '';
  toDate = '';
  activeTab = 1;

  ngOnInit() {
    this.resetCost();
  }

  /**
   * Reset cost
   */
  resetCost() {
    this.listOfTotalActewAGLCost.set(getDefaultActewAGLElectricityCostList());
    this.dateCostBreakdowns = {};
  }

  /**
   * Update cost
   * @param cost (ActewAGLElectricityCost)
   */
  updateCost(cost: ActewAGLElectricityCost) {
    this.listOfTotalActewAGLCost.update((l) => {
      let foundCost = l.find((c) => c.usageType === cost.usageType);
      if (foundCost) {
        foundCost = { ...cost };
      }
      return [...l];
    });
  }

  /**
   * Duplicate table cost, to be used as comparison between different adjustments
   */
  duplicateTableCost() {
    const keys = Object.keys(this.duplicatedData);
    const newKey = `Duplicated data - ${keys.length + 1}`;
    this.duplicatedData[newKey] = signal(this.listOfTotalActewAGLCost() ?? []);
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

      this.listOfTotalActewAGLCost.update((l) => {
        const cost = l.find((each) => each.usageType === usageType);
        if (cost) {
          cost.quantity += isNaN(quantity) ? 0 : quantity;
          cost.total = calculateActewAGLElectricityCostTotal(cost);
        }
        return [...l];
      });

      // Check if we have any date in the breakdowns
      if (!this.dateCostBreakdowns[date]) {
        this.dateCostBreakdowns[date] = getDefaultActewAGLElectricityCostList();
      }
      const costbreakdown = this.dateCostBreakdowns[date].find(
        (l) => l.usageType === usageType
      );

      if (costbreakdown) {
        costbreakdown.quantity += isNaN(quantity) ? 0 : quantity;
        costbreakdown.total =
          calculateActewAGLElectricityCostTotal(costbreakdown);
      }
    }

    // Update floating issue when summing floating numbers together
    this.listOfTotalActewAGLCost.update((l) => {
      l.forEach((cost) => {
        cost.quantity = roundingFloatIssue(cost.quantity);
      });
      return [...l];
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
