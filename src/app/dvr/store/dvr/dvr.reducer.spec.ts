import { MultiSelectOption } from '../../../common/models/multy-select.model';
import { configurationResponse } from '../../../common/services/configuration/configuration.mock';
import { Country } from '../../../common/services/configuration/configuration.model';
import * as fromActions from './dvr.actions';
import { initialState, reducer, selectRefundAggregate } from './dvr.reducer';
import { DvrHelper } from '../../helpers/dvr.helper';
import { Account, AccountEntity, DvrStatistics, StatisticValue } from '../../models/dvr.model';
import {
  Potential,
  PotentialType,
  sortedPotentialTypesForAccount,
  sortedPotentialTypesForEntity,
} from '../../models/potential.model';
import { RefundEntity, RefundFlatNode } from '../../models/refund.model';
import { mockAccounts, DvrMock } from '../../services/dvr-api/dvr.mock';

export const accounts: Account[] = [{ ...mockAccounts[0] }, { ...mockAccounts[1] }];
export const account = accounts[0];
export const accountId = account.accountId;

export const countries = configurationResponse().countries as Country[];

export const statistics: DvrStatistics = {
  currency: 'EUR',
  [StatisticValue.Disqualified]: 5028753,
  [StatisticValue.InProgress]: 2048753,
  [StatisticValue.Qualified]: 200168,
};
export const potentialForAccount: Potential = {
  currencyCode: statistics.currency,
  order: sortedPotentialTypesForAccount,
  values: {
    [PotentialType.Disqualified]: statistics[StatisticValue.Disqualified],
    [PotentialType.InProgress]: statistics[StatisticValue.InProgress],
    [PotentialType.NewQualified]: 0,
    [PotentialType.Qualified]: statistics[StatisticValue.Qualified],
  },
};
export const potentialForEntity: Potential = {
  ...potentialForAccount,
  order: sortedPotentialTypesForEntity,
};
export const zeroPotentialForEntity: Potential = {
  ...potentialForEntity,
  values: {
    [PotentialType.Disqualified]: 0,
    [PotentialType.InProgress]: 0,
    [PotentialType.NewQualified]: 0,
    [PotentialType.Qualified]: 0,
  },
};

export const entities: AccountEntity[] = [
  { countries: DvrMock.countries, id: '1', name: 'Entity 1' },
];
export const refundEntities: RefundEntity[] = [
  { id: entities[0].id, isUpdated: false, name: entities[0].name },
];

export const activeEntityId = entities[0].id;

export const entityId = entities[0].id;
export const entityIds = entities.map(entity => entity.id);

export const countryCode = 'FR';
export const countryCodeTwo = 'DE';

export const countryCodeOption: MultiSelectOption = { display: countryCode, value: countryCode };

export const refunds = DvrMock.refunds;

export const stateWithAccount = reducer(initialState, new fromActions.LoadAccount({ account }));

export const stateWithEntities = reducer(
  stateWithAccount,
  new fromActions.LoadEntities({ accountId, entities }),
);
export const stateWithRefunds = reducer(
  stateWithEntities,
  new fromActions.LoadRefunds({ accountId, countryCode, entityId, refunds }),
);

export const refundAggregate = selectRefundAggregate({
  state: stateWithRefunds,
  accountId,
  countryCode,
  entityId,
});
export const refundNodes = DvrHelper.setOrUpdateRefundNodes(refundAggregate, refunds);
export const selectedFlatNodes = DvrHelper.verifyFlatNodes(refundAggregate, refundNodes);
export const selectedTestedFlatNodes: RefundFlatNode[] = [
  {
    expandable: false,
    item: 'item',
    level: 0,
    refund: refunds[0],
    parent: null,
  },
];

export const stateWithMultiSelectedFlatNodes = reducer(
  {
    ...stateWithEntities,
    dvr: {
      ...stateWithEntities.dvr,
      [accountId]: {
        ...stateWithEntities.dvr[accountId],
        entities: {
          [entityId]: {
            ...stateWithEntities.dvr[accountId].entities[entityId],
            refunds: {
              [countryCode]: { refundNodes, refunds, selectedFlatNodes: selectedTestedFlatNodes },
              [countryCodeTwo]: {
                refundNodes,
                refunds,
                selectedFlatNodes: selectedTestedFlatNodes,
              },
            },
          },
        },
      },
    },
  },
  {} as any,
);

describe('Dvr Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadAccount', () => {
    it('should fill the dvr field with accounts', () => {
      const action = new fromActions.LoadAccount({ account });

      const result = reducer(initialState, action);
      const dvr = {
        [account.accountId]: {
          name: account.accountName,
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });

    it('should ignore action if it is already filled', () => {
      const action = new fromActions.LoadAccount({ account });

      const result = reducer(stateWithAccount, action);

      expect(result).toBe(stateWithAccount);
    });
  });

  describe('LoadAccountStatistics', () => {
    it('should fill the account with statistics', () => {
      const action = new fromActions.LoadAccountStatistics({ accountId, statistics });
      const result = reducer(stateWithAccount, action);

      const dvr = {
        [accountId]: {
          name: account.accountName,
          statistics,
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('LoadCountries', () => {
    it('should fill countries field', () => {
      const action = new fromActions.LoadCountries({ countries });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, countries });
    });
  });

  describe('LoadEntities', () => {
    it('should fill the account with entities', () => {
      const action = new fromActions.LoadEntities({ accountId, entities });
      const result = reducer(stateWithAccount, action);

      const dvr = {
        [accountId]: {
          name: accounts[0].accountName,
          entities: {
            [entities[0].id]: { countries: entities[0].countries, name: entities[0].name },
          },
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('LoadEntityStatistics', () => {
    it('should fill the entity field with statistics', () => {
      const action = new fromActions.LoadEntityStatistics({ accountId, entityId, statistics });
      const result = reducer(stateWithEntities, action);

      const dvr = {
        [accountId]: {
          name: accounts[0].accountName,
          entities: {
            [entityId]: {
              countries: entities[0].countries,
              name: entities[0].name,
              statistics,
            },
          },
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('LoadRefunds', () => {
    it('should fill the entity field with refunds for certain country', () => {
      const action = new fromActions.LoadRefunds({ accountId, countryCode, entityId, refunds });
      const result = reducer(stateWithEntities, action);

      const dvr = {
        [accountId]: {
          name: accounts[0].accountName,
          entities: {
            [entityId]: {
              countries: entities[0].countries,
              name: entities[0].name,
              refunds: {
                [countryCode]: {
                  refundNodes,
                  refunds,
                  selectedFlatNodes,
                },
              },
            },
          },
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('ResetActiveEntityId', () => {
    it('should reset activeEntityId field to default value', () => {
      const state = reducer(initialState, new fromActions.SetActiveEntityId({ activeEntityId }));

      const action = new fromActions.ResetActiveEntityId();
      const result = reducer(state, action);

      expect(result).toEqual({ ...initialState, activeEntityId: initialState.activeEntityId });
    });
  });

  describe('ResetDvr', () => {
    it('should return the initial state', () => {
      const action = new fromActions.ResetDvr();

      const result = reducer(stateWithRefunds, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('ResetSelectedFlatNodesOfEntity', () => {
    it('should reset the selectedFlatNodes fields in the entity', () => {
      const action = new fromActions.ResetSelectedFlatNodesOfEntity({ accountId, entityId });
      const result = reducer(stateWithMultiSelectedFlatNodes, action);

      const dvr = {
        [accountId]: {
          name: accounts[0].accountName,
          entities: {
            [entityId]: {
              countries: entities[0].countries,
              name: entities[0].name,
              refunds: {
                [countryCode]: {
                  refundNodes,
                  refunds,
                  selectedFlatNodes: [],
                },
                [countryCodeTwo]: {
                  refundNodes,
                  refunds,
                  selectedFlatNodes: [],
                },
              },
            },
          },
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('SetActiveEntityId', () => {
    it('should fill activeEntityId field', () => {
      const action = new fromActions.SetActiveEntityId({ activeEntityId });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, activeEntityId });
    });
  });

  describe('SetSelectedFlatNodes', () => {
    it('should fill the selectedFlatNodes field for refund', () => {
      const action = new fromActions.SetSelectedFlatNodes({
        accountId,
        countryCode,
        entityId,
        selectedFlatNodes: selectedTestedFlatNodes,
      });
      const result = reducer(stateWithRefunds, action);

      const dvr = {
        [accountId]: {
          name: accounts[0].accountName,
          entities: {
            [entityId]: {
              countries: entities[0].countries,
              name: entities[0].name,
              refunds: {
                [countryCode]: {
                  refundNodes,
                  refunds,
                  selectedFlatNodes: selectedTestedFlatNodes,
                },
              },
            },
          },
        },
      };

      expect(result).toEqual({ ...initialState, dvr });
    });
  });

  describe('selectRefundAggregate', () => {
    it('should return the refund accumulator for certain account, entity and county', () => {
      const expected = {
        refundNodes,
        refunds,
        selectedFlatNodes,
      };

      expect(
        selectRefundAggregate({
          state: stateWithRefunds,
          accountId,
          countryCode,
          entityId,
        }),
      ).toEqual(expected);
    });
  });
});
