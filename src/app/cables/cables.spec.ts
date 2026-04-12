import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cables } from './cables';

describe('Cables', () => {
  let component: Cables;
  let fixture: ComponentFixture<Cables>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cables]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cables);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
