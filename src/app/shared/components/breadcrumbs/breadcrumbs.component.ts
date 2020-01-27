import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Breadcrumb, BreadcrumbMap } from '../../../common/models/routing.model';
import { AppState, selectRouter } from '../../../common/store/reducers';
import { RouterStateUrl } from '../../../common/store/router/router.serializer';
import { BreadcrumbsUtil } from '../../../shared/utils/breadcrumbs.util';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnChanges, OnDestroy, OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  private breadcrumbMapChanges = new BehaviorSubject(null);

  @Input()
  public breadcrumbMap: BreadcrumbMap = {};

  private componentDestroyed$ = new Subject();

  constructor(private store: Store<AppState>) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['breadcrumbMap']) {
      this.breadcrumbMapChanges.next(null);
    }
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  public ngOnInit(): void {
    combineLatest(this.store.pipe(select(selectRouter)), this.breadcrumbMapChanges)
      .pipe(
        map(([routeState]) => routeState),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe((routeState: RouterStateUrl) => this.generateBreadcrumbs(routeState));
  }

  private generateBreadcrumbs(routeState: RouterStateUrl): void {
    this.breadcrumbs = BreadcrumbsUtil.generateBreadcrumbs(
      routeState.dataOfPaths,
      this.breadcrumbMap,
    );
  }
}
