import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';

import { MockHttpInterceptor } from '../../../common/services/interceptors/http-interceptors/mock.http-interceptor';
import {
  MOCK_SERVICES,
  MockCollectionService,
} from '../../../common/services/mock-collection/mock-collection.service';
import { DvrApiMockService } from './dvr-api.mock-service';
import { DvrApiService } from './dvr-api.service';
import { DvrMock, mockAccounts } from './dvr.mock';
import { DvrHelper } from '../../helpers/dvr.helper';
import { Draft, RefundsRequest } from '../../models/dvr.model';
import { range } from '../../store/date-range-form/date-range-form.reducer.spec';

export const emptyDraft: Draft = {
  accountId: null,
  email: '',
  end: '',
  entityId: '',
  refunds: [],
  start: '',
};

describe('DvrApiMockService', () => {
  let api: DvrApiService;
  let mock: DvrApiMockService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        DvrApiService,
        MockCollectionService,
        { provide: MOCK_SERVICES, useClass: DvrApiMockService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true },
      ],
    });
  }));

  beforeEach(() => {
    api = TestBed.get(DvrApiService);
    mock = TestBed.get(MOCK_SERVICES)[0];

    mock.mockResponses.forEach(mockResponse => (mockResponse.timeout = 0));
  });

  it('should get mock data to createDraft', () => {
    api.createDraft(emptyDraft).subscribe(data => {
      expect(data).toEqual(DvrMock.createDraft());
    });
  });

  it('should get mock data to doApprove', () => {
    api.doApprove('hash', '1@1').subscribe(data => {
      expect(data).toEqual(DvrMock.doApprove());
    });
  });

  it('should get mock data to getAccountStatistics', () => {
    api.getAccountStatistics(1).subscribe(data => {
      expect(data).toEqual(DvrMock.getAccountStatistics());
    });
  });

  it('should get mock data to getApprove', () => {
    api.getApprove('hash').subscribe(data => {
      const idFn = () => 'id';
      const approve = DvrMock.getApprove();

      const responseApprove = { ...data, refunds: DvrHelper.setIdToRefunds(data.refunds, idFn) };
      const expectedApprove = {
        ...approve,
        refunds: DvrHelper.setIdToRefunds(approve.refunds, idFn),
      };

      expect(responseApprove).toEqual(expectedApprove);
    });
  });

  it('should get mock data to getCases', () => {
    api.getCases(1, {}).subscribe(data => {
      expect(data).toEqual(DvrMock.getCasesResponse());
    });
  });

  it('should get mock data to getEntityStatistics', () => {
    api.getEntityStatistics(1, '0', range).subscribe(data => {
      expect(data).toEqual(DvrMock.getEntityStatistics());
    });
  });

  describe('getRefunds', () => {
    const accountId = 42;
    const country = DvrMock.countries[0];
    const entityId = 'entId';
    const refundsRequest: RefundsRequest = {
      accountId,
      entityId,
      params: { country, end: '2018-04', start: '2018-10' },
    };

    it('should get mock data', () => {
      api.getRefunds(refundsRequest).subscribe(data => {
        const idFn = () => 'id';

        const responseRefunds = DvrHelper.setIdToRefunds(data, idFn);
        const refunds = DvrHelper.setIdToRefunds(DvrMock.getRefunds(DvrMock.countries[0]), idFn);

        expect(responseRefunds).toEqual(refunds);
      });
    });
  });
});
