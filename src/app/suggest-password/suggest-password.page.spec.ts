import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestPasswordPage } from './suggest-password.page';

describe('SuggestPasswordPage', () => {
  let component: SuggestPasswordPage;
  let fixture: ComponentFixture<SuggestPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
