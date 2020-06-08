import { createAction, props } from '@ngrx/store';

export const refresh = createAction('[Comparer Component] refresh', props<{payload:{jobId:string, testCaseIndex:number}}>());
export const loaded = createAction( '[Comparer Component] loaded', props<{payload: any}>() );
export const cleanupNgrxStorage = createAction('[Comparer Component] cleanupNgrxStorage');

export const changeSizeMode = createAction('[Comparer Component] sizeMode', props<{payload:{mode:string}}>());
export const changeDisplayedImageMode = createAction('[Comparer Component] changeDisplayedImageMode', props<{payload:{mode:string}}>());

export const approve = createAction(
  '[Comparer Component] approve',
  props<{
    payload:{
      jobId: string,
      testCaseIndex: number,

      reportId: string,
      scenario: string,
      viewport: string
  }}>());

export const runAgain = createAction(
  '[Comparer Component] runAgain',
  props<{
    payload:{
      jobId: string,
      testCaseIndex: number,

      scenario: string,
      viewport: string
  }}>());
