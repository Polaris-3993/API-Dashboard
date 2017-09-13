import { TestBed, inject } from '@angular/core/testing';

import { ConnectorsService } from './connectors.service';

describe('ConnectorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectorsService]
    });
  });

  it('should ...', inject([ConnectorsService], (service: ConnectorsService) => {
    expect(service).toBeTruthy();
  }));
});
