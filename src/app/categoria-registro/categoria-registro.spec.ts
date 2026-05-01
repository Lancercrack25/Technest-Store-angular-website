import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaRegistro } from './categoria-registro';

describe('CategoriaRegistro', () => {
  let component: CategoriaRegistro;
  let fixture: ComponentFixture<CategoriaRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
