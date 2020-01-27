export interface FilterValues {
  company?: string | Array<string>;
  originCountry?: string | Array<string>;
  country?: string | Array<string>;
  expenseDomain?: string | Array<string>;
  directive?: string | Array<string>;
  type?: string | Array<string>;
  status?: string | Array<string>;
  rejectReason?: string | Array<string>;
  originalStatus?: string | Array<string>;
  hasCopy?: string;
  eligible?: string;
  supplier?: string;
  supplierAddress?: string | Array<string>;
  agent?: string | Array<string>;
  amountType?: string;
  amountMin?: number;
  amountMax?: number;
  page?: number;
  invoiceDateFrom?: string;
  invoiceDateTo?: string;
  submissionDateFrom?: string;
  submissionDateTo?: string;
  dateRange?: string;
}
