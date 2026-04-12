import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Motherboards } from './motherboards';

describe('Motherboards', () => {
  let component: Motherboards;
  let fixture: ComponentFixture<Motherboards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Motherboards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Motherboards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
