import { async, TestBed } from '@angular/core/testing';

import { LoadIndicatorService } from './load-indicator.service';
import { SharedCommonModule } from '../../shared-common.module';

describe('LoadIndicatorService', () => {
  let loadIndicatorService: LoadIndicatorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedCommonModule],
      providers: [LoadIndicatorService],
    });
  }));

  beforeEach(() => {
    loadIndicatorService = TestBed.get(LoadIndicatorService);
  });

  it('should be created', () => {
    expect(loadIndicatorService).toBeTruthy();
  });
});
