import { TestBed, inject } from '@angular/core/testing';

import { IntegrationDetailsService } from './integration-details.service';

describe('IntegrationDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntegrationDetailsService]
    });
  });

  it('should ...', inject([IntegrationDetailsService], (service: IntegrationDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
