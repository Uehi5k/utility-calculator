import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ElectricityCalculationService } from '../../core/services/electricity-calculation.service';
import { ActewAGLElectricityUsage } from '../../common/models/electricity.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usage-charge-setting',
  imports: [CommonModule, FormsModule],
  templateUrl: './usage-charge-setting.component.html',
  styleUrl: './usage-charge-setting.component.scss',
  standalone: true,
})
export class UsageChargeSettingComponent {
  private electricityCalculationService = inject(ElectricityCalculationService);

  actewAGLElectricityUsageRateListReadOnly =
    this.electricityCalculationService.actewAGLElectricityUsageRateList;

  supplyChargeRateReadonly =
    this.electricityCalculationService.supplyChargeRate;

  /**
   * Update usage rate
   * @param usageType (ActewAGLElectricityUsage)
   * @param newRate (number)
   */
  updateUsageRate(usageType: ActewAGLElectricityUsage, newRate: number) {
    this.electricityCalculationService.updateUsageRate(usageType, newRate);
  }

  /**
   * Update supply charge rate
   * @param newRate (number)
   */
  updateSupplyChargeRate(newRate: number) {
    this.electricityCalculationService.updateSupplyChargeRate(newRate);
  }

  /**
   * Save rate list to local storage
   */
  saveRateListToLocalStorage() {
    this.electricityCalculationService.saveRateToLocalStorage();
    alert('Save Compelted!');
  }

  returnToDefaultRate() {
    this.electricityCalculationService.returnToDefaultRate();
    alert('Rate has been reverted to default!');
  }
}
