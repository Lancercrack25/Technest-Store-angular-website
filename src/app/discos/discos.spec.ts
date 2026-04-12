import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Discos } from './discos';

describe('Discos', () => {
  let component: Discos;
  let fixture: ComponentFixture<Discos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Discos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Discos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
