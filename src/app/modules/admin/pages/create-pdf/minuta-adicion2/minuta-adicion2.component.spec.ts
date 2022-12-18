import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaAdicion2Component } from './minuta-adicion2.component';

describe('MinutaAdicion2Component', () => {
  let component: MinutaAdicion2Component;
  let fixture: ComponentFixture<MinutaAdicion2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutaAdicion2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutaAdicion2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
