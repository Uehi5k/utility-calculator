import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActewaglTableCostComponent } from './actewagl-table-cost.component';

describe('ActewaglTableCostComponent', () => {
  let component: ActewaglTableCostComponent;
  let fixture: ComponentFixture<ActewaglTableCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActewaglTableCostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActewaglTableCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
