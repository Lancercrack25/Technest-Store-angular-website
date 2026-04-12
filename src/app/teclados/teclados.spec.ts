import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teclados } from './teclados';

describe('Teclados', () => {
  let component: Teclados;
  let fixture: ComponentFixture<Teclados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Teclados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teclados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
