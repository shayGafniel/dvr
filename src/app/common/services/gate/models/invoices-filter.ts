type PaidBy = 'p-card' | 'other';

export interface InvoicesFilter {
  directive?: number[];
  query?: string; // Invoice id
  company_id?: string[];
  invoiced_at_from?: string; // Format dd/mm/yyyy
  invoiced_at_to?: string; // Format dd/mm/yyyy
  country?: string[];
  originCountry?: string[];
  paid_by?: PaidBy;
  amount_filter_from?: number;
  amount_filter_to?: number;
  expense_domains?: number[];
  invoice_category_id?: number[];
  reject_reason?: number;
  origin_invoice_status?: number[]; // Reissue Status
  Currency?: string[];
  invoice_number?: string;
  report_number?: string;
}
