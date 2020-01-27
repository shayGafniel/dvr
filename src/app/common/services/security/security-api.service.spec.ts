import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { SecurityApiService } from './security-api.service';

describe('SecurityApiService', () => {
  let apiService: SecurityApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecurityApiService],
    });
  }));

  beforeEach(() => {
    apiService = TestBed.get(SecurityApiService);
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

});
