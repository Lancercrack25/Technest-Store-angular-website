import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pedidos } from './pedidos';

describe('Pedidos', () => {
  let component: Pedidos;
  let fixture: ComponentFixture<Pedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pedidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
