import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Audifonos } from './audifonos';

describe('Audifonos', () => {
  let component: Audifonos;
  let fixture: ComponentFixture<Audifonos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Audifonos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Audifonos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
