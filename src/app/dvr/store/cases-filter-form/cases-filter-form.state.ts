import { Boxed, FormGroupState } from 'ngrx-forms';

import { TimeFrame } from '../../../common/models/time-frame.model';
import { ApproveStatus } from '../../models/dvr.model';

export interface CasesFilterFormValue {
  entities: Boxed<string[]>;
  id: string;
  status: ApproveStatus;
  timeFrame: TimeFrame;
}

export interface State extends FormGroupState<CasesFilterFormValue> {}
