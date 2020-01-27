export enum InvoicesScope {
  Disqualified = 'disqualified',
  IncorrectCharges = 'incorrect_charges',
  NeedYourInput = 'need_your_input',
  PendingApproval = 'pending_approval',
  PendingReissue = 'pending_reissue',
  PendingSubmission = 'pending_submission',
  Rejected = 'rejected',
}

export const invoicesScopeNamesMap = {
  [InvoicesScope.Disqualified]: 'Disqualified',
  [InvoicesScope.IncorrectCharges]: 'Incorrect Charges',
  [InvoicesScope.NeedYourInput]: 'Need Your Input',
  [InvoicesScope.PendingApproval]: 'Pending Approval',
  [InvoicesScope.PendingReissue]: 'Pending Reissue',
  [InvoicesScope.PendingSubmission]: 'Pending Submission',
  [InvoicesScope.Rejected]: 'Rejected',
};
