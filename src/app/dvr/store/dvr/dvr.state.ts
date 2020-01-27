import { SimplifiedCountry } from '../../../common/services/configuration/configuration.model';
import { DvrStatistics, Refund } from '../../models/dvr.model';
import { RefundFlatNode, RefundNode } from '../../models/refund.model';

export interface RefundAggregate {
  refundNodes: RefundNode[];
  refunds: Refund[];
  selectedFlatNodes: RefundFlatNode[];
}

export interface State {
  activeAccountId: number;
  activeEntityId: string;
  countries: SimplifiedCountry[];
  dvr: {
    [accountId: number]: {
      name: string;
      statistics?: DvrStatistics;
      entities?: {
        [entityId: string]: {
          countries: string[];
          name: string;
          statistics?: DvrStatistics;
          refunds?: {
            [countryCode: string]: RefundAggregate;
          };
        };
      };
    };
  };
}

export type EntityAggregate = State['dvr'][number]['entities'][string];
export type CountryAggregate = State['dvr'][number]['entities'][string]['refunds'];
