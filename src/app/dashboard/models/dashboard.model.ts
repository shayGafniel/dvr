import { Company, CompanyGroup } from '~/common/services/gate/models/rails-data.model';
import { PaidBy } from '~/shared/models/main-filters.model';

export interface DashboardResponse {
  refund_potential: number;
  recovery_potential_by_data: number;

  overall_submitted: number;
  submitted_reissued: number;
  pending_submission: number;
  pending_submission_reissued: number;

  disqualified: number;
  need_your_input: number;
  need_your_input_count: number;
  pending_reissue: number;

  overall_refunded: number;
  overall_refunded_reissued: number;
  pending_approval: number;
  pending_approval_reissued: number;

  incorrect_charges: number;
  rejected: number;
}

export interface Dashboard {
  refundPotential: number;
  recoveryPotentialByData: number;

  overallSubmitted: number;
  submittedReissued: number;
  pendingSubmission: number;
  pendingSubmissionReissued: number;

  disqualified: number;
  needYourInput: number;
  needYourInputCount: number;
  pendingReissue: number;

  overallRefunded: number;
  overallRefundedReissued: number;
  pendingApproval: number;
  pendingApprovalReissued: number;

  incorrectCharges: number;
  rejected: number;
}

export interface DashboardFilters {
  date_from?: string; // Format YYYY-MM
  date_to?: string; // Format YYYY-MM
  entity_id?: string[]; // Match to company
  group_id?: number; // Match to company_group
  country?: string;
  countries?: string[];
  origin_countries?: string[];
  expense_domains?: number[];
  expense_types?: number[];
  directive?: number;
  directives?: number[];
  invoiced_at_from?: string;
  invoiced_at_to?: string;
  company_group?: CompanyGroup; // Account
  companies?: Company[];
  paid_by?: PaidBy;
}

export interface DashboardGraphsFilters {
  [param: string]: string | string[];
  entity_id?: string[]; // Match to company
  group_id?: string; // Match to company_group
}

export interface PromotionFilters {
  group_id?: string;
  date_from?: string; // Format YYYY-MM
  date_to?: string; // Format YYYY-MM
}
