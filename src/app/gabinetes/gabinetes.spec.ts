import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gabinetes } from './gabinetes';

describe('Gabinetes', () => {
  let component: Gabinetes;
  let fixture: ComponentFixture<Gabinetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gabinetes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gabinetes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
