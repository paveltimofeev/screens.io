import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Job Page Component] refresh', props<{payload:{id:string}}>());
export const loaded = createAction( '[Job Page Component] loaded', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Job Page Component] cleanupNgrxStorage');

export const approve = createAction('[Job Page Component] approve', props<
  {
    payload: {
      jobId: string,
      testCase: {
        reportId: string,
        label: string,
        viewportLabel: string
      }
    }
  }>());


/* PAGE ACTIONS */

export const runFailed = createAction('[Job Page Component] runFailed', props<{payload: {jobId: string}}>());
export const approveAllFailedCases = createAction('[Job Page Component] approveAllFailedCases', props<{payload: {jobId: string}}>());


/* DATA ACTIONS */

export const setSearchFilter = createAction('[Job Page Component] setSearchFilter', props<{payload:{filter:string}}>());
export const switchFullHeightMode = createAction( '[Job Page Component] switchFullHeightMode' );
export const setImageMode = createAction( '[Job Page Component] setImageMode', props<{payload:{mode:string}}>());
