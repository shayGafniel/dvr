import { getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { approveStatusColorMap, approveStatusTitleMap, Case } from '../../models/case.model';
import { ApproveStatus } from '../../models/dvr.model';
import { Router } from '@angular/router';

const CASES_BASE_ROUTE = '/tailored/cases/';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesListComponent implements OnInit {
  public readonly displayedColumns = [
    'caseId',
    'entityName',
    'createdAt',
    'potentialAmount',
    'countries',
    'createdBy',
    'approvedBy',
    'status',
  ];

  @Input()
  public cases: Case[];
  @Input()
  public currencyCode = 'EUR';

  constructor(private router: Router) {}

  public ngOnInit() {}

  public get currencySymbol(): string {
    return getCurrencySymbol(this.currencyCode, 'narrow');
  }

  public detectColor(status: ApproveStatus): string {
    return approveStatusColorMap[status];
  }

  public mapStatus(status: ApproveStatus): string {
    return approveStatusTitleMap[status];
  }

  public redirectToCase(caseId: number): void {
    this.router.navigate([CASES_BASE_ROUTE, caseId]);
  }
}
