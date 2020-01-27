import { isArray } from 'lodash-es';

import { Refund } from '../models/dvr.model';

export class DvrMockHelper {
  public static setCountriesToRefunds(refunds: Refund[], country: string): Refund[] {
    return refunds.reduce((accumulator, refund) => {
      const modifiedRefund = { ...refund, country };

      if (isArray(modifiedRefund.children)) {
        modifiedRefund.children = DvrMockHelper.setCountriesToRefunds(
          modifiedRefund.children,
          country,
        );
      }

      return [...accumulator, modifiedRefund];
    }, []);
  }
}
