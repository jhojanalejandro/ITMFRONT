import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaAdicion1Component } from './minuta-adicion1.component';

describe('MinutaAdicion1Component', () => {
  let component: MinutaAdicion1Component;
  let fixture: ComponentFixture<MinutaAdicion1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutaAdicion1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutaAdicion1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
