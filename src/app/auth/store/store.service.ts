import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AllowedAction, ServiceEnrichment } from '~/common/models/permissions.model';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs/operators';
import { MatchedInvoices } from '~/common/models/invoices-models/invoice.model';
import { GateApiService } from '~/common/services/gate/gate-api.service';

const COMPLIANCE_ASSURANCE_ROLE_NAME = 'ComplianceAssurance';

const DISABLED_FEATURES = [
  'NMI',
  'recovery',
  'corporateIncomeTax',
  // 'bik',
  'complianceTrainer',
  'vendorDirect',
];

@Injectable()
export class StoreService {
  public listOfUniqueServices: string[] = [];
  public listOfCompanies: string[] = [];
  public isDataReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private isEnableComplianceAssurance = false;
  private disabledFeatures = [...DISABLED_FEATURES];

  constructor(private gateApiService: GateApiService) {}

  public UpdateListOfRoles(serviceEnrichment: ServiceEnrichment): void {
    const allowedActions = serviceEnrichment.allowedActions.filter(
      (allowedAction: AllowedAction) => {
        return !!allowedAction.service;
      },
    );
    this.listOfUniqueServices = allowedActions.map(
      (allowedAction: AllowedAction) => allowedAction.service,
    );
    this.listOfUniqueServices = this.listToUniqueList(this.listOfUniqueServices);
    this.listOfCompanies = serviceEnrichment.filter.accounts;
    this.isDataReady.next(true);
  }

  // Determine if in development environment
  public isInDevEnv() {
    return environment.isMock || environment.isProxy;
  }

  public isRoleAuthorized(roleName: string): boolean {
    const roleNameLower = roleName.toLowerCase();
    if (roleName === COMPLIANCE_ASSURANCE_ROLE_NAME) {
      return this.isEnableComplianceAssurance;
    } else {
      return (
        !this.isDisabledFeatures(roleName) &&
        (this.isInDevEnv() || this.isRoleExistInListOfRoles(roleNameLower))
      );
    }
  }

  public setCompAuthByAccount(accountId: number) {
    this.gateApiService
      .getMatchedInvoices(accountId)
      .pipe(take(1))
      .subscribe((matchedInvoices: MatchedInvoices) => {
        const isEnableComplianceAssurance = !!matchedInvoices.matched_invoices;
        if (isEnableComplianceAssurance !== this.isEnableComplianceAssurance) {
          // Compliance assurance should be enable
          this.isEnableComplianceAssurance = isEnableComplianceAssurance;
          this.isDataReady.next(true);
        }
      });
  }

  private isRoleExistInListOfRoles(roleNameLower: string): boolean {
    return (
      !!this.listOfUniqueServices &&
      this.listOfUniqueServices.filter(role => role.toLowerCase().includes(roleNameLower)).length >
        0
    );
  }

  private listToUniqueList(listToUnify: any[]) {
    return Array.from(new Set(listToUnify));
  }

  private isDisabledFeatures(roleName: string) {
    return (
      this.disabledFeatures.filter((disabled_feature: string) => {
        return disabled_feature.toLowerCase().includes(roleName.toLowerCase());
      }).length > 0
    );
  }
}
