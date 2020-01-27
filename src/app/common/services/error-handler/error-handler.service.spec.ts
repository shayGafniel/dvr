import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

describe('ErrorHandlerService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
  }));

  beforeEach(() => {});

  describe('notifyError', () => {
    it('should post to /api/backoffice/v1.0/logs', () => {
      // TBD
    });
  });
});
