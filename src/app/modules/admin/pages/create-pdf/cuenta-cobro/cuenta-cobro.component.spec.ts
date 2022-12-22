import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaCobroComponent } from './cuenta-cobro.component';

describe('CuentaCobroComponent', () => {
  let component: CuentaCobroComponent;
  let fixture: ComponentFixture<CuentaCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaCobroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
