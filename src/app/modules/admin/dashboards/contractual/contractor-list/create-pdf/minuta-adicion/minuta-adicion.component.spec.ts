import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutaAdicionComponent } from './minuta-adicion.component';

describe('MinutaAdicionComponent', () => {
  let component: MinutaAdicionComponent;
  let fixture: ComponentFixture<MinutaAdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinutaAdicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutaAdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
