import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';

import * as fromAmountForm from './amount-form/amount-form.reducer';
import * as fromApprove from './approve/approve.reducer';
import * as fromCases from './cases/cases.reducer';
import * as fromCasesFilterForm from './cases-filter-form/cases-filter-form.reducer';
import * as fromCasesFilterFormState from './cases-filter-form/cases-filter-form.state';
import * as fromCommentForm from './comment-form/comment-form.reducer';
import { selectUserEmail } from '../../common/services/store/reducers';
import * as fromDateRangeForm from './date-range-form/date-range-form.reducer';
import * as fromDvr from './dvr/dvr.reducer';
import * as fromDvrSelects from './dvr/dvr.selects';
import * as fromDvrState from './dvr/dvr.state';
import { environment } from '../../../environments/environment';
import * as fromRefundFilterForm from './refund-filter-form/refund-filter-form.reducer';

export interface State {
  amountForm: fromAmountForm.State;
  approve: fromApprove.State;
  cases: fromCases.State;
  casesFilter: fromCasesFilterFormState.State;
  commentForm: fromCommentForm.State;
  dateRangeForm: fromDateRangeForm.State;
  dvr: fromDvrState.State;
  refundFilterForm: fromRefundFilterForm.State;
}

export const reducers: ActionReducerMap<State> = {
  amountForm: fromAmountForm.reducer,
  approve: fromApprove.reducer,
  cases: fromCases.reducer,
  casesFilter: fromCasesFilterForm.reducer,
  commentForm: fromCommentForm.reducer,
  dateRangeForm: fromDateRangeForm.reducer,
  dvr: fromDvr.reducer,
  refundFilterForm: fromRefundFilterForm.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectFeatureState = createFeatureSelector<State>('dvr');

/* Amount Form */

export const selectAmountFormState = createSelector(
  selectFeatureState,
  (state: State) => state.amountForm,
);
export const selectAmountAsString = createSelector(
  selectAmountFormState,
  fromAmountForm.selectAmountAsString,
);
export const selectAmountMod = createSelector(selectAmountFormState, fromAmountForm.selectMod);
export const selectAmountFromTo = createSelector(
  selectAmountAsString,
  selectAmountMod,
  fromAmountForm.selectAmountFromTo,
);

/* Approve */

export const selectApproveState = createSelector(
  selectFeatureState,
  (state: State) => state.approve,
);
export const selectApprove = createSelector(selectApproveState, fromApprove.selectApprove);
export const selectApproveEntities = createSelector(
  selectApproveState,
  fromApprove.selectApproveEntities,
);
export const selectApproveHash = createSelector(selectApproveState, fromApprove.selectApproveHash);
export const selectApproveStatus = createSelector(selectApproveState, fromApprove.selectStatus);
export const selectCanDoApprove = createSelector(
  selectApproveState,
  fromApprove.selectCanDoApprove,
);

/* Cases */

export const selectCasesState = createSelector(selectFeatureState, (state: State) => state.cases);
export const selectCases = createSelector(selectCasesState, fromCases.selectCases);
export const selectCasesListCounts = createSelector(
  selectCasesState,
  fromCases.selectCasesListCounts,
);

/* CasesFilterForm */

export const selectCasesFilterFormState = createSelector(
  selectFeatureState,
  (state: State) => state.casesFilter,
);
export const selectCasesFilter = createSelector(
  selectCasesFilterFormState,
  fromCasesFilterForm.selectCasesFilter,
);
export const selectSelectedEntitiesIds = createSelector(
  selectCasesFilterFormState,
  fromCasesFilterForm.selectSelectedEntitiesIds,
);
export const selectSelectedTimeFrame = createSelector(
  selectCasesFilterFormState,
  fromCasesFilterForm.selectSelectedTimeFrame,
);

/* Comment Form */

export const selectCommentFormState = createSelector(
  selectFeatureState,
  (state: State) => state.commentForm,
);
export const selectCombinedRefundComments = createSelector(
  selectCommentFormState,
  fromCommentForm.selectCombinedRefundComments,
);

/* Date Range Form */

export const selectDateRangeFormState = createSelector(
  selectFeatureState,
  (state: State) => state.dateRangeForm,
);

/* Dvr */

export const selectDvrState = createSelector(selectFeatureState, (state: State) => state.dvr);
export const selectActiveAccountId = createSelector(
  selectDvrState,
  fromDvrSelects.selectActiveAccountId,
);
export const selectActiveAccountName = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectAccountName,
);
export const selectActiveEntityId = createSelector(
  selectDvrState,
  fromDvrSelects.selectActiveEntityId,
);
export const selectActiveEntityAggregate = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectEntityAggregate,
);
export const selectActiveEntityName = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectEntityName,
);
export const selectActiveIsUpdatedEntity = createSelector(
  selectActiveEntityAggregate,
  fromDvrSelects.selectIsUpdatedEntity,
);
export const selectCountryOptions = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectCountryOptions,
);
export const selectEntities = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectEntities,
);
export const selectMultiselectEntities = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectMultiselectEntities,
);
export const selectMultiselectSelectedEntities = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectSelectedEntitiesIds,
  fromDvrSelects.selectMultiselectSelectedEntities,
);
export const selectIsEmptyDvr = createSelector(selectDvrState, fromDvrSelects.selectIsEmptyDvr);
export const selectIsUpdatedEntities = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectIsUpdatedEntities,
);
export const selectActiveAccountStatistics = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectAccountStatistics,
);
export const selectPotentialForAccount = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectPotentialForAccount,
);
export const selectActiveEntityStatistics = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectEntityStatistics,
);
export const selectPotentialForEntity = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectPotentialForEntity,
);
export const selectSelectedGroupedRefundNodes = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDvrSelects.selectSelectedGroupedRefundNodes,
);
export const selectTouchedEntities = createSelector(
  selectDvrState,
  selectActiveAccountId,
  fromDvrSelects.selectTouchedEntities,
);

/* Refund Filter Form */

export const selectRefundFilterFormState = createSelector(
  selectFeatureState,
  (state: State) => state.refundFilterForm,
);
export const selectActiveCountryCode = createSelector(
  selectRefundFilterFormState,
  fromRefundFilterForm.selectCountry,
);
export const selectCountryFilter = createSelector(
  selectRefundFilterFormState,
  fromRefundFilterForm.selectCountryFilter,
);

/* Complicated */

export const selectIsDisabledEntities = createSelector(
  selectDateRangeFormState,
  selectActiveAccountId,
  fromDateRangeForm.selectIsDisabledEntities,
);
export const selectEnd = createSelector(
  selectDateRangeFormState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDateRangeForm.selectEnd,
);
export const selectRefundNodes = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveCountryCode,
  selectActiveEntityId,
  fromDvrSelects.selectRefundNodes,
);
export const selectRefunds = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveCountryCode,
  selectActiveEntityId,
  fromDvrSelects.selectRefunds,
);
export const selectSelectedFlatNodes = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveCountryCode,
  selectActiveEntityId,
  fromDvrSelects.selectSelectedFlatNodes,
);
export const selectStart = createSelector(
  selectDateRangeFormState,
  selectActiveAccountId,
  selectActiveEntityId,
  fromDateRangeForm.selectStart,
);
export const selectDraft = createSelector(
  selectDvrState,
  selectActiveAccountId,
  selectActiveEntityId,
  selectUserEmail,
  selectEnd,
  selectStart,
  selectCombinedRefundComments,
  fromDvrSelects.selectDraft,
);
