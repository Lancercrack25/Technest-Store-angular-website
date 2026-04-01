import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProvedores } from './registro-provedores';

describe('RegistroProvedores', () => {
  let component: RegistroProvedores;
  let fixture: ComponentFixture<RegistroProvedores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroProvedores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroProvedores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
