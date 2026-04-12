import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mouses } from './mouses';

describe('Mouses', () => {
  let component: Mouses;
  let fixture: ComponentFixture<Mouses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mouses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mouses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
