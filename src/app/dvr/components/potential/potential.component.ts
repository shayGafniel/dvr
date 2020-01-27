import { getCurrencySymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { PotentialHelper } from '../../helpers/potential.helper';
import { Slice } from '../../models/pie-chart.model';
import { Potential, PotentialDisplay } from '../../models/potential.model';

@Component({
  selector: 'app-potential',
  templateUrl: './potential.component.html',
  styleUrls: ['./potential.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PotentialComponent implements OnInit {
  @Input()
  public accountName: string;
  @Input()
  public entityName: string;
  @Input()
  public potentialForAccount: Potential;
  @Input()
  public potentialForEntity: Potential;

  constructor() {}

  public ngOnInit() {}

  public get currencySymbolForAccount(): string {
    return getCurrencySymbol(this.potentialForAccount.currencyCode, 'narrow');
  }

  public get currencySymbolForEntity(): string {
    return getCurrencySymbol(this.potentialForEntity.currencyCode, 'narrow');
  }

  public get slicesForAccount(): Slice[] {
    return PotentialHelper.potentialToSlicesWholeNumber(this.potentialForAccount);
  }

  public get slicesForEntity(): Slice[] {
    return PotentialHelper.potentialToSlices(this.potentialForEntity);
  }

  public get sortedAccountPotentialDisplays(): PotentialDisplay[] {
    return PotentialHelper.getSortedPotentialDisplays(this.potentialForAccount);
  }

  public get sortedEntityPotentialDisplays(): PotentialDisplay[] {
    return PotentialHelper.getSortedPotentialDisplays(this.potentialForEntity);
  }

  public get totalAccountValue(): number {
    return PotentialHelper.getTotalValue(this.potentialForAccount);
  }

  public get totalEntityValue(): number {
    return PotentialHelper.getTotalValue(this.potentialForEntity);
  }
}
