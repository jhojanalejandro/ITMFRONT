/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActaComiteComponent } from './acta-comite.component';

describe('ActaComiteComponent', () => {
  let component: ActaComiteComponent;
  let fixture: ComponentFixture<ActaComiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActaComiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaComiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
