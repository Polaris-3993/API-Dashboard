import { TestBed, inject } from '@angular/core/testing';

import { TriggersService } from './triggers.service';

describe('TriggersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TriggersService]
    });
  });

  it('should ...', inject([TriggersService], (service: TriggersService) => {
    expect(service).toBeTruthy();
  }));
});
