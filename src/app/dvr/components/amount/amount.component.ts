import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import * as fromAmountForm from '../../store/amount-form/amount-form.reducer';
import { AmountMod } from '../../store/amount-form/amount-form.state';

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountComponent implements OnInit {
  public readonly AmountMod = AmountMod;

  @Input()
  public formState: fromAmountForm.State;

  constructor() {}

  public ngOnInit() {}
}
