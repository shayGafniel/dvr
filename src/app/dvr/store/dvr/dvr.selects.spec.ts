import { refundComments } from '../comment-form/comment-form.reducer.spec';
import { MultiSelectOption } from '~/common/models/multy-select.model';
import { end, start } from '../date-range-form/date-range-form.reducer.spec';
import * as fromActions from './dvr.actions';
import * as fromSelects from './dvr.selects';
import {
  accountId,
  accounts,
  activeEntityId,
  countries,
  countryCode as country,
  countryCode,
  countryCodeTwo,
  entities,
  entityId,
  potentialForAccount,
  potentialForEntity,
  refundAggregate,
  refundEntities,
  refundNodes,
  refunds,
  selectedFlatNodes,
  selectedTestedFlatNodes,
  stateWithAccount,
  stateWithEntities,
  stateWithMultiSelectedFlatNodes,
  stateWithRefunds,
  statistics,
} from './dvr.reducer.spec';
import { initialState, reducer } from './dvr.reducer';
import { EntityAggregate, RefundAggregate, State } from './dvr.state';
import { Draft, DraftRefund, IsUpdatedEntities, Refund } from '../../models/dvr.model';
import { PotentialType } from '../../models/potential.model';
import { RefundEntity, RefundFlatNode } from '../../models/refund.model';

const entityAggregate: EntityAggregate = stateWithRefunds.dvr[accountId].entities[entityId];

const stateWithActiveAccountId = reducer(
  stateWithEntities,
  new fromActions.SetActiveAccountId({ activeAccountId: accountId }),
);
const stateWithActiveEntityId = reducer(
  stateWithEntities,
  new fromActions.SetActiveEntityId({ activeEntityId }),
);
const stateWithStatistics = reducer(
  stateWithAccount,
  new fromActions.LoadAccountStatistics({ accountId, statistics }),
);

const amountOne = 10126;
const amountTwo = 6130;
const amountForRefunds = amountOne + amountTwo;
const amountForEntity = (amountOne + amountTwo) * 2;
const amountForAccount = (amountOne + amountTwo) * 4;
const refundOne: Refund = { ...refunds[0], details: { ...refunds[0].details, amount: amountOne } };
const refundTwo: Refund = {
  ...refunds[0],
  name: 'Two',
  details: { ...refunds[0].details, amount: amountTwo },
};
export const selectedFlatNodesWithAmount: RefundFlatNode[] = [
  {
    expandable: false,
    item: 'item 1',
    level: 0,
    refund: refundOne,
    parent: null,
  },
  {
    expandable: false,
    item: 'item 2',
    level: 0,
    refund: refundTwo,
    parent: null,
  },
];
const selectedDraftRefunds: DraftRefund[] = [
  {
    name: selectedFlatNodesWithAmount[0].refund.name,
    comment: undefined,
    country: countryCodeTwo,
    children: [],
  },
  {
    name: selectedFlatNodesWithAmount[1].refund.name,
    comment: undefined,
    country: countryCodeTwo,
    children: [],
  },
  {
    name: selectedFlatNodesWithAmount[0].refund.name,
    comment: undefined,
    country,
    children: [],
  },
  {
    name: selectedFlatNodesWithAmount[1].refund.name,
    comment: undefined,
    country,
    children: [],
  },
];
const refundAggregateWithAmount: RefundAggregate = {
  ...refundAggregate,
  selectedFlatNodes: selectedFlatNodesWithAmount.map(node => ({
    ...node,
    refund: { ...node.refund, country },
  })),
};
const refundAggregateWithAmountTwo: RefundAggregate = {
  ...refundAggregateWithAmount,
  selectedFlatNodes: selectedFlatNodesWithAmount.map(node => ({
    ...node,
    refund: { ...node.refund, country: countryCodeTwo },
  })),
};
const entityAggregateWithAmount: EntityAggregate = {
  ...entityAggregate,
  statistics: stateWithStatistics.dvr[accountId].statistics,
  refunds: {
    [countryCode]: refundAggregateWithAmount,
    [countryCodeTwo]: refundAggregateWithAmountTwo,
  },
};
const stateWithNewQualified: State = {
  ...stateWithRefunds,
  dvr: {
    ...stateWithRefunds.dvr,
    [accountId]: {
      ...stateWithRefunds.dvr[accountId],
      statistics: stateWithStatistics.dvr[accountId].statistics,
      entities: {
        [entityId]: entityAggregateWithAmount,
        [`${entityId}.2`]: entityAggregateWithAmount,
      },
    },
  },
};

const stateTouched: State = { ...stateWithNewQualified };
stateTouched.dvr[accountId].entities[`${entityId}.3`] = { countries: [], name: 'name 3' };
stateTouched.dvr[accounts[1].accountId] = { name: accounts[1].accountName };
export const refundEntitiesTouched: RefundEntity[] = [
  {
    id: Object.keys(stateTouched.dvr[accountId].entities)[0],
    isUpdated: true,
    name: entities[0].name,
  },
  {
    id: Object.keys(stateTouched.dvr[accountId].entities)[1],
    isUpdated: true,
    name: entities[0].name,
  },
];

const email = '1@1';
export const draft: Draft = {
  accountId,
  email,
  end,
  entityId,
  refunds: selectedDraftRefunds,
  start,
};

describe('Dvr selects', () => {
  describe('selectAccountName', () => {
    it('should return name of the current account', () => {
      expect(fromSelects.selectAccountName(stateWithAccount, accounts[0].accountId)).toEqual(
        accounts[0].accountName,
      );
    });
  });

  describe('selectActiveEntityId', () => {
    it('should return activeEntityId', () => {
      expect(fromSelects.selectActiveEntityId(stateWithActiveEntityId)).toEqual(activeEntityId);
    });
  });

  describe('selectEntityCountries', () => {
    it('should return entity countries', () => {
      expect(
        fromSelects.selectEntityCountries(stateWithEntities, accountId, activeEntityId),
      ).toEqual(entities[0].countries);
    });

    it('should return empty array if no required data', () => {
      expect(
        fromSelects.selectEntityCountries(stateWithAccount, accountId, activeEntityId),
      ).toEqual([], 'no entity');
      expect(fromSelects.selectEntityCountries(initialState, accountId, activeEntityId)).toEqual(
        [],
        'no account',
      );
    });
  });

  describe('selectCountryOptions', () => {
    it('should return options from entity countries', () => {
      const stateWithCountries = reducer({ ...stateWithEntities, countries }, {} as any);

      const expected: MultiSelectOption[] = entities[0].countries.map(entityCountry => ({
        display: countries.find(c => c.code === entityCountry).name,
        value: entityCountry,
      }));

      expect(
        fromSelects.selectCountryOptions(stateWithCountries, accountId, activeEntityId),
      ).toEqual(expected);
    });
  });

  describe('selectIsUpdatedEntity', () => {
    it('should return true if the entity contains selected refund nodes', () => {
      const entityAggregateUpdated: EntityAggregate = {
        ...entityAggregate,
        refunds: {
          [countryCode]: { refundNodes, refunds, selectedFlatNodes: selectedTestedFlatNodes },
        },
      };

      expect(fromSelects.selectIsUpdatedEntity(entityAggregateUpdated)).toBe(true);
    });

    it('should return false if the entity aggregate does not exist', () => {
      expect(fromSelects.selectIsUpdatedEntity(null)).toBe(false);
    });

    it('should return false if the entity does not contain selected refund nodes', () => {
      const entityAggregateNotUpdated: EntityAggregate = {
        ...entityAggregate,
        refunds: { [countryCode]: { refundNodes, refunds, selectedFlatNodes: [] } },
      };

      expect(fromSelects.selectIsUpdatedEntity(entityAggregateNotUpdated)).toBe(false);
    });
  });

  describe('selectEntities', () => {
    it('should return entities', () => {
      expect(fromSelects.selectEntities(stateWithEntities, accountId)).toEqual(refundEntities);
    });
  });

  describe('selectEntityAggregate', () => {
    it('should return entity aggregate structure', () => {
      const expected = stateWithEntities.dvr[accountId].entities[entityId];

      expect(fromSelects.selectEntityAggregate(stateWithEntities, accountId, entityId)).toEqual(
        expected,
      );
    });

    it('should return null if no entities', () => {
      expect(fromSelects.selectEntityAggregate(stateWithAccount, accountId, entityId)).toBeNull();
    });
  });

  describe('selectEntityName', () => {
    it('should return name of the active entity', () => {
      const expected = entities.find(entity => entity.id === activeEntityId).name;

      expect(
        fromSelects.selectEntityName(stateWithActiveEntityId, accountId, activeEntityId),
      ).toEqual(expected);
    });
  });

  describe('selectIsUpdatedEntities', () => {
    it('should return IsUpdatedEntities structure with true if it has SelectedFlatNode', () => {
      const expected: IsUpdatedEntities = { [entityId]: true };

      expect(
        fromSelects.selectIsUpdatedEntities(stateWithMultiSelectedFlatNodes, accountId),
      ).toEqual(expected);
    });

    it('should return IsUpdatedEntities structure with false if it does not have SelectedFlatNode', () => {
      const expected: IsUpdatedEntities = { [entityId]: false };

      expect(fromSelects.selectIsUpdatedEntities(stateWithRefunds, accountId)).toEqual(expected);
    });
  });

  describe('selectNewQualifiedForRefund', () => {
    it('should return newQualified value from the refund aggregate', () => {
      expect(fromSelects.selectNewQualifiedForRefund(refundAggregateWithAmount)).toBe(
        amountForRefunds,
      );
    });
  });

  describe('selectNewQualifiedForEntity', () => {
    it('should return newQualified value from the entity aggregate', () => {
      expect(fromSelects.selectNewQualifiedForEntity(entityAggregateWithAmount)).toBe(
        amountForEntity,
      );
    });
  });

  describe('selectNewQualifiedForAccount', () => {
    it('should return newQualified value from the account', () => {
      expect(fromSelects.selectNewQualifiedForAccount(stateWithNewQualified, accountId)).toBe(
        amountForAccount,
      );
    });
  });

  describe('selectAccountStatistics', () => {
    it('should return potential value for account', () => {
      expect(fromSelects.selectAccountStatistics(stateWithStatistics, accountId)).toEqual(
        statistics,
      );
    });
  });

  describe('selectPotentialForAccount', () => {
    it('should return potential value for account', () => {
      expect(fromSelects.selectPotentialForAccount(stateWithStatistics, accountId)).toEqual(
        potentialForAccount,
      );
    });

    it('should subtract newQualified value from disqualified', () => {
      const potentialForAccountWithNewQualified = {
        ...potentialForAccount,
        values: {
          ...potentialForAccount.values,
          [PotentialType.Disqualified]:
            potentialForAccount.values[PotentialType.Disqualified] - amountForAccount,
          [PotentialType.NewQualified]: amountForAccount,
        },
      };

      expect(fromSelects.selectPotentialForAccount(stateWithNewQualified, accountId)).toEqual(
        potentialForAccountWithNewQualified,
      );
    });
  });

  describe('selectEntityStatistics', () => {
    it('should return statistics value for entity', () => {
      const state = reducer(
        stateWithEntities,
        new fromActions.LoadEntityStatistics({ accountId, entityId, statistics }),
      );

      expect(fromSelects.selectEntityStatistics(state, accountId, entityId)).toEqual(statistics);
    });
  });

  describe('selectPotentialForEntity', () => {
    it('should return potential value for entity', () => {
      const state = reducer(
        stateWithEntities,
        new fromActions.LoadEntityStatistics({ accountId, entityId, statistics }),
      );

      expect(fromSelects.selectPotentialForEntity(state, accountId, entityId)).toEqual(
        potentialForEntity,
      );
    });

    it('should subtract newQualified value from disqualified', () => {
      const potentialForEntityWithNewQualified = {
        ...potentialForEntity,
        values: {
          ...potentialForEntity.values,
          [PotentialType.Disqualified]:
            potentialForEntity.values[PotentialType.Disqualified] - amountForEntity,
          [PotentialType.NewQualified]: amountForEntity,
        },
      };

      expect(
        fromSelects.selectPotentialForEntity(stateWithNewQualified, accountId, entityId),
      ).toEqual(potentialForEntityWithNewQualified);
    });
  });

  describe('selectRefundNodes', () => {
    it('should return refund nodes for certain account, entity and county', () => {
      expect(
        fromSelects.selectRefundNodes(stateWithRefunds, accountId, countryCode, entityId),
      ).toEqual(refundNodes);
    });
  });

  describe('selectRefunds', () => {
    it('should return refunds for certain account, entity and county', () => {
      expect(fromSelects.selectRefunds(stateWithRefunds, accountId, countryCode, entityId)).toEqual(
        refunds,
      );
    });
  });

  describe('selectSelectedFlatNodes', () => {
    it('should return selected FlatNodes for certain account, entity and county', () => {
      expect(
        fromSelects.selectSelectedFlatNodes(stateWithRefunds, accountId, countryCode, entityId),
      ).toEqual(selectedFlatNodes);
    });
  });

  describe('selectDraft', () => {
    it('should return draft object', () => {
      expect(
        fromSelects.selectDraft(
          stateWithNewQualified,
          accountId,
          entityId,
          email,
          end,
          start,
          refundComments,
        ),
      ).toEqual(draft);
    });
  });

  describe('selectTouchedEntities', () => {
    it('should return only touched entities', () => {
      expect(fromSelects.selectTouchedEntities(stateTouched, accountId)).toEqual(
        refundEntitiesTouched,
      );
    });
  });
});
