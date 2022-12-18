import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaContratoComponent } from './minuta-contrato.component';

describe('MinutaContratoComponent', () => {
  let component: MinutaContratoComponent;
  let fixture: ComponentFixture<MinutaContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutaContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutaContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
