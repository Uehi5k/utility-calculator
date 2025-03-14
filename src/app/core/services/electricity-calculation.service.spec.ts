import { TestBed } from '@angular/core/testing';

import { ElectricityCalculationService } from './electricity-calculation.service';

describe('ElectricityCalculationService', () => {
  let service: ElectricityCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricityCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
