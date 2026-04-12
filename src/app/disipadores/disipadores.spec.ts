import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disipadores } from './disipadores';

describe('Disipadores', () => {
  let component: Disipadores;
  let fixture: ComponentFixture<Disipadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disipadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disipadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
