import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageChargeSettingComponent } from './usage-charge-setting.component';

describe('UsageChargeSettingComponent', () => {
  let component: UsageChargeSettingComponent;
  let fixture: ComponentFixture<UsageChargeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageChargeSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageChargeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
