import { Injectable } from '@angular/core';
import { parse } from 'date-fns';
import { ActewAGLElectricityCost } from '../../common/models/electricity.model';

@Injectable({
  providedIn: 'root',
})
export class ElectricityCalculationService {
  /**
   * Get date period
   * @param dateCostBreakdowns (Record<string, ActewAGLElectricityCost[]>)
   * @returns ({ fromDate: string, toDate: string })
   */
  getDatePeriod(dateCostBreakdowns: Record<string, ActewAGLElectricityCost[]>) {
    const dates = Object.keys(dateCostBreakdowns).sort(
      (a, b) =>
        parse(a, 'dd/MM/yyyy', new Date()).getTime() -
        parse(b, 'dd/MM/yyyy', new Date()).getTime()
    );
    return { fromDate: dates[0], toDate: dates[dates.length - 1] };
  }
}
