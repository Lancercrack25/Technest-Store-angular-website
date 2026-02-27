import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminlogin } from './adminlogin';

describe('Adminlogin', () => {
  let component: Adminlogin;
  let fixture: ComponentFixture<Adminlogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminlogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminlogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
