import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Procesadores } from './procesadores';

describe('Procesadores', () => {
  let component: Procesadores;
  let fixture: ComponentFixture<Procesadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Procesadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Procesadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
