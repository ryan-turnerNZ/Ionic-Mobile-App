import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPasswordPage } from './add-password.page';

describe('AddPasswordPage', () => {
  let component: AddPasswordPage;
  let fixture: ComponentFixture<AddPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
