import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StoreService } from '~/auth/store/store.service';
import { getNavigationConfig } from './navigation.configuration';
import { NavGroup, NavGroups, NavItem } from '~/shared/models/navigation.model';
import { Router } from '@angular/router';
import { SharedDialogComponent } from '~/shared/components/shared-dialog/shared-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  public readonly navigation: NavGroups = getNavigationConfig();
  public currGroup = 0;

  @Input()
  public accIdPrefixInUrl = 'ac';
  @Output()
  public sidenavToggle = new EventEmitter<void>();

  constructor(
    private storeService: StoreService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.storeService.isDataReady.subscribe((isDataReady: boolean) => {
      if (isDataReady) {
        this.navigation.forEach((navGroup: NavGroup) => {
          navGroup.items.forEach((navItem: NavItem) => {
            if (navItem.children) {
              navItem.children.forEach((childNavItem: NavItem) => {
                this.setNavItemAuthorizedValue(childNavItem);
              });
            }
            this.setNavItemAuthorizedValue(navItem);
          });
        });
      }
    });
  }

  public onClickSupport() {
    const dialogRef = this.dialog.open(SharedDialogComponent);
    dialogRef.componentInstance.title = `Support`;
    dialogRef.componentInstance.message = `Please contact support@vatbox.com`;
  }
  public onSidenavToggle(): void {
    this.sidenavToggle.emit();
  }

  public generateUrlWithAccountId(pathName: string): string {
    return `${this.accIdPrefixInUrl}${pathName}`;
  }

  public isRouterActive(navItem: NavItem): boolean {
    const url = `/${this.generateUrlWithAccountId(navItem.url)}`;
    return navItem.isExact ? this.router.url === url : this.router.url.startsWith(url);
  }

  public onClickRouter(groupIndex, itemIndex) {
    this.currGroup = this.navigation[groupIndex].items[itemIndex].children ? groupIndex : null;
  }

  private setNavItemAuthorizedValue(navItem: NavItem): void {
    if (navItem.roleName) {
      navItem.isAuthorized = this.storeService.isRoleAuthorized(navItem.roleName);
    }
  }
}
