import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Monitores } from './monitores';

describe('Monitores', () => {
  let component: Monitores;
  let fixture: ComponentFixture<Monitores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monitores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Monitores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
