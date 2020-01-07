import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPasswordsPage } from './view-passwords.page';

describe('ViewPasswordsPage', () => {
  let component: ViewPasswordsPage;
  let fixture: ComponentFixture<ViewPasswordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPasswordsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPasswordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
