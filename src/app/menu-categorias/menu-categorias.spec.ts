import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategorias } from './menu-categorias';

describe('MenuCategorias', () => {
  let component: MenuCategorias;
  let fixture: ComponentFixture<MenuCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCategorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCategorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
