import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggerService],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(LoggerService);

    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMail function', () => {
    const mockWindow = {
      // now, $window.location.path will update that empty object
      location: {
        assign: () => {
          // do nothing
        },
      },
      // we keep the reference to window.document
      document: window.document,
    };
  });
});
