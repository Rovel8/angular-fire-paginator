import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSellComponent } from './table-sell.component';

describe('TableSellComponent', () => {
  let component: TableSellComponent;
  let fixture: ComponentFixture<TableSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
