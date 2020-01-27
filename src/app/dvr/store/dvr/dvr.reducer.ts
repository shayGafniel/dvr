import { isEmpty } from 'lodash-es';

import { DvrActions, DvrActionTypes } from './dvr.actions';
import { CountryAggregate, RefundAggregate, State } from './dvr.state';
import { DvrHelper } from '../../helpers/dvr.helper';

export const initialState: State = {
  activeAccountId: null,
  activeEntityId: '',
  countries: [],
  dvr: {},
};

export const selectRefundAggregate = ({
  state,
  accountId,
  countryCode,
  entityId,
}: {
  state: State;
  accountId: number;
  countryCode: string;
  entityId: string;
}): RefundAggregate => {
  const account = state.dvr[accountId];

  return (
    account &&
    countryCode &&
    entityId &&
    account.entities &&
    account.entities[entityId] &&
    account.entities[entityId].refunds &&
    account.entities[entityId].refunds[countryCode]
  );
};

export function reducer(state = initialState, action: DvrActions): State {
  switch (action.type) {
    case DvrActionTypes.LoadAccount: {
      if (!isEmpty(state.dvr[action.payload.account.accountId])) {
        return state;
      }

      return {
        ...state,
        dvr: {
          ...state.dvr,
          [action.payload.account.accountId]: { name: action.payload.account.accountName },
        },
      };
    }

    case DvrActionTypes.LoadAccountStatistics: {
      const { accountId, statistics } = action.payload;
      const account = state.dvr[accountId];
      const dvr: State['dvr'] = {
        ...state.dvr,
        [accountId]: { ...account, statistics },
      };

      return { ...state, dvr };
    }

    case DvrActionTypes.LoadCountries:
      return { ...state, ...action.payload };

    case DvrActionTypes.LoadEntities: {
      const account = state.dvr[action.payload.accountId];
      const entities = action.payload.entities.reduce((entitiesAggregate, entity) => {
        return {
          ...entitiesAggregate,
          [entity.id]: { countries: entity.countries, name: entity.name },
        };
      }, {});
      const dvr: State['dvr'] = {
        ...state.dvr,
        [action.payload.accountId]: { ...account, entities },
      };

      return { ...state, dvr };
    }

    case DvrActionTypes.LoadEntityStatistics: {
      const { accountId, entityId, statistics } = action.payload;
      const account = state.dvr[accountId];
      const dvr: State['dvr'] = {
        ...state.dvr,
        [accountId]: {
          ...account,
          entities: {
            ...account.entities,
            [entityId]: {
              ...account.entities[entityId],
              statistics,
            },
          },
        },
      };

      return { ...state, dvr };
    }

    case DvrActionTypes.LoadRefunds: {
      const { accountId, countryCode, entityId, refunds } = action.payload;
      const account = state.dvr[accountId];
      const refundAggregate = selectRefundAggregate({
        state,
        accountId,
        countryCode,
        entityId,
      });
      const refundNodes = DvrHelper.setOrUpdateRefundNodes(refundAggregate, refunds);
      const selectedFlatNodes = DvrHelper.verifyFlatNodes(refundAggregate, refundNodes);

      const dvr: State['dvr'] = {
        ...state.dvr,
        [accountId]: {
          ...account,
          entities: {
            ...account.entities,
            [entityId]: {
              ...account.entities[entityId],
              refunds: {
                ...account.entities[entityId].refunds,
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

      return { ...state, dvr };
    }

    case DvrActionTypes.ResetActiveEntityId:
      return { ...state, activeEntityId: initialState.activeEntityId };

    case DvrActionTypes.ResetDvr:
      return { ...initialState };

    case DvrActionTypes.ResetSelectedFlatNodesOfEntity: {
      const { accountId, entityId } = action.payload;
      const account = state.dvr[accountId];
      const entity = account.entities[entityId];
      const refunds: CountryAggregate = Object.entries(entity.refunds).reduce(
        (countryAggregate, [countryCode, refundAggregate]) => ({
          ...countryAggregate,
          [countryCode]: { ...refundAggregate, selectedFlatNodes: [] },
        }),
        {},
      );
      const dvr: State['dvr'] = {
        ...state.dvr,
        [accountId]: {
          ...account,
          entities: {
            ...account.entities,
            [entityId]: {
              ...entity,
              refunds,
            },
          },
        },
      };

      return { ...state, dvr };
    }

    case DvrActionTypes.SetActiveAccountId:
      return { ...state, ...action.payload };

    case DvrActionTypes.SetActiveEntityId:
      return { ...state, ...action.payload };

    case DvrActionTypes.SetSelectedFlatNodes: {
      const { accountId, countryCode, entityId, selectedFlatNodes } = action.payload;
      const account = state.dvr[accountId];
      const dvr: State['dvr'] = {
        ...state.dvr,
        [accountId]: {
          ...account,
          entities: {
            ...account.entities,
            [entityId]: {
              ...account.entities[entityId],
              refunds: {
                ...account.entities[entityId].refunds,
                [countryCode]: {
                  ...account.entities[entityId].refunds[countryCode],
                  selectedFlatNodes,
                },
              },
            },
          },
        },
      };

      return { ...state, dvr };
    }

    default:
      return state;
  }
}
