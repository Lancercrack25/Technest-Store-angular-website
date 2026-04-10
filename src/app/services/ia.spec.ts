import { TestBed } from '@angular/core/testing';

import { Ia } from './ia';

describe('Ia', () => {
  let service: Ia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
