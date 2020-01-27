import { DvrMockHelper } from './dvr-mock.helper';
import { Refund } from '../models/dvr.model';
import { DvrMock } from '../services/dvr-api/dvr.mock';

describe('DvrMockHelper', () => {
  describe('setCountriesToRefunds', () => {
    it('should return refunds with filled country field', () => {
      const country = DvrMock.countries[0];
      const disable = false;
      const names = ['42', '2', '3', '4'];
      const refunds: Refund[] = [
        {
          children: [{ country, details: null, disable, name: names[1] }],
          country,
          details: null,
          disable,
          name: names[0],
        },
        { country, details: null, disable, name: names[2] },
      ];

      const result = DvrMockHelper.setCountriesToRefunds(refunds, country);

      expect(result[0].country).toBe(country);
      expect(result[0].children[0].country).toBe(country);
      expect(result[1].country).toBe(country);
    });
  });
});
