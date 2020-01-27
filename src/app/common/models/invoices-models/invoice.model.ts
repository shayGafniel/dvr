import { FilterSelection } from '../common.model';

export interface Invoice {
  company?: {
    name: string;
  };
  invoiceNumber?: string;
  country?: {
    name: string;
    code: string;
  };
  invoicedDate?: string;
  category?: string;
  vatRate?: string;
  invoiceAmount?: string;
  reclaimAmount?: string;
  supplier?: {
    name: string;
  };
  invoiceDate?: string;
  originInvoiceStatus?: string;
  status: string;
  id: number;
}

export interface GetInvoicesServerBody {
  invoices: {
    id: number;
    supplier_name?: string;
    supplier_address?: string;
    invoice_name?: string;
    company: {
      url?: string;
      name: string;
    };
    agent?: {
      id: number;
      url: string;
      name: string;
    };
    category?: string;
    vat_rate?: string;
    country?: {
      code: string;
      name: string;
    };
    invoice_date?: string;
    reclaim_amount?: string;
    url?: string;
    supplier_url?: string;
    actions?: {
      title: string;
      url: string;
    }[];
    origin_invoice_status?: string;
    status?: string;
    invoice_amount?: string;
    scan_url?: string;
  }[];
}

export interface GetInvoiceByIdServerBody {
  invoice: {
    id: number;
    directive: string;
    claim_vat_amount: string;
    status: string;
    invoice_history: string;
    account_comments_for_processing: string;
    expense_domain: string;
    paid_by: string;
    account: string;
    report: string;
    country: {
      name?: string;
      code: string;
    };
    expense_type: {
      id: number;
      name: string;
    };
    invoice_date: string;
    invoice_name: string;
    total_amount: number;
    approved_amount: number;
    currency: string;
    total_claim_vat_amount: number;
    total_vat_paid: number;
    total_net_amount: number;
    vat_rate: number;
    claim_vat_rate: number;
    supplier: {
      id: number;
      name: string;
      address: string;
      address_id: string;
      vat_id: string;
      tax_id: string;
      url: string;
    };
    valid_company_names_by_client_policy: string;
    valid_company_names_by_cvatbox_policy: string;
    company_name_on_invoice: string;
    company_name_and_address: {
      id: number;
      name: string;
    };
    employee_name: string;
    employee_name_and_address: {
      id: number;
      name: string;
    };
    client_vat_id_on_invoice: {
      company_vat_id_type: number;
      company_vat_id_value: string;
    };
    document_type: {
      id: number;
      name: string;
    };
    is_simplified: boolean;
    proof_of_payment_existence: boolean;
    wrongly_charged: boolean;
    ng_status: {
      id: number;
      reason: string;
      status: string;
      suspected_duplicates: string;
    };
    duplication_status: string;
    origin_invoice_status: {
      id: number;
      name: string;
    };
    invoice_status: {
      id: number;
      name: string;
    };
    reject_reason: {
      id: number;
      name: string;
    };
    reissue_reason: {
      id: number;
      type: string;
    };
    commission_type: {
      id: number;
      name: string;
    };
    reclaim: {
      id: number;
      url: string;
      status: string;
      refund_amount: string;
      gap_amount: string;
      agent: number;
    };
    vatbox_comments: string;
    vat_breakdowns: Array<VATBreakDownItemServerBody>;
    scans: Array<ServerScanItem>;
    guest_indication?: any;
    personal_expense?: any;
    guest_count?: number;
    attendees_count?: number;
    province?: string;
    agent?: any;
    reviewed_by_cs?: boolean;
  };
}

export interface ServerScanItem {
  id: number;
  imaginary_id: string;
  selected: boolean;
}

export interface VATBreakDownItem {
  id?: number;
  vatRate?: number;
  amount?: number;
  vatPaid?: number; // "vat paid" at the ui table
  expenseTypeId?: string;
  expenseTypeText?: string;
  claimVatAmount?: number;
  netAmount?: number;
  taxType?: string;
  source?: number;
  _destroy?: number | null;
}

export interface VATBreakDownItemServerBody {
  id?: number;
  percent?: number;
  amount?: number;
  vat_amount?: number; // "vat paid" at the ui table
  category_id?: number;
  category_text?: string;
  claim_vat_amount?: number;
  exclude_vat_amount?: number;
  tax_type?: string;
  source?: number;
  _destroy?: number | null;
}

export interface ScanItem {
  id: number;
  imaginaryId: string;
  selected: boolean;
  numPdfPages: number;
  mimeType: string;
  isPageResource: boolean;
  fileName?: string;
}

export interface GetFieldsOptionsServerBody {
  company_name_and_address_tooltip: string;
  account_note: string;
  document_type_select: Array<any>;
  employee_name_and_address_select: Array<any>;
  company_name_and_address_select: Array<any>;
  clients_vat_id_on_invoice_select: string[];
  origin_invoice_status_select: {
    id: number;
    name: string;
  }[];
  invoice_status_select: {
    id: number;
    name: string;
  }[];
  reject_reason_select: {
    id: number;
    name: string;
  }[];
  reissue_reason_select: {
    id: number;
    name: string;
  }[];
  agent_select: {
    id: number;
    name: string;
  }[];
  disabled_fields: Array<string>;
  mandatory_fields: Array<string>;
  directive: string;
  company_valid_name: string;
  valid_invoice_explanation: string;
  commission_type_select?: {
    name: string;
    id: number;
  }[];
  tax_type_select?: Array<string>;
  is_simplified?: boolean;
  is_vat_reg?: boolean;
}

export interface FormOptions {
  directive?: string;
  companyNameAndAddress?: Array<any>;
  accountNote?: string;
  documentType?: Array<any>;
  employeeNameAndAddress?: Array<any>;
  clientVATIdOnInvoice?: Array<string>;
  originInvoiceStatus?: {
    id: number;
    name: string;
  }[];
  invoiceStatus?: {
    id: number;
    name: string;
  }[];
  rejectReason?: {
    id: number;
    name: string;
  }[];
  reissueReason?: {
    id: number;
    name: string;
  }[];
  agent?: {
    id: number;
    name: string;
  }[];
  disabledFields: Array<string>;
  mandatoryFields: Array<string>;
  countries?: {
    name: string;
    code: string;
  }[];
  currencies?: {
    name: string;
    code: string;
  }[];
  categories?: Array<any>;
  commissionType?: {
    id: number;
    name: string;
  }[];
  taxType?: Array<string>;
  isSimplified?: boolean;
  isVatReg?: boolean;
}

export interface InvoicesPutInvoiceBody {
  invoice: InvoicesPutInvoiceData;
  action?: {
    type?: string;
  };
  filters?: {
    prop_1?: string;
  };
}

export interface InvoicesPutInvoiceData {
  recalc_status: boolean;
  invoice: {
    id?: number;
    directive?: string;
    claim_vat_amount?: string;
    status?: number;
    invoice_history?: string;
    account_comments_for_processing?: string;
    expense_domains?: string;
    paid_by?: string;
    account?: string;
    report?: string;
    invoice_amount?: number;
    invoiced_at?: string;
    country?: string;
    expense_type?: {
      id?: number;
      name?: string;
    };
    invoice_date?: string;
    invoice_number?: string;
    total_amount?: string;
    reclaim_amount?: number;
    vat_exclude_amount?: number;
    vat_paid_amount?: number;
    approved_amount?: {
      approved_amount?: string;
      currency?: string;
    };
    currency?: string;
    total_claim_vat_amount?: string;
    total_vat_paid?: string;
    total_net_amount?: string;
    vat_rate?: number;
    claim_vat_rate?: string;
    supplier_id?: number;
    supplier_name?: string;
    supplier_address_id?: string;
    agent_id?: number;
    company_id?: number;
    valid_company_names_by_client_policy?: string;
    valid_company_names_by_cvatbox_policy?: string;
    company_name_on_invoice?: string;
    company_name_and_address?: number;
    employee_name?: string;
    employee_name_and_address?: number;
    client_vat_id_on_invoice?: {
      company_vat_id_type?: number;
      company_vat_id_value?: string;
    };
    document_type?: number;
    vat_breakdowns_attributes?: {
      id?: number;
      percent?: number;
      amount?: number;
      vat_amount?: number;
      expense_type_id?: number;
      claim_vat_amount?: number;
      exclude_vat_amount?: number;
    }[];
    scans?: string[];
    is_simplified?: boolean;
    proof_of_payment_existence?: boolean;
    wrongly_charged?: boolean;
    ng_status?: {
      id?: number;
      reason?: string;
      status?: string;
      suspected_duplicates?: string;
    };
    duplication_status?: string;
    origin_invoice_status?: number;
    reject_reason?: {
      id?: number;
      name?: string;
    };
    reissue_reason_values?: number[];
    commission_type?: number;
    reclaim?: {
      id?: number;
      url?: string;
      status?: string;
      refund_amount?: string;
      gap_amount?: string;
    };
    vatbox_comments?: string;
  };
}

export interface PutInvoiceResponseBody {
  success: boolean;
  next_invoice: string;
  list_path: string;
  filter: any;
}

export interface FieldsTriggerOptionsReloadBody {
  documentType?: number;
  companyId?: number;
  countryValue?: number;
  invoiceDate?: string;
  employeeNameAndAddress?: number;
  companyNameAndAddress?: number;
  expenseTypeId?: number;
  invoiceId: number;
}

export interface InvoiceErrorsServerModel {
  status: number;
  status_text: string;
  general_error: any;
  invoice_errors: any;
}

export interface InvoiceDataStatusModel {
  message: string;
  invoiceErrors?: any;
}

export interface InvoiceVatRateData {
  expenseType?: {
    id: number;
    name: string;
  };
  date: string;
  originCountry: string;
  country: {
    code: string;
  };
  guestIndication: any;
  personalExpense: any;
  guestCount: number;
  attendeesCount: number;
  province: string;
  totalAmount: {
    amount: number;
    currency: string;
  };
  isVatReg: boolean;
  vatBreakdown?: VATBreakDownItemServerBody[];
  approvedAmount?: {
    amount: number;
    currency: string;
  };
  claimVatAmount: number;
  vatPaid: number;
  netAmount: number;
  vatRate: number;
  claimVatRate: string;
  companyId: number;
  invoiceId: number;
}

export interface EligibilityVatRateData {
  claimVatAmount: number;
  netAmount: number;
  vatPaid: number;
  approvedAmount: number;
  vatRate: number;
  vatBreakdown: VATBreakDownItem[];
}

/**
 * Rails server params for options reload
 */
export interface InvoiceReloadOptionServerParams {
  id: number;
  country: string;
  document_type_id?: number;
  company_name_and_address?: number;
  employee_name_and_address?: number;
  invoiced_at?: string;
  company_id?: number;
  invoice_category_id?: number;
}

export interface InvoiceReloadOptionsFormValues {
  id: number;
  country?: any;
  documentType?: any;
  employeeNameAndAddress?: number;
  companyNameAndAddress?: number;
  date?: string;
  companyId?: number;
  expenseType?: {
    id: number;
    name?: string;
  };
}

export interface VatRegServerParams {
  id: string;
  country: string;
  invoiced_at: string;
  company_id: string;
}

export interface VatRegServerResponse {
  is_vat_reg: boolean;
  error: string | null;
}

export interface InvoicesOptions {
  invoice_category?: FilterSelection[];
  reject_reason?: FilterSelection[];
  status?: FilterSelection[];
}

export interface MatchedInvoices {
  matched_invoices: boolean;
}

export interface InvoicesFilterOption {
  id: number;
  name: string;
}

export type InvoicesOptionsResponse = Record<keyof InvoicesOptions, InvoicesFilterOption[]>;

export function convertInvoicesOptionsResponse(res: InvoicesOptionsResponse): InvoicesOptions {
  return Object.entries(res).reduce((options: InvoicesOptions, [key, values]) => {
    options[key] = values.map(
      value => ({ value: value.id, viewValue: value.name } as FilterSelection),
    );

    return options;
  }, {});
}
