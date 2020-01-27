import { mock_company_info } from '../../deadcart/api/deadcart-api.mock-service';
import { LoadBulkCompaniesInfo } from './deadcart.actions';
import { initialState, reducer, selectCompaniesInfo, selectFailures } from './deadcart.reducer';
import { BulkCompaniesInfo, DeadcartCompanyInfo } from '../../../models/deadcart.model';

/* CompaniesInfo */

const companiesInfo: DeadcartCompanyInfo[] = [
  { ...mock_company_info(), companyId: 'id1' },
  { ...mock_company_info(), companyId: 'id2' },
  { ...mock_company_info(), companyId: 'id3' },
];
export const companiesIds: string[] = companiesInfo.map(companyId => companyId.companyId);

const certainCompaniesInfo: DeadcartCompanyInfo[] = [companiesInfo[0], companiesInfo[2]];
const certainCompaniesIds: string[] = certainCompaniesInfo.map(companyId => companyId.companyId);

/* Failures */

const failures: string[] = ['42', '2', '3'];
const failuresIds: string[] = failures.map(failure => failure.toString());

const certainFailures: string[] = [failures[0], failures[2]];
const certainFailuresIds: string[] = certainFailures.map(failure => failure.toString());

/* BulkCompaniesInfo */

export const bulkCompaniesInfo: BulkCompaniesInfo = { companiesInfo, failures };

describe('Deadcart Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadBulkCompaniesInfo', () => {
    it('should fill companiesInfo field', () => {
      const action = new LoadBulkCompaniesInfo({ bulkCompaniesInfo });
      const result = reducer(initialState, action);

      expect(result).toEqual({ ...initialState, companiesInfo, failures });
    });
  });

  describe('selectCompaniesInfo', () => {
    it('should return all values from field companiesInfo by all ids', () => {
      expect(selectCompaniesInfo({ ...initialState, companiesInfo }, companiesIds)).toEqual(
        companiesInfo,
      );
    });

    it('should return certain values from field companiesInfo by certain ids', () => {
      expect(selectCompaniesInfo({ ...initialState, companiesInfo }, certainCompaniesIds)).toEqual(
        certainCompaniesInfo,
      );
    });
  });

  describe('selectFailures', () => {
    it('should return all values from field failures by all ids', () => {
      expect(selectFailures({ ...initialState, failures }, failuresIds)).toEqual(failures);
    });

    it('should return certain values from field failures by certain ids', () => {
      expect(selectFailures({ ...initialState, failures }, certainFailuresIds)).toEqual(
        certainFailures,
      );
    });
  });
});
