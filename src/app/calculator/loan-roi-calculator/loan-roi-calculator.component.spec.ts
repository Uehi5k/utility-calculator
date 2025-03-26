import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRoiCalculatorComponent } from './loan-roi-calculator.component';

describe('LoanRoiCalculatorComponent', () => {
  let component: LoanRoiCalculatorComponent;
  let fixture: ComponentFixture<LoanRoiCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRoiCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRoiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
