import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudioPrevioComponent } from './estudio-previo.component';

describe('EstudioPrevioComponent', () => {
  let component: EstudioPrevioComponent;
  let fixture: ComponentFixture<EstudioPrevioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudioPrevioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudioPrevioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
