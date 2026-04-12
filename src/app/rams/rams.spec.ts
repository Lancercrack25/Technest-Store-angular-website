import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rams } from './rams';

describe('Rams', () => {
  let component: Rams;
  let fixture: ComponentFixture<Rams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rams);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
