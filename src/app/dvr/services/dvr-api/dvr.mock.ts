import { getMockVatBoxAccounts } from '../../../core/services/accounts/accounts-mock.data';
import { DvrMockHelper } from '../../helpers/dvr-mock.helper';
import { Case, CasesResponse, CaseStatistics, CaseStatisticsType } from '../../models/case.model';
import {
  AccountEntity,
  Approve,
  ApproveStatus,
  CreateDraftResponse,
  DvrStatistics,
  Refund,
  StatisticValue,
} from '../../models/dvr.model';

export const mockAccounts = getMockVatBoxAccounts();

export class DvrMock {
  public static readonly countries = ['DE', 'FR'];
  public static readonly accountEntities: { [id: string]: AccountEntity[] } = {
    [mockAccounts[0].accountId]: [
      {
        countries: DvrMock.countries,
        id: '1',
        name: 'Amco (Austria) Handeles GmbH',
      },
      {
        countries: [DvrMock.countries[0]],
        id: '2',
        name: 'Amco Automative Rooflights Fr',
      },
      {
        countries: [DvrMock.countries[1]],
        id: '3',
        name: 'Amco Automatine Supplies UK LLP',
      },
      {
        countries: DvrMock.countries,
        id: '4',
        name: 'Amco Chemicals B.V.',
      },
      {
        countries: DvrMock.countries,
        id: '5',
        name: 'Amco Finance B.V.',
      },
      {
        countries: DvrMock.countries,
        id: '6',
        name: 'Amco Insdutrial Part Netherlands',
      },
      {
        countries: [],
        id: '7',
        name: 'Amco Holdings AG',
      },
    ],
    [mockAccounts[1].accountId]: [
      {
        countries: DvrMock.countries,
        id: '8',
        name: 'Second Handeles GmbH',
      },
      {
        countries: DvrMock.countries,
        id: '9',
        name: 'Second Amco Automative Rooflights Fr',
      },
      {
        countries: DvrMock.countries,
        id: '10',
        name: 'Second Amco Automatine Supplies UK LLP',
      },
    ],
    [mockAccounts[2].accountId]: [],
  };
  public static readonly cases: Case[] = [
    {
      approvedBy: 'Michael Allen',
      caseId: 21958,
      countries: ['DE', 'FR'],
      createdAt: '2019-10-28',
      createdBy: 'Lauren Little',
      entityName: 'Amco (Austria) Handeles GmbH',
      hash: 'dgr2c4ecq',
      potentialVatAmount: 1950.529,
      status: ApproveStatus.Draft,
    },
    {
      approvedBy: 'Peyton Douglas',
      caseId: 1058,
      countries: ['GB'],
      createdAt: '2019-04-09',
      createdBy: 'Lauren Little',
      entityName: 'Amco Automatine Supplies UK LLP',
      hash: 'afj125bqs',
      potentialVatAmount: 75,
      status: ApproveStatus.Approved,
    },
    {
      approvedBy: 'Riley Alexander',
      caseId: 915,
      countries: ['GB', 'FR', 'IS'],
      createdAt: '2019-03-01',
      createdBy: 'Lauren Little',
      entityName: 'Amco Chemicals B.V.',
      hash: '89ag11jl',
      potentialVatAmount: 9702.1,
      status: ApproveStatus.Draft,
    },
  ];
  public static readonly caseStatistics: CaseStatistics = {
    [CaseStatisticsType.Approved]: {
      amount: 120500,
      count: 157,
    },
    [CaseStatisticsType.Draft]: {
      amount: 8620,
      count: 18,
    },
  };
  public static readonly hash: CreateDraftResponse = { hash: 'hash' };
  public static readonly refunds: Refund[] = [
    {
      name: 'No company name on invoice',
      country: DvrMock.countries[0],
      children: [],
      details: {
        amount: 1.125105979021,
        count: 2557,
        images: [
          {
            isPdfOrTiff: false,
            imaginaryId: '/no-exist.png',
            currentPage: 0,
          },
          {
            isPdfOrTiff: false,
            imaginaryId: '588334952b00007e50b5ebe5',
            currentPage: 0,
          },
          {
            isPdfOrTiff: false,
            imaginaryId: '58880e573800003924203508',
            currentPage: 0,
          },
        ],
      },
      disable: false,
    },
    {
      name: 'Other company name on the invoice',
      country: DvrMock.countries[0],
      disable: true,
      children: [
        {
          name: 'Amco (Austria) Handeles',
          country: DvrMock.countries[0],
          details: {
            amount: 100212,
            count: 18577,
            images: [
              {
                isPdfOrTiff: true,
                imaginaryId: '588334952b00007e50b5ebe5',
                currentPage: 0,
              },
              {
                isPdfOrTiff: false,
                imaginaryId: '588334952b00007e50b5ebe5',
                currentPage: 0,
              },
            ],
          },
          disable: true,
        },
        {
          name: 'Amco Handeles',
          country: DvrMock.countries[0],
          details: {
            amount: 35917,
            count: 6654,
            images: [
              {
                isPdfOrTiff: false,
                imaginaryId: '588334952b00007e50b5ebe5',
                currentPage: 0,
              },
            ],
          },
          disable: true,
        },
      ],
      details: {
        amount: null,
        count: null,
        images: null,
      },
    },
    {
      name: 'UCB Pharma Germany commercial Department Accounting',
      country: DvrMock.countries[1],
      children: [],
      details: {
        amount: 35101,
        count: 72,
        images: null,
      },
      disable: false,
    },
    {
      name: 'Other sestination on the invoice',
      country: DvrMock.countries[1],
      disable: false,
      children: [
        {
          name: 'Ireland',
          country: DvrMock.countries[1],
          details: {
            amount: 35112,
            count: 18577,
            images: [],
          },
          disable: false,
        },
        {
          name: 'Germany',
          country: DvrMock.countries[1],
          details: {
            amount: 25100,
            count: 6654,
            images: [],
          },
          disable: false,
        },
        {
          name: 'Hungary',
          country: DvrMock.countries[1],
          details: {
            amount: 14400,
            count: 4560,
            images: [],
          },
          disable: false,
        },
      ],
      details: {
        amount: null,
        count: null,
        images: null,
      },
    },
    {
      name: 'UCB Pharma Germany with missed contacts in the invoice',
      country: DvrMock.countries[1],
      disable: false,
      children: [
        {
          name: 'UCB Pharma Germany with missed contacts in the invoice cluster',
          country: DvrMock.countries[1],
          details: {
            amount: 69085,
            count: 10590,
            images: [],
          },
          disable: false,
        },
        {
          name: 'Amco Germany',
          country: DvrMock.countries[1],
          details: {
            amount: 79823,
            count: 9237,
            images: [],
          },
          disable: false,
        },
      ],
      details: {
        amount: null,
        count: null,
        images: null,
      },
    },
    {
      name: 'Not found reason on invoice',
      country: DvrMock.countries[1],
      children: [],
      details: {
        amount: 834920,
        count: 139,
        images: [],
      },
      disable: false,
    },
  ];
  public static readonly refundsWithComments: Refund[] = [
    { ...DvrMock.refunds[0], comment: 'Some comment #1\nAnd another line' },
    {
      ...DvrMock.refunds[1],
      comment: 'Some comment #2',
      children: [
        { ...DvrMock.refunds[1].children[0] },
        {
          ...DvrMock.refunds[1].children[1],
          comment:
            'Long comment. The Angular Layout features provide smart, syntactic directives to allow developers to easily and intuitively create responsive and adaptive layouts using Flexbox and CSS Grid.',
        },
      ],
    },
    DvrMock.refunds[2],
  ];

  public static createDraft(): CreateDraftResponse {
    return DvrMock.hash;
  }

  public static doApprove(): Approve {
    return { ...DvrMock.getApprove(), status: ApproveStatus.Approved };
  }

  public static getAccountStatistics(): DvrStatistics {
    return {
      currency: 'EUR',
      [StatisticValue.Disqualified]: 14749126,
      [StatisticValue.InProgress]: 2048753,
      [StatisticValue.Qualified]: 200168,
    };
  }

  public static getApprove(): Approve {
    return {
      account: { id: mockAccounts[0].accountId.toString(), name: mockAccounts[0].accountName },
      end: '2018-10',
      entity: DvrMock.accountEntities[mockAccounts[0].accountId][0],
      refunds: DvrMock.refundsWithComments,
      start: '2018-02',
      status: ApproveStatus.Draft,
    };
  }

  public static getCasesResponse(): CasesResponse {
    return {
      cases: DvrMock.cases,
      statistics: DvrMock.caseStatistics,
    };
  }

  public static getEntities(accountId: number): AccountEntity[] {
    return DvrMock.accountEntities[accountId];
  }

  public static getEntityStatistics(): DvrStatistics {
    return {
      currency: 'EUR',
      [StatisticValue.Disqualified]: 2107018,
      [StatisticValue.InProgress]: 98753,
      [StatisticValue.Qualified]: 1019168,
    };
  }

  public static getRefunds(country: string): Refund[] {
    return DvrMockHelper.setCountriesToRefunds(DvrMock.refunds, country);
  }
}
