import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recomendador } from './recomendador';

describe('Recomendador', () => {
  let component: Recomendador;
  let fixture: ComponentFixture<Recomendador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recomendador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recomendador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
