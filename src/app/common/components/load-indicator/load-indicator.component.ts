import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadIndicatorService } from '../../services/load-indicator/load-indicator.service';

@Component({
  selector: 'common-load-indicator',
  templateUrl: './load-indicator.component.html',
  styleUrls: ['./load-indicator.component.scss'],
})
export class LoadIndicatorComponent implements OnInit {
  public isLoading$: Observable<boolean>;

  constructor(private loadIndicatorService: LoadIndicatorService) {}

  public ngOnInit() {
    this.isLoading$ = this.loadIndicatorService.isLoadingChanges.asObservable();
  }
}
