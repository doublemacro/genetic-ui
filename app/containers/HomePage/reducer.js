/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { START_SIMULATION, STOP_SIMULATION, UPDATE_CURRENT_STRING } from './constants';

const targetString = "hello world good old genetic algorithms amirite guys?";

// The initial state of the App
export const initialState = {
  targetString: targetString,
  currentString: targetString,
  isSimulationRunning: false,
};

/* eslint-disable default-case, no-param-reassign */
const homeReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case START_SIMULATION:
        draft.isSimulationRunning = true;
        break;
      case STOP_SIMULATION:
        draft.isSimulationRunning = false;
        break;
      case UPDATE_CURRENT_STRING:
        draft.currentString = action.value;
        break;
    }
  });

export default homeReducer;
