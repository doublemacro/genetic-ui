/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import { updateCurrentString } from 'containers/HomePage/actions';

import request from 'utils/request';
import { makeSelectCurrentString } from 'containers/HomePage/selectors';
import { START_SIMULATION } from './constants';


export function* startSimulationSaga() {
  const currentString = yield select(makeSelectCurrentString());
  var startTime = new Date().getTime();
  var currentTime = new Date().getTime();

}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  yield all(
    [
      // takeLatest(START_SIMULATION, startSimulationSaga)
    ]
  )
}
