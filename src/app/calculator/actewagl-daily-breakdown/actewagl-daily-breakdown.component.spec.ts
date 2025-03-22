import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActewaglDailyBreakdownComponent } from './actewagl-daily-breakdown.component';

describe('ActewaglDailyBreakdownComponent', () => {
  let component: ActewaglDailyBreakdownComponent;
  let fixture: ComponentFixture<ActewaglDailyBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActewaglDailyBreakdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActewaglDailyBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
