import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraBusqueda } from './barra-busqueda';

describe('BarraBusqueda', () => {
  let component: BarraBusqueda;
  let fixture: ComponentFixture<BarraBusqueda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarraBusqueda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarraBusqueda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
