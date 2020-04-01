import { TestBed } from '@angular/core/testing';

import { ApiAdapterService } from './api-adapter.service';

describe('ApiAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiAdapterService = TestBed.get(ApiAdapterService);
    expect(service).toBeTruthy();
  });
});
