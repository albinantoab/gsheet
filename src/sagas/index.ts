import { all, fork } from 'redux-saga/effects';
import sheetSaga from './sheetSaga';

export function* rootSaga() {
  yield all([
    fork(sheetSaga),
  ]);
}