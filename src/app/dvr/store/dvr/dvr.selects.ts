import { isEmpty } from 'lodash-es';

import { DvrRefundComments } from '../comment-form/comment-form.model';
import { MultiSelectOption } from '../../../common/models/multy-select.model';
import { SimplifiedCountry } from '../../../common/services/configuration/configuration.model';
import { selectRefundAggregate } from './dvr.reducer';
import { EntityAggregate, RefundAggregate, State } from './dvr.state';
import { DraftRefundHelper } from '../../helpers/draft-refund.helper';
import { DvrHelper } from '../../helpers/dvr.helper';
import { getEntityAllValue } from '../../models/case.model';
import {
  Draft,
  DraftRefund,
  DvrStatistics,
  IsUpdatedEntities,
  Refund,
  StatisticValue,
} from '../../models/dvr.model';
import {
  Potential,
  PotentialType,
  sortedPotentialTypesForAccount,
  sortedPotentialTypesForEntity,
} from '../../models/potential.model';
import {
  GroupedRefundNodes,
  RefundEntity,
  RefundFlatNode,
  RefundNode,
} from '../../models/refund.model';
import { MultiselectItem } from '../../../shared/models/multiselect.model';

export const selectAccountName = (state: State, accountId: number): string => {
  const account = state.dvr[accountId];

  return account ? account.name : '';
};

export const selectActiveAccountId = (state: State): number => state.activeAccountId;

export const selectActiveEntityId = (state: State): string => state.activeEntityId;

export const selectEntityCountries = (
  state: State,
  accountId: number,
  entityId: string,
): string[] => {
  const account = state.dvr[accountId];

  if (!account || !account.entities) {
    return [];
  }

  const entityEntry: [string, EntityAggregate] = Object.entries(account.entities).find(
    ([id]) => id === entityId,
  );

  return entityEntry ? entityEntry[1].countries : [];
};

export const selectCountries = (state: State): SimplifiedCountry[] => state.countries;

export const selectCountryOptions = (
  state: State,
  accountId: number,
  entityId: string,
): MultiSelectOption[] =>
  selectEntityCountries(state, accountId, entityId).map(countryCode => {
    const countryObject = selectCountries(state).find(country => country.code === countryCode);

    return { display: countryObject ? countryObject.name : countryCode, value: countryCode };
  });

export const selectIsUpdatedEntity = (entityAggregate: EntityAggregate): boolean => {
  if (!entityAggregate) {
    return false;
  }

  const refundAggregates: RefundAggregate[] = entityAggregate.refunds
    ? Object.values(entityAggregate.refunds)
    : [];

  return refundAggregates.some(
    refundAggregate =>
      Array.isArray(refundAggregate.selectedFlatNodes) &&
      refundAggregate.selectedFlatNodes.length > 0,
  );
};

export const selectEntities = (state: State, accountId: number): RefundEntity[] => {
  const account = state.dvr[accountId];

  if (!account || isEmpty(account.entities)) {
    return null;
  }

  return Object.entries(account.entities).map(([id, entityAggregate]) => ({
    id,
    isUpdated: selectIsUpdatedEntity(entityAggregate),
    name: entityAggregate.name,
  }));
};

export const selectMultiselectEntities = (state: State, accountId: number): MultiselectItem[] => {
  const entities = selectEntities(state, accountId);
  const items = entities ? entities.map(({ id, name }) => ({ id, name })) : [];

  return [getEntityAllValue(), ...items];
};

export const selectMultiselectSelectedEntities = (
  state: State,
  accountId: number,
  selectedEntitiesIds: string[],
): MultiselectItem[] => {
  return selectMultiselectEntities(state, accountId).filter(item =>
    selectedEntitiesIds.includes(item.id as string),
  );
};

export const selectEntityAggregate = (
  state: State,
  accountId: number,
  entityId: string,
): EntityAggregate => {
  const account = state.dvr[accountId];

  return account && account.entities ? account.entities[entityId] : null;
};

export const selectEntityName = (state: State, accountId: number, entityId: string): string => {
  const account = state.dvr[accountId];

  return account && account.entities && account.entities[entityId]
    ? account.entities[entityId].name
    : '';
};

export const selectIsEmptyDvr = (state: State): boolean => {
  return isEmpty(state.dvr);
};

export const selectIsUpdatedEntities = (state: State, accountId: number): IsUpdatedEntities => {
  const account = state.dvr[accountId];

  if (!account) {
    return {};
  }

  return Object.entries(account.entities || {}).reduce(
    (isUpdatedEntities: IsUpdatedEntities, [id, entityAggregate]) => ({
      ...isUpdatedEntities,
      [id]: selectIsUpdatedEntity(entityAggregate),
    }),
    {},
  );
};

export const selectNewQualifiedForRefund = (refundAggregate: RefundAggregate): number => {
  return refundAggregate
    ? refundAggregate.selectedFlatNodes.reduce((newQualifiedForRefunds, selectedFlatNode) => {
        return newQualifiedForRefunds + (selectedFlatNode.refund.details.amount || 0);
      }, 0)
    : 0;
};

export const selectNewQualifiedForEntity = (entityAggregate: EntityAggregate): number => {
  return entityAggregate
    ? Object.values(entityAggregate.refunds || {}).reduce(
        (newQualifiedForEntity, refundAggregate) => {
          return newQualifiedForEntity + selectNewQualifiedForRefund(refundAggregate);
        },
        0,
      )
    : 0;
};

export const selectNewQualifiedForAccount = (state: State, accountId: number): number => {
  const account = state.dvr[accountId];

  return account
    ? Object.values(account.entities || {}).reduce((newQualifiedForAccount, entityAggregate) => {
        return newQualifiedForAccount + selectNewQualifiedForEntity(entityAggregate);
      }, 0)
    : 0;
};

export const selectAccountStatistics = (state: State, accountId: number): DvrStatistics => {
  const account = state.dvr[accountId];

  if (!account || !account.statistics) {
    return null;
  }

  return account.statistics;
};

export const selectPotentialForAccount = (state: State, accountId: number): Potential => {
  const statistics = selectAccountStatistics(state, accountId);

  if (!statistics) {
    return null;
  }

  const newQualified = selectNewQualifiedForAccount(state, accountId);

  return {
    currencyCode: statistics.currency,
    order: sortedPotentialTypesForAccount,
    values: {
      [PotentialType.Disqualified]: statistics[StatisticValue.Disqualified] - newQualified,
      [PotentialType.InProgress]: statistics[StatisticValue.InProgress],
      [PotentialType.NewQualified]: newQualified,
      [PotentialType.Qualified]: statistics[StatisticValue.Qualified],
    },
  };
};

export const selectEntityStatistics = (
  state: State,
  accountId: number,
  entityId: string,
): DvrStatistics => {
  const account = state.dvr[accountId];

  if (
    !account ||
    !account.entities ||
    !account.entities[entityId] ||
    !account.entities[entityId].statistics
  ) {
    return null;
  }

  return account.entities[entityId].statistics;
};

export const selectPotentialForEntity = (
  state: State,
  accountId: number,
  entityId: string,
): Potential => {
  const account = state.dvr[accountId];
  const statistics = selectEntityStatistics(state, accountId, entityId);

  if (!account || !statistics) {
    return null;
  }

  const entity = account.entities[entityId];
  const newQualified = selectNewQualifiedForEntity(entity);

  return {
    currencyCode: statistics.currency,
    order: sortedPotentialTypesForEntity,
    values: {
      [PotentialType.Disqualified]: statistics[StatisticValue.Disqualified] - newQualified,
      [PotentialType.InProgress]: statistics[StatisticValue.InProgress],
      [PotentialType.NewQualified]: newQualified,
      [PotentialType.Qualified]: statistics[StatisticValue.Qualified],
    },
  };
};

export const selectRefundNodes = (
  state: State,
  accountId: number,
  countryCode: string,
  entityId: string,
): RefundNode[] => {
  const refundAggregate = selectRefundAggregate({ state, accountId, countryCode, entityId });

  return refundAggregate && refundAggregate.refundNodes ? refundAggregate.refundNodes : [];
};

export const selectRefunds = (
  state: State,
  accountId: number,
  countryCode: string,
  entityId: string,
): Refund[] => {
  const refundAggregate = selectRefundAggregate({ state, accountId, countryCode, entityId });

  return refundAggregate ? refundAggregate.refunds : [];
};

export const selectSelectedFlatNodes = (
  state: State,
  accountId: number,
  countryCode: string,
  entityId: string,
): RefundFlatNode[] => {
  const refundAggregate = selectRefundAggregate({ state, accountId, countryCode, entityId });

  return refundAggregate && refundAggregate.selectedFlatNodes
    ? refundAggregate.selectedFlatNodes
    : [];
};

export const selectSelectedGroupedRefundNodes = (
  state: State,
  accountId: number,
  entityId: string,
): GroupedRefundNodes => {
  const account = state.dvr[accountId];

  if (
    !account ||
    !account.entities ||
    !account.entities[entityId] ||
    !account.entities[entityId].refunds
  ) {
    return {};
  }

  return DvrHelper.generateGroupedRefundNodes(account.entities[entityId].refunds);
};

export const selectDraft = (
  state: State,
  accountId: number,
  entityId: string,
  email: string,
  end: string,
  start: string,
  comments: DvrRefundComments,
): Draft => {
  const countries = selectEntityCountries(state, accountId, entityId);
  const selectedFlatNodes: RefundFlatNode[] = countries.reduce(
    (flatNodes, countryCode) => [
      ...flatNodes,
      ...selectSelectedFlatNodes(state, accountId, countryCode, entityId),
    ],
    [],
  );
  const refundObjects: Refund[] = countries.reduce(
    (refund, countryCode) => [...refund, ...selectRefunds(state, accountId, countryCode, entityId)],
    [],
  );

  const refunds: DraftRefund[] = DraftRefundHelper.generateDraftRefunds({
    comments,
    nodes: selectedFlatNodes,
    refunds: refundObjects,
  });

  return { accountId, email, end, entityId, refunds, start };
};

export const selectTouchedEntities = (state: State, accountId: number): RefundEntity[] => {
  const entities = selectEntities(state, accountId);

  return entities ? entities.filter(entity => entity.isUpdated) : [];
};
